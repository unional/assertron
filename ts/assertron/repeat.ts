import isPromise from 'is-promise'
import { FailOnOccurrence } from '../errors.js'

/**
 * Repeat the specified function n times and return the last result.
 * If the result is a promise, it will run the function sequentially.
 */
export function repeat<R>(
	fn: () => R | (() => Promise<R>),
	times: number
): ReturnType<typeof fn> extends Promise<R> ? Promise<R> : R {
	return repeatRecur(fn, 1, times)
}

function repeatRecur<R>(
	fn: () => R | (() => Promise<R>),
	i: number,
	times: number
): ReturnType<typeof fn> extends Promise<R> ? Promise<R> : R {
	try {
		const result = fn()
		if (i === times) return result as any

		if (isPromise(result)) {
			return result.then(
				() => repeatRecur(fn, i + 1, times),
				e => {
					throw new FailOnOccurrence(i, e, { ssf: repeat })
				}
			) as any
		} else {
			return repeatRecur(fn, i + 1, times)
		}
	} catch (e) {
		if (e instanceof FailOnOccurrence) throw e
		throw new FailOnOccurrence(i, e, { ssf: repeat })
	}
}
