import { performance } from 'perf_hooks'

import { State } from './interfaces'

let startTick
let timeTaken
// istanbul ignore else
// tslint:disable-next-line
if (process && typeof process.hrtime === 'function') {
  startTick = process.hrtime
  timeTaken = function (startTick) {
    const [second, nanoSecond] = process.hrtime(startTick)
    return second * 1000 + nanoSecond / 1e6
  }
}
// tslint:disable-next-line
else if (performance && typeof performance.now === 'function') {
  startTick = performance.now
  timeTaken = function (startTick) {
    const end = performance.now()
    return end - startTick
  }
}
else {
  startTick = function () {
    return new Date().valueOf()
  }
  timeTaken = function (startTick) {
    return new Date().valueOf() - startTick
  }
}

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
    return timeTaken(this.startTick)
  }
  private getStartTick() {
    return startTick()
  }
}
