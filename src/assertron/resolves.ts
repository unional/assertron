import { tersify } from 'tersify';
import { FailedAssertion } from '../errors';

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
