import { AssertionError } from '../errors.js'
import { notResolvedMessage } from '../utils/index.js'

export function resolves(promise: Promise<any>): Promise<void> {
	return promise.then(
		v => v,
		error => {
			throw new AssertionError(notResolvedMessage(error), { ssf: resolves })
		}
	)
}
