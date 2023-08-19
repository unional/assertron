import { AssertionError } from '../errors.js'

export function truthy(value: unknown, message?: string | undefined): void {
	if (!value)
		throw new AssertionError(message ?? `Expected value to be truthy, but received ${value}`, { ssf: truthy })
}
