import { tersify } from 'tersify';
import { ErrorConstructor, ErrorValidator } from '.';
import { isErrorConstructor } from './util';

export function unexpectedErrorMessage(actual: any, expected: ErrorValidator | ErrorConstructor<any>) {
  return `Unexpected error. Expecting '${isErrorConstructor(expected) ? expected.name : tersify(expected)}' but received ${actual.name ? actual.name + ': ' : ''}${tersify(actual)}`
}
