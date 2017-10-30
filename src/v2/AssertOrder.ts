
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
  maxStep: number | undefined
}

class StateMachine {
  listeners = {}
  step: number
  subStep: number
  constructor(public maxStep?: number) {
    this.step = 1
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
    const { step, subStep, maxStep } = this
    return {
      step,
      subStep,
      maxStep
    }
  }
  on(step: number, listener) {
    this.listeners[step] = [listener]
  }
  isNotValid(step: number) {
    return step !== this.step || (this.maxStep !== undefined && this.maxStep < step)
  }
  isValid(step: number) {
    return step === this.step
  }
  isMaxStepDefined() {
    return this.maxStep !== undefined
  }
  stopAccepting() {
    this.maxStep = this.step - 1
  }
  isAccepting() {
    return this.maxStep ? this.maxStep >= this.step : true
  }
  reachedMaxStep() {
    return
  }
}

export class AssertError extends Error {
  method: string
  steps: number[]
  state: State
  constructor(method: string, steps: number[], state: State) {
    super()
    this.method = method
    this.steps = steps
    this.state = state
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

  constructor(plan?: number) {
    this.state = new StateMachine(plan)
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
    if (this.state.isValid(step)) {
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
    return this.atLeast(step, 1)
  }

  atLeast(step: number, times: number) {
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

  any(steps: number[]) {
    const index = steps.indexOf(this.state.step)
    if (index === -1)
      throw new AssertError('any', steps, this.state.get())

    this.state.move()
    return steps[index]
  }
  onAny(steps: number[], ...asserts: Function[]) {
    steps.forEach(step => {
      this.state.on(step, () => {
        let firstError
        let hasPass = false
        asserts.forEach(assert => {
          try {
            assert(step)
            hasPass = true
          }
          catch (err) {
            if (!firstError) firstError = err
          }
        })
        if (!hasPass)
          throw firstError
      })
    })
    return
  }
  end(timeout: number): Promise<void>
  end(): void
  end(timeout?: number) {
    if (timeout) {
      return new Promise(r => {
        setTimeout(r, timeout)
      }).then(() => {
        this.end()
      })
    }

    if (!this.state.isMaxStepDefined()) {
      this.state.stopAccepting()
      return
    }

    if (this.state.isAccepting()) {
      throw new AssertError('end', [], this.state.get())
    }
  }
  exactly(step: number, times: number) {
    console.log(step, times)
  }
  private assert(method: string, step: number) {
    if (this.state.isNotValid(step)) {
      throw new AssertError(method, [step], this.state.get())
    }
  }
}
