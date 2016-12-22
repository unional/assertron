export interface Steps {
  once?: number[]
  some?: number[]
  all?: number[]
}

export class AssertOrder {
  private static alias = {
    step: 'once',
    any: 'some',
    plan: 'all'
  }
  private static reverseAlias = {
    once: ['step'],
    some: ['any'],
    all: ['plan']
  }

  private possibleSteps: Steps
  private planCounter = 0
  private targetCount: number | undefined
  constructor(initStep = 0) {
    this.possibleSteps = {
      once: [initStep],
      some: [initStep],
      all: [initStep]
    }
  }

  step(step: number) {
    this.validate('step', step, 1)
  }

  /**
   * Assert the specified step will be reached at least once.
   * @returns how many times this step has occured.
   */
  any(step: number) {
    return this.validate('any', step, undefined, {
      once: [step + 1],
      some: [step, step + 1],
      all: [step + 1]
    })
  }

  /**
   * Assert the specified step will be reached at least once.
   * @returns how many times this step has occured.
   */
  some(step: number) {
    return this.validate('some', step, undefined, {
      once: [step + 1],
      some: [step, step + 1],
      all: [step + 1]
    })
  }

  /**
   * Assert the specified step will be reached x times.
   * @returns how many times this step has occured.
   */
  all(step: number, plan: number) {
    return this.validate('all', step, plan, {
      all: [step]
    })
  }

  /**
   * Assert the specified step will be reached x times.
   * @returns how many times this step has occured.
   */
  plan(step: number, plan: number) {
    return this.validate('plan', step, plan, {
      all: [step]
    })
  }

  /**
   * Assert the specified step will run once.
   */
  once(step: number) {
    this.validate('once', step, 1)
  }

  private validate(fnName: string, step: number, count: number | undefined, steps: Steps = {
    once: [step + 1],
    some: [step + 1],
    all: [step + 1]
  }) {
    // console.log(fnName, step, count, this.possibleSteps)
    const id = AssertOrder.alias[fnName] || fnName

    if (this.possibleSteps[id] && this.possibleSteps[id].indexOf(step) !== -1) {
      if (step === (this.possibleSteps.once && this.possibleSteps.once[0])) {
        // It's advancing to the next step
        this.planCounter = 1
      }
      else {
        ++this.planCounter
      }

      if (count === undefined) {
        this.possibleSteps = steps
      }
      else if (count <= 0) {
        throw new Error(`${count} is not a valid 'plan' value.`)
      }
      else {
        if (this.targetCount === undefined) {
          this.targetCount = count
        }
        else if (count !== this.targetCount) {
          throw new Error(`The plan count (${count}) does not match with previous value (${this.targetCount}).`)
        }

        // console.log(this.planCounter, count)
        if (this.planCounter === count) {
          // counter reached. Resetting
          this.targetCount = undefined
          this.possibleSteps = {
            once: [step + 1],
            some: [step + 1],
            all: [step + 1]
          }
        }
        else {
          this.possibleSteps = steps
        }
      }
    }
    else {
      throw new Error(this.getErrorMessage(fnName, step))
    }

    return this.planCounter
  }

  private getErrorMessage(calledFn: string, calledStep: number) {
    const should: string[] = []
    for (let key in this.possibleSteps) {
      should.push(...([key, ...AssertOrder.reverseAlias[key]].map(name =>
        `'${name}(${this.possibleSteps[key].join('|')})'`
      )))
    }

    return `Expecting ${should.join(', ')}, but received '${calledFn}(${calledStep})'`
  }
}
