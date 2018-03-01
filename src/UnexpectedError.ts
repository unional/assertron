export class UnexpectedError extends Error {
  // istanbul ignore next
  constructor(public err: any) {
    super(`Threw unexpected exception: ${err}`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
