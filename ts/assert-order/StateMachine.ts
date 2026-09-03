import type { State } from './types.js'

// `performance.now()` is the one high-resolution clock every target runtime agrees on:
// it is a global in Node (>=16), Bun, Deno and browsers. Reaching for `node:perf_hooks`
// or `process.hrtime` instead would make this module depend on a Node builtin for a
// clock the platform already provides. `Date.now()` remains the fallback for an exotic
// host that exposes neither.
const now: () => number =
	typeof globalThis.performance?.now === 'function' ? () => globalThis.performance.now() : () => Date.now()

const timeTracker = (() => {
	let tick = 0
	return {
		start() {
			tick = now()
		},
		taken() {
			return now() - tick
		},
	}
})()

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
			for (const l of listeners) l()
		}
		return this.step
	}
	moveSubStep() {
		const subStep = ++this.subStep
		if (this.maxSubStep === this.subStep) this.move()
		return subStep
	}
	get(): State {
		const { step, subStep, maxStep, minSubStep, maxSubStep } = this
		return {
			step,
			maxStep,
			subStep,
			minSubStep,
			maxSubStep,
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
