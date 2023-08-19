import { AssertionError } from '../errors.js'

export function falsy(value: unknown, message?: string): void {
	if (value)
		throw new AssertionError(message ?? `Expected value to be falsy, but received ${value}`, { ssf: falsy })
}
