import AssertionError from 'assertion-error';
import { State } from './interfaces';

export class InvalidOrder extends AssertionError {
  constructor(state: State, method: string, ssf: Function, ...args: any[]) {
    const message = method === 'end' ? getEndMessage(state) : getExpectingMessage(state, method, args)
    super(message, { method, state, args }, ssf)
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
