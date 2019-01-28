import { tersify } from 'tersify';
import AssertionError from 'assertion-error';

export function rejects(promise: Promise<any>) {
  return promise.then(
    value => {
      throw new AssertionError(
        `Expected promise to reject, but it resolves with ${
        typeof value === 'string' ?
          `'${value}'` :
          tersify(value, { maxLength: Infinity })}`,
        { value },
        rejects)
    },
    () => { }
  )
}
