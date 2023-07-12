import { pathEqual as isPathEqual } from 'path-equal'
import { AssertionError } from '../errors.js'
import { notEqualMessage } from '../utils/index.js'

export function pathEqual(actual: string, expected: string): void {
	if (!isPathEqual(actual, expected))
		throw new AssertionError(notEqualMessage(actual, expected), { ssf: pathEqual })
}
