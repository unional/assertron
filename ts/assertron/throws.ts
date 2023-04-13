import isPromise from 'is-promise'
import { AssertionError } from '../errors.js'
import type { ErrorConstructor, ErrorValidator } from '../types.js'
import { isErrorConstructor, notRejectedMessage, notThrownMessage, unexpectedErrorMessage } from '../utils/index.js'

export function throws<E extends Error>(value: PromiseLike<any>, error?: ErrorValidator | ErrorConstructor<E>): Promise<E>
export function throws<E extends Error>(value: (...args: any[]) => never, error?: ErrorValidator | ErrorConstructor<E>): E
export function throws<E extends Error, R = any>(value: (...args: any[]) => R, error?: ErrorValidator | ErrorConstructor<E>): R extends Promise<any> ? Promise<E> : E
export function throws<T, R = any>(value: (...args: any[]) => R, validator?: ErrorValidator): R extends Promise<any> ? Promise<T> : T
export function throws(value: PromiseLike<any> | (() => any | PromiseLike<any>), validator?: ErrorValidator | ErrorConstructor<any>): any {
  if (typeof value !== 'function' && !isPromise(value)) {
    throw new AssertionError(
      '`assertron.throws()` must be called with a function or promise.',
      { ssf: throws }
    )
  }

  if (!isPromise(value)) {
    const { threw, err, result } = tryCatch(value)
    if (threw) {
      if (failValidation(validator, err)) {
        throw new AssertionError(unexpectedErrorMessage(err, validator), { ssf: throws })
      }
      return err
    }
    value = result
  }

  if (isPromise(value)) {
    return value.then(
      value => { throw new AssertionError(notRejectedMessage(value), { ssf: throws }) },
      err => {
        if (failValidation(validator, err)) {
          throw new AssertionError(unexpectedErrorMessage(err, validator), { ssf: throws })
        }
        return err
      }
    )
  }

  throw new AssertionError(notThrownMessage(value), { ssf: throws })
}

function tryCatch(fn: () => any) {
  let result
  let err
  let threw = false
  try {
    result = fn()
  }
  catch (e) {
    err = e
    threw = true
  }
  return { threw, err, result }
}
function failValidation(validator: ErrorValidator | ErrorConstructor<any> | undefined, error: any): validator is ErrorValidator | ErrorConstructor<any> {
  if (!validator) return false

  if (isErrorConstructor(validator)) {
    return !(error instanceof validator)
  }
  else {
    return !validator(error)
  }
}

