import { InvalidOrder } from './InvalidOrder.js'
import { StateMachine } from './StateMachine.js'

// order.atLeast(step, count) // expected to be executed at least `count` times
// order.atMost(step, count) // exected to be executed at most `count` times

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
			throw new InvalidOrder(this.state.get(), 'not', [step], { ssf: this.not })
		}
	}

	/**
	 * Reset to specified step.
	 */
	jump(step: number) {
		this.state.jump(step)
	}

	/**
	 * Move to next step.
	 */
	move() {
		this.state.move()
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
		} else if (this.state.step === nextStep && this.state.subStep > 0) {
			return this.state.moveSubStep()
		} else throw new InvalidOrder(this.state.get(), 'atLeastOnce', [step], { ssf: this.atLeastOnce })
	}

	any(steps: number[], handler?: (step: number) => void) {
		const index = steps.indexOf(this.state.step)
		if (index === -1) throw new InvalidOrder(this.state.get(), 'any', [steps], { ssf: this.any })
		if (handler) handler(steps[index])

		this.state.move()
		return steps[index]
	}
	onAny(steps: number[], ...asserts: Array<(step: number) => unknown>) {
		steps.forEach(step => {
			this.state.on(step, () => {
				let firstError: any
				let hasPass = false
				asserts.forEach(assert => {
					try {
						assert(step)
						hasPass = true
					} catch (err) {
						if (!firstError) firstError = err
					}
				})
				if (!hasPass) throw firstError
			})
		})
		return
	}
	end(timeout: number): Promise<number>
	end(): number
	end(timeout?: number) {
		if (timeout) {
			return new Promise(r => {
				setTimeout(r, timeout)
			}).then(() => {
				return this.end()
			})
		}

		if (!this.state.isMaxStepDefined()) {
			this.state.stopAccepting()
			return this.state.getTimeTaken()
		}

		if (this.state.isAccepting()) {
			throw new InvalidOrder(this.state.get(), 'end', [], { ssf: this.end })
		}
	}
	exactly(step: number, times: number) {
		if (this.state.isNotValid(step))
			throw new InvalidOrder(this.state.get(), 'exactly', [step, times], { ssf: this.exactly })

		if (this.state.maxSubStep === undefined) {
			this.state.maxSubStep = times
			this.state.minSubStep = times
		}

		return this.state.moveSubStep()
	}
	wait(step: number): Promise<void>
	wait(step: number, callback: () => void): void
	wait(step: number, callback?: () => void) {
		if (callback) this.on(step, callback)
		else
			return new Promise<any>(a => {
				this.on(step, a)
			})
	}
	private assert(method: string, step: number) {
		if (this.state.isNotValid(step)) {
			throw new InvalidOrder(this.state.get(), method, [step], { ssf: (this as any)[method] })
		}
	}
}
