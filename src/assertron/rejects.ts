import { tersify } from 'tersify';
import { FailedAssertion } from '../errors';

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
