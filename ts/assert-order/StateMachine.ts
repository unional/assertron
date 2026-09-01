// Deliberately the bare specifier, not `node:perf_hooks`: package.json's `browser`
// field maps `perf_hooks` to `false` for bundlers, and that mapping does not apply to
// the `node:` prefixed form.
// biome-ignore lint/style/useNodejsImportProtocol: see above
import * as perf from 'perf_hooks'
import type { State } from './types.js'

let timeTracker: { start(): void; taken(): number }

if (typeof globalThis.process?.hrtime === 'function') {
	let tick: [number, number]
	timeTracker = {
		start() {
			tick = globalThis.process.hrtime()
		},
		taken() {
			const [second, nanoSecond] = globalThis.process.hrtime(tick)
			return second * 1000 + nanoSecond / 1e6
		},
	}
} else if (perf.performance && typeof perf.performance.now === 'function') {
	const now = perf.performance.now
	let tick: number
	timeTracker = {
		start() {
			tick = now()
		},
		taken() {
			return now() - tick
		},
	}
} else {
	let tick: number
	timeTracker = {
		start() {
			tick = Date.now()
		},
		taken() {
			return Date.now() - tick
		},
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
