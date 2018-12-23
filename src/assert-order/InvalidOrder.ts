import { BaseError } from 'make-error'

import { State } from './interfaces'

export class InvalidOrder extends BaseError {
  method: string
  args: any[]
  state: State
  constructor(state: State, method: string, ...args: any[]) {
    const message = method === 'end' ? getEndMessage(state) : getExpectingMessage(state, method, args)
    // istanbul ignore next
    super(message)
    Object.setPrototypeOf(this, InvalidOrder.prototype);
    this.method = method
    this.args = args
    this.state = state
  }
}
// util.inherits(InvalidOrder, Error)

function getEndMessage(state: State) {
  return `Planned for ${state.maxStep} step but expecting step ${state.step} when 'end()' is called`
}

function getExpectingMessage(state, method, args) {
  return `Expecting ${getExpectingCalls(state)}, but received '${method}(${getMethodArgs(args)})'`
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
