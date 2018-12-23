import { BaseError } from 'make-error'

export class ReturnNotRejected<T extends any> extends BaseError {
  // istanbul ignore next
  constructor(public value: T) {
    super(`Expected return promise to be rejected, but it was resolved instead '${value}'`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
