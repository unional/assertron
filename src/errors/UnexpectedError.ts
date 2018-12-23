import { BaseError } from 'make-error';
import { tersify } from 'tersify';
import { ErrorConstructor, ErrorValidator } from '../errors';
import { isErrorConstructor } from './util';

export class UnexpectedError extends BaseError {
  // istanbul ignore next
  constructor(public expected: ErrorValidator | ErrorConstructor<any>, public actual: any) {
    super(`Unexpected error. Expecting '${isErrorConstructor(expected) ? expected.name : tersify(expected)}' but received ${actual.name ? actual.name + ': ' : ''}${tersify(actual)}`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
