export class NotThrown extends Error {
  // istanbul ignore next
  constructor(public value: any) {
    super(`Expect function to throw, but it returned instead '${value}'`)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
