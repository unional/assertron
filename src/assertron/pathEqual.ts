import AssertionError from 'assertion-error'
import { pathEqual as isPathEqual } from 'path-equal'
import { notEqualMessage } from '../errors'

export function pathEqual(actual: string, expected: string) {
  if (!isPathEqual(actual, expected))
    throw new AssertionError(
      notEqualMessage(actual, expected),
      { actual, expected },
      pathEqual)
}
