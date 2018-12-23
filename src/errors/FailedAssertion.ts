import { BaseError } from 'make-error'

export class FailedAssertion extends BaseError {
  // istanbul ignore next
  constructor(public expected, public result, msg: string) {
    super(msg)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
