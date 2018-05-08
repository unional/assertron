import { FailedAssertion } from './errors'
import { tersify } from 'tersify';

export function resolves(promise: Promise<any>) {
  return promise.then(
    () => { },
    err => {
      throw new FailedAssertion(undefined, err, `Expected promise to resolve, but it rejects with ${
        typeof err === 'string' ?
          `'${err}'` :
          err instanceof Error ?
            err :
            tersify(err, { maxLength: Infinity })}`)
    }
  )
}

export function rejects(promise: Promise<any>) {
  return promise.then(
    value => {
      throw new FailedAssertion(undefined, value, `Expected promise to reject, but it resolves with ${
        typeof value === 'string' ?
          `'${value}'` :
          tersify(value, { maxLength: Infinity })}`)
    },
    () => { }
  )
}
