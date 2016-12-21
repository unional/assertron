
export class AssertOrder {
  private static fnMap = {
    step: 'once',
    any: 'some'
  }
  private possibleSteps: { [index: string]: number[] }
  private allCounter = 0
  private planCount: number | undefined
  constructor(initStep = 0) {
    this.possibleSteps = {
      once: [initStep],
      some: [initStep],
      all: [initStep]
    }
  }

  step(step: number) {
    this.validate(step, 'step', {
      once: [step + 1],
      some: [step + 1],
      all: [step + 1]
    })
  }

  any(step: number) {
    this.validate(step, 'any', {
      once: [step + 1],
      some: [step, step + 1],
      all: [step + 1]
    })
  }
  some(step: number) {
    this.validate(step, 'some', {
      once: [step + 1],
      some: [step, step + 1],
      all: [step + 1]
    })
  }

  all(step: number, plan: number) {
    if (plan <= 0) {
      throw new Error(`${plan} is not a valid 'plan' value.`)
    }
    if (this.planCount === undefined) {
      this.planCount = plan
    }
    else if (plan !== this.planCount) {
      throw new Error(`The plan count (${plan}) does not match with previous value (${this.planCount}).`)
    }

    if (++this.allCounter === plan) {
      this.allCounter = 0
      this.planCount = undefined
      this.validate(step, 'all', {
        once: [step + 1],
        some: [step + 1],
        all: [step + 1]
      })
    }
    else {
      this.validate(step, 'all', {
        all: [step]
      })
    }
  }

  /**
   * Assert the specified step will run once.
   */
  once(step: number) {
    this.validate(step, 'once', {
      once: [step + 1],
      some: [step + 1],
      all: [step + 1]
    })
  }

  private validate(step: number, fnName: string, steps) {
    const id = AssertOrder.fnMap[fnName] || fnName
    if (this.possibleSteps[id] && this.possibleSteps[id].indexOf(step) !== -1) {
      this.possibleSteps = steps
    }
    else {
      throw new Error(this.getErrorMessage(fnName, step))
    }
  }

  private getErrorMessage(calledFn: string, calledStep: number) {
    const should: string[] = []
    for (let key in this.possibleSteps) {
      should.push(`'${key}(${this.possibleSteps[key]})'`)
    }

    return `Expecting ${should.join(', ')}, but received '${calledFn}(${calledStep})'`
  }
}
