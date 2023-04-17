import { AssertionError } from '../errors.js'

export function truthy(value: unknown) {
	if (!value) throw new AssertionError(`Expected value to be truthy, but received ${value}`, { ssf: truthy })
}
