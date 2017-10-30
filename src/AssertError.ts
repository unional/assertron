import { State } from './interfaces'

export class AssertError extends Error {
  method: string
  args: any[]
  state: State
  constructor(state: State, method: string, ...args: any[]) {
    super()
    this.method = method
    this.args = args
    this.state = state
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
