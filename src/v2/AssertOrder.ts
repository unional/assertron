
// order.exactly(step, count) // expected to be executed exactly `count` times
// order.atLeast(step, count) // expected to be executed at least `count` times
// order.atMost(step, count) // exected to be executed at most `count` times

// // need more debate
// order.anyOf([step1, step2, ...], count)
// order.anyOf([step1, step2, ...], [count1, count2, ...])

// // alias
// order.atLeastOnce(step) // `atLeast(step, 1)`
// order.atMostOnce(step) // `atMost(step, 1)`

export interface State {
  step: number
  subStep: number
}

class StateMachine {
  listeners = {}
  subStep: number
  constructor(public step: number) {
    this.subStep = 0
  }
  move(step: number = this.step + 1) {
    this.step = step
    this.subStep = 0
    const listeners = this.listeners[step]
    if (listeners) {
      listeners.forEach(l => l())
    }
  }
  moveSubStep() {
    this.subStep++
  }
  get(): State {
    const { step, subStep } = this
    return {
      step,
      subStep
    }
  }
  on(step: number, listener) {
    this.listeners[step] = [listener]
  }
}

export class AssertError extends Error {
  method: string
  steps: number[]
  expecting: State
  constructor(method: string, steps: number[], expecting: State) {
    super()
    this.method = method
    this.steps = steps
    this.expecting = expecting
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AssertOrder {
  /**
   * Gets the current expecting step.
   */
  get currentStep() {
    return this.state.step
  }

  private state: StateMachine

  constructor() {
    this.state = new StateMachine(1)
  }

  /**
   * Asserts the current step is `step`.
   * @param step expected step.
   */
  is(step: number) {
    this.assert('is', step)
  }

  /**
   * Asserts the current step is not `step`.
   * @param step not expected step.
   */
  not(step: number) {
    if (step === this.state.step) {
      throw new AssertError('not', [step], this.state.get())
    }
  }

  /**
   * Moves the state to a new step.
   * @param step new step to move to. Move to next step if not specified.
   */
  move(step?: number) {
    this.state.move(step)
  }

  /**
   * Asserts the specified step will run once.
   */
  once(step: number) {
    this.assert('once', step)
    this.state.move()
  }

  on(step: number, assert: (step: number) => void) {
    this.state.on(step, () => {
      assert(step)
    })
  }

  atLeastOnce(step: number) {
    if (this.state.step === step) {
      this.state.move()
      this.state.moveSubStep()
      return this.state.subStep
    }
    else if (this.state.step === step + 1 && this.state.subStep > 0) {
      this.state.moveSubStep()
      return this.state.subStep
    }
    else
      throw new AssertError('atLeastOnce', [step], this.state.get())
  }
  any(...steps: number[]) {
    const index = steps.indexOf(this.state.step)
    if (index === -1)
      throw new AssertError('any', steps, this.state.get())

    this.state.move()
    return steps[index]
  }
  private assert(method: string, step: number) {
    if (step !== this.state.step) {
      throw new AssertError(method, [step], this.state.get())
    }
  }
}
