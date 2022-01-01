import { tersify } from 'tersify';
import { ErrorConstructor, ErrorValidator } from '../types';
import { isErrorConstructor } from './isErrorConstructor';

export function unexpectedErrorMessage(actual: any, expected: ErrorValidator | ErrorConstructor<any>) {
  return `Unexpected error. Expecting '${isErrorConstructor(expected) ?
    expected.name : tersify(expected)}' but received ${tersify(actual)}`
}
