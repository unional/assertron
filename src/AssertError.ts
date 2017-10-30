import { State } from './interfaces'

export class AssertError extends Error {
  method: string
  args: any[]
  state: State
  constructor(state: State, method: string, ...args: any[]) {
    super(`Expecting ${getExpectingCalls(state)}, but received '${method}(${getMethodArgs(args)})'`)
    this.method = method
    this.args = args
    this.state = state
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function getExpectingCalls(state: State) {
  let message: string
  if (state.subStep === 0) {
    const methods = ['is', 'once', 'any']
    message = methods.map(m => ['any'].indexOf(m) === -1 ?
      `'${m}(${state.step})'` :
      `'${m}([${state.step}])'`
    ).join(', ')
  }
  else {
    const methods = ['exactly']
    message = methods.map(m => `'${m}(${state.step}, ${state.maxSubStep})'`).join(', ')
  }
  return message
}

function getMethodArgs(args: any[]) {
  return args.map(a => Array.isArray(a) ? `[${a.join(', ')}]` : a).join(', ')
}
