import { AssertionError } from '../errors.js'
import { notResolvedMessage } from '../utils/index.js'

export function resolves(promise: Promise<any>) {
  return promise.then(
    () => { },
    error => { throw new AssertionError(notResolvedMessage(error), { ssf: resolves }) }
  )
}
