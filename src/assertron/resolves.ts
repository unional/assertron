import { tersify } from 'tersify'
import AssertionError from 'assertion-error'

export function resolves(promise: Promise<any>) {
  return promise.then(
    () => { },
    error => {
      throw new AssertionError(`Expected promise to resolve, but it rejects with ${typeof error === 'string' ?
        `'${error}'` :
        error instanceof Error ?
          error :
          tersify(error, { maxLength: Infinity })}`, { error }, resolves
      )
    }
  )
}
