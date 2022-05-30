import { AssertionError } from '../errors.js'
import { State } from './types.js'

export class InvalidOrder extends AssertionError {
  constructor(public state: State, public method: string, public args: any[], options: AssertionError.Options) {
    super(method === 'end' ? getEndMessage(state) : getExpectingMessage(state, method, args), options)
  }
}

function getEndMessage(state: State) {
  return `Planned for ${state.maxStep} step but expecting step ${state.step} when 'end()' is called`
}

function getExpectingMessage(state: State, method: string, args: any[]) {
  return `Expecting ${getExpectingCalls(state)}, but received '${method}(${getMethodArgs(args)})'`
}

function getExpectingCalls(state: State) {
  let message: string
  if (state.subStep === 0) {
    const methods = ['is', 'once', 'any']
    message = methods.map(
      m => `'${m}(${['any'].indexOf(m) === -1 ? state.step : `[${state.step}]`})'`
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
