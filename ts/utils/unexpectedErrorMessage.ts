import { tersify } from 'tersify'
import type { ErrorConstructor, ErrorValidator } from '../types.js'
import { isErrorConstructor } from './isErrorConstructor.js'

export function unexpectedErrorMessage(actual: any, expected: ErrorValidator | ErrorConstructor<any>) {
  return `Unexpected error. Expecting '${isErrorConstructor(expected) ?
    expected.name : tersify(expected)}' but received ${tersify(actual)}`
}
