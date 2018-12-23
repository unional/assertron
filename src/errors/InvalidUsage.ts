import { BaseError } from 'make-error'

export class InvalidUsage extends BaseError {
  // istanbul ignore next
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
