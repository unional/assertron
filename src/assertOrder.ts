import { AssertError } from './assertError'
import { Steps } from './internalInterfaces'

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
  private onceCallbacks = {}
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
  end(timeout: number): Promise<void>
  end(): void
  end(timeout?: number) {
    const check = (() => {
      return this.plannedSteps === undefined || this.nextStep === this.plannedSteps
    })
    const getErrorMsg = () => `Planned ${this.plannedSteps} steps but executed ${this.nextStep} steps`

    if (timeout) {
      return new Promise<void>((resolve, reject) => {
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
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'step', step)
    }
  }

  /**
   * Assert the specified step will run once.
   */
  once(step: number) {
    return this.onceInternal('once', step)
  }

  private onceInternal(name: string, step: number) {
    if (this.isValidStep(name, [step])) {
      this.callCallbacks(step);
      this.moveNext()
      if (this.onceCallbacks[this.nextStep])
        this.once(this.nextStep);
      return this.nextStep
    }
    else {
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'once', step)
    }
  }

  private callCallbacks(step: number) {
    if (this.onceCallbacks[step]) {
      let firstError;
      let hasPass = false;
      this.onceCallbacks[step].forEach(cb => {
        try {
          cb(step);
          hasPass = true;
        }
        catch (err) {
          if (!firstError)
            firstError = err;
        }
      });
      if (!hasPass) {
        throw firstError;
      }
    }
  }

  /**
   * Assert this place will be called during any of the specified steps.
   * @returns the step it is being called right now.
   */
  any(...anySteps: number[]) {
    if (this.isValidStep('any', anySteps)) {
      return this.moveNext()
    }
    else {
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'any', ...anySteps)
    }
  }

<<<<<<< Updated upstream
=======
  onAny(steps: number[], ...callbacks: Function[]) {

    steps.forEach(step => {
      this.onceCallbacks[step] = (this.onceCallbacks[step] || []).concat(callbacks)
    })

    if (steps.indexOf(this.next) >= 0)
      this.once(this.next)
  }

>>>>>>> Stashed changes
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
        this.callCallbacks(step)
      }

      return ++this.miniSteps
    }
    else {
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'some', step)
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
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'all', step)
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
      throw new AssertError(this.possibleMoves, AssertOrder.reverseAlias, 'multiple', step)
    }
  }

  on(step: number, callback: Function) {
    this.onceCallbacks[step] = callback

    if (step === this.next) {
      this.once(step)
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
      this.updateMoves({
        all: [step]
      })
    }

    this.miniSteps++
    if (plan === this.miniSteps) {
      this.moveNext()
      this.targetMiniSteps = undefined
    }
    return this.miniSteps
  }

  private isValidStep(fnName: string, steps: number[], count?: number) {
    const id = AssertOrder.alias[fnName] || fnName
    const step = steps.find(s => this.possibleMoves[id] && this.possibleMoves[id].some(x => x === s))
    return (!count || this.miniSteps <= count) && step !== undefined
  }
  private moveNext(nextMoves: Steps = {
    once: [this.nextStep + 1],
    some: [this.nextStep + 1],
    all: [this.nextStep + 1]
  }) {
    this.updateMoves(nextMoves)
    return this.nextStep++
  }

  private updateMoves(nextMoves: Steps = {
    once: [this.nextStep + 1],
    some: [this.nextStep + 1],
    all: [this.nextStep + 1]
  }) {
    this.possibleMoves = nextMoves
  }
}
