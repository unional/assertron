import { State } from './interfaces'

// istanbul ignore next
function nodeVersionIsOrAbove(major: number, minor = 0, patch = 0) {
  // without this, systemjs will complain `process is not defined`
  if (!global.process)
    return false
  const versionString = process.version.startsWith('v') ? process.version.slice(1) : process.version
  const [actualMajor, actualMinor, actualPatch] = versionString.split('.').map(s => parseInt(s, 10))
  const checking = major * 1000 * 1000 + minor * 1000 + patch
  const actual = actualMajor * 1000 * 1000 + actualMinor * 1000 + actualPatch
  return actual >= checking
}

// istanbul ignore next
const performance = nodeVersionIsOrAbove(8, 5) ? require('perf_hooks').performance : undefined

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
    // istanbul ignore next
    return this.maxStep ? this.maxStep >= this.step : true
  }
  getTimeTaken() {
    return timeTaken(this.startTick)
  }
  private getStartTick() {
    return startTick()
  }
}
