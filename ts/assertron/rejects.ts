import { AssertionError } from '../errors.js'
import { notRejectedMessage } from '../utils/index.js'

export function rejects<R = any>(promise: Promise<any>): Promise<R> {
  return promise.then(
    value => { throw new AssertionError(notRejectedMessage(value), { ssf: rejects }) },
    err => err
  )
}
