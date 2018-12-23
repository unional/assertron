export class NotEqual<T extends any> extends Error {
  // istanbul ignore next
  constructor(public actual: T, public expected: T) {
    super(`"${actual}" does not equal "${expected}".`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
