import { AssertionError } from '../errors'
import { notResolvedMessage } from '../utils'

export function resolves(promise: Promise<any>) {
  return promise.then(
    () => { },
    error => { throw new AssertionError(notResolvedMessage(error), { ssf: resolves }) }
  )
}
