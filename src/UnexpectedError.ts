export class UnexpectedError extends Error {
  constructor(public err: any) {
    super(`Threw unexpected exception: ${err}`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
