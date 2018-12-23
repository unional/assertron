import { ErrorConstructor } from './interfaces'

export function isErrorConstructor(validator): validator is ErrorConstructor<any> {
  return Error.prototype.isPrototypeOf(validator.prototype)
}
