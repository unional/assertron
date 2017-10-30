// order.atLeast(step, count) // expected to be executed at least `count` times
// order.atMost(step, count) // exected to be executed at most `count` times

export interface State {
  step: number
  maxStep?: number
  subStep: number
  minSubStep?: number
  maxSubStep?: number
}

class StateMachine {
  listeners = {}
  step: number = 1
  maxStep?: number

  subStep: number = 0
  minSubStep?: number
  maxSubStep?: number
  constructor(maxStep?: number) {
    this.maxStep = maxStep
  }
  move(step: number = this.step + 1) {
    this.step = step
    this.subStep = 0
    const listeners = this.listeners[step]
    if (listeners) {
      listeners.forEach(l => l())
    }
    return this.step
  }
  moveSubStep() {
    const subStep = ++this.subStep
    if (this.maxSubStep === this.subStep)
      this.move()
    return subStep
  }
  get(): State {
    const { step, subStep, maxStep, minSubStep, maxSubStep } = this
    return {
      step,
      maxStep,
      subStep,
      minSubStep,
      maxSubStep
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
  args: any[]
  state: State
  constructor(state: State, method: string, ...args: any[]) {
    super()
    this.method = method
    this.args = args
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
      throw new AssertError(this.state.get(), 'not', step)
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
    const nextStep = step + 1
    if (this.state.step === step) {
      this.state.move()
      return this.state.moveSubStep()
    }
    else if (this.state.step === nextStep && this.state.subStep > 0) {
      return this.state.moveSubStep()
    }
    else
      throw new AssertError(this.state.get(), 'atLeastOnce', step)
  }

  any(steps: number[]) {
    const index = steps.indexOf(this.state.step)
    if (index === -1)
      throw new AssertError(this.state.get(), 'any', steps)

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
      throw new AssertError(this.state.get(), 'end')
    }
  }
  exactly(step: number, times: number) {
    if (this.state.isNotValid(step))
      throw new AssertError(this.state.get(), 'exactly', step, times)

    if (this.state.maxSubStep === undefined) {
      this.state.maxSubStep = times
      this.state.minSubStep = times
    }

    return this.state.moveSubStep()
  }

  private assert(method: string, step: number) {
    if (this.state.isNotValid(step)) {
      throw new AssertError(this.state.get(), method, step)
    }
  }
}
