import { AssertionError } from '../errors'
import { notRejectedMessage } from '../utils'

export function rejects(promise: Promise<any>) {
  return promise.then(
    value => { throw new AssertionError(notRejectedMessage(value), { ssf: rejects }) },
    () => { }
  )
}
