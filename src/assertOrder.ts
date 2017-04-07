export interface Steps {
  once?: number[]
  some?: number[]
  all?: number[]
}

export class AssertOrder {
  private static alias = {
    step: 'once',
    any: 'once',
    multiple: 'all'
  }
  private static reverseAlias = {
    once: ['step'],
    some: [],
    all: ['multiple']
  }

  /**
   * Gets what is the next expecting step.
   * If the current step is `some(n)`, this reflects the step after `some(n)`
   */
  public get next() { return this.nextStep }
  private nextStep: number
  private possibleMoves: Steps
  private miniSteps = 0
  private targetMiniSteps: number | undefined
  constructor(public plannedSteps?: number, initStep = 0) {
    this.nextStep = initStep
    this.possibleMoves = {
      once: [initStep],
      some: [initStep],
      all: [initStep]
    }
  }

  /**
   * Verify all planned steps are executed.
   * @param timeout If specified, will return a promise that resolve after the specified time (in milliseconds) or rejected if failed.
   */
  end(timeout: number): Promise<never>
  end(): void
  end(timeout?: number) {
    const check = (() => {
      return this.plannedSteps === undefined || this.nextStep === this.plannedSteps
    })
    const getErrorMsg = () => `Planned ${this.plannedSteps} steps but executed ${this.nextStep} steps`

    if (timeout) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (check()) {
            resolve()
          }
          else {
            reject(new Error(getErrorMsg()))
          }
        }, timeout);
      })
    }

    if (!check()) {
      throw new Error(getErrorMsg())
    }
  }

  step(step: number) {
    if (this.isValidStep('step', [step])) {
      this.moveNext()
      return this.nextStep++
    }
    else {
      throw new Error(this.getErrorMessage('step', step))
    }
  }

  /**
   * Assert the specified step will run once.
   */
  once(step: number) {
    // this.validate('once', [step], 1)
    if (this.isValidStep('once', [step])) {
      this.moveNext()
      return this.nextStep++
    }
    else {
      throw new Error(this.getErrorMessage('once', step))
    }
  }

  /**
   * Assert this place will be called during any of the specified steps.
   * @returns the step it is being called right now.
   */
  any(...anySteps: number[]) {
    if (this.isValidStep('any', anySteps)) {
      this.moveNext()
      return this.nextStep++
    }
    else {
      throw new Error(this.getErrorMessage('any', ...anySteps))
    }
  }

  /**
   * Assert the specified step will be reached at least once.
   * @returns how many times this step has occured.
   */
  some(step: number) {
    if (this.isValidStep('some', [step])) {
      if (step === this.nextStep) {
        this.moveNext({
          once: [step + 1],
          some: [step, step + 1],
          all: [step + 1]
        })
        this.miniSteps = 0
        this.nextStep++
      }

      return ++this.miniSteps
    }
    else {
      throw new Error(this.getErrorMessage('some', step))
    }
  }

  /**
   * Assert the specified step will be reached x times.
   * @returns how many times this step has occured.
   */
  all(step: number, plan: number) {
    this.validatePlanned(plan)

    if (this.isValidStep('all', [step], plan)) {
      return this.moveAllState(step, plan)
    }
    else {
      throw new Error(this.getErrorMessage('all', step))
    }
  }

  /**
   * Assert the specified step will be reached x times.
   * @returns how many times this step has occured.
   */
  multiple(step: number, plan: number) {
    this.validatePlanned(plan)

    if (this.isValidStep('multiple', [step], plan)) {
      return this.moveAllState(step, plan)
    }
    else {
      throw new Error(this.getErrorMessage('multiple', step))
    }
  }

  private validatePlanned(plan) {
    if (plan <= 0) {
      throw new Error(`${plan} is not a valid 'plan' value.`)
    }
    if (this.targetMiniSteps && this.targetMiniSteps !== plan) {
      throw new Error(`The plan count (${plan}) does not match with previous value (${this.targetMiniSteps}).`)
    }
  }

  private moveAllState(step, plan) {
    if (this.targetMiniSteps === undefined) {
      this.targetMiniSteps = plan
      this.miniSteps = 0
      this.moveNext({
        all: [step]
      })
    }

    this.miniSteps++
    if (plan === this.miniSteps) {
      this.moveNext()
      this.nextStep++
      this.targetMiniSteps = undefined
    }
    return this.miniSteps
  }

  private isValidStep(fnName: string, steps: number[], count?: number) {
    // console.log(`${fnName}(${steps}${count ? ',' + count : ''}), c: ${this.currentStep}, m: ${this.miniSteps}`, this.possibleMoves)
    const id = AssertOrder.alias[fnName] || fnName
    const step = steps.find(s => this.possibleMoves[id] && this.possibleMoves[id].some(x => x === s))
    return (!count || this.miniSteps <= count) && step !== undefined
  }
  private moveNext(nextMoves: Steps = {
    once: [this.nextStep + 1],
    some: [this.nextStep + 1],
    all: [this.nextStep + 1]
  }) {
    this.possibleMoves = nextMoves
  }

  private getErrorMessage(calledFn: string, ...calledSteps: number[]) {
    const should: string[] = []
    for (let key in this.possibleMoves) {
      should.push(...([key, ...AssertOrder.reverseAlias[key]].map(name =>
        `'${name}(${this.possibleMoves[key].join('|')})'`
      )))
    }

    return `Expecting ${should.join(', ')}, but received '${calledFn}(${calledSteps.join(',')})'`
  }
}
