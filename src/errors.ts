
export type ErrorValidator = (value) => boolean
export type ErrorConstructor<E extends Error> = new (...args: any[]) => E

export function isErrorConstructor(validator): validator is ErrorConstructor<any> {
  return Error.prototype.isPrototypeOf(validator.prototype)
}
