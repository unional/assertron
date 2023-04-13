import * as perf from 'perf_hooks'
import type { State } from './types.js'

let timeTracker: { start(): void, taken(): number }
// istanbul ignore else
if (process && typeof process.hrtime === 'function') {
  let tick: [number, number]
  timeTracker = {
    start() { tick = process.hrtime() },
    taken() {
      const [second, nanoSecond] = process.hrtime(tick)
      return second * 1000 + nanoSecond / 1e6
    }
  }
}
else if (perf.performance && typeof perf.performance.now === 'function') {
  const now = perf.performance.now
  let tick: number
  timeTracker = {
    start() { tick = now() },
    taken() { return now() - tick }
  }
}
else {
  let tick: number
  timeTracker = {
    start() { tick = new Date().valueOf() },
    taken() { return new Date().valueOf() - tick }
  }
}

export class StateMachine {
  listeners: Record<number, Array<() => void>> = {}
  step = 1
  maxStep?: number

  subStep = 0
  minSubStep?: number
  maxSubStep?: number
  constructor(maxStep?: number) {
    this.maxStep = maxStep
    timeTracker.start()
  }
  jump(step: number) {
    this.step = step
    this.subStep = 0
    return this.step
  }
  move() {
    const listeners = this.listeners[this.step]
    this.step = this.step + 1
    this.subStep = 0
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
  on(step: number, listener: () => void) {
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
    // istanbul ignore next
    return this.maxStep ? this.maxStep >= this.step : true
  }
  getTimeTaken() {
    return timeTracker.taken()
  }
}
