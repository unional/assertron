import { State } from './interfaces'

export class StateMachine {
  listeners = {}
  step: number = 1
  maxStep?: number

  subStep: number = 0
  minSubStep?: number
  maxSubStep?: number
  private startTick: [number, number] | number
  constructor(maxStep?: number) {
    this.maxStep = maxStep
    this.startTick = this.getStartTick()
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
  getTimeTaken() {
    // istanbul ignore else
    // tslint:disable-next-line
    if (process && typeof process.hrtime === 'function') {
      const [second, nanoSecond] = process.hrtime(this.startTick as any)
      return second * 1000 + nanoSecond / 1e6
    }
    // tslint:disable-next-line
    else if (performance && typeof performance.now === 'function') {
      const end = performance.now()
      return end - (this.startTick as any)
    }
    else
      return new Date().valueOf() - (this.startTick as any)
  }
  private getStartTick() {
    // istanbul ignore else
    // tslint:disable-next-line
    if (process && typeof process.hrtime === 'function')
      return process.hrtime()
    // tslint:disable-next-line
    else if (performance && typeof performance.now === 'function')
      return performance.now()
    else
      return new Date().valueOf()
  }
}
