import { AssertionError } from '../errors.js'

export function falsy(value: any) {
	if (value) throw new AssertionError(`Expected value to be falsy, but received ${value}`, { ssf: falsy })
}
