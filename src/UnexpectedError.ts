import { BaseError } from 'make-error'
import { tersify } from 'tersify'

export class UnexpectedError extends BaseError {
  // istanbul ignore next
  constructor(public err: any) {
    super(`Threw unexpected exception: ${tersify(err)}`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class DifferentError extends BaseError {
  constructor(public expected: string, public actual: any) {
    super(`Expecting '${expected}' but received ${actual.name ? actual.name + ': ' : ''}${tersify(actual)}`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
