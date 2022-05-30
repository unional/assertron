import { AssertionError } from '../errors.js'
import { notRejectedMessage } from '../utils/index.js'

export function rejects(promise: Promise<any>) {
  return promise.then(
    value => { throw new AssertionError(notRejectedMessage(value), { ssf: rejects }) },
    () => { }
  )
}
