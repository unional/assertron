import { pathEqual as isPathEqual } from 'path-equal'
import { AssertionError } from '../errors'
import { notEqualMessage } from '../utils'

export function pathEqual(actual: string, expected: string) {
  if (!isPathEqual(actual, expected))
    throw new AssertionError(notEqualMessage(actual, expected), { ssf: pathEqual })
}
