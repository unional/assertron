import { BaseError } from 'make-error'

export class NotThrown extends BaseError {
  // istanbul ignore next
  constructor(public value: any) {
    super(`Expect function to throw, but it returned '${value}' instead.`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
