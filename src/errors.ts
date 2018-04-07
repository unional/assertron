import { BaseError } from 'make-error'

export type ErrorValidator = (value) => boolean
export type ErrorConstructor<E extends Error> = new (...args: any[]) => E

export function isErrorConstructor(validator): validator is ErrorConstructor<any> {
  return Error.prototype.isPrototypeOf(validator.prototype)
}

export class FailedAssertion extends BaseError {
  // istanbul ignore next
  constructor(public value, public result, msg: string) {
    super(msg)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
