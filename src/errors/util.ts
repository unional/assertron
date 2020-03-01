import { ErrorConstructor } from './interfaces'

export function isErrorConstructor(validator: any): validator is ErrorConstructor<any> {
  return Object.prototype.isPrototypeOf.call(Error.prototype, validator.prototype)
}
