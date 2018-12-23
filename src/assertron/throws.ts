import isPromise from 'is-promise';
import { ErrorConstructor, ErrorValidator, InvalidUsage, NotRejected, NotThrown, ReturnNotRejected, UnexpectedError } from '../errors';
import { isErrorConstructor } from '../errors/util';

export function throws<E extends Error>(value: PromiseLike<any>, error?: ErrorValidator | ErrorConstructor<E>): Promise<E>
export function throws<E extends Error, R = any>(value: (...args: any[]) => R, error?: ErrorValidator | ErrorConstructor<E>): R extends Promise<any> ? Promise<E> : E
export function throws<T, R = any>(value: (...args: any[]) => R, validator?: ErrorValidator): R extends Promise<any> ? Promise<T> : T
export function throws(value: PromiseLike<any> | (() => any | PromiseLike<any>), validator?: ErrorValidator | ErrorConstructor<any>): any {
  if (typeof value !== 'function' && !isPromise(value)) {
    throw new InvalidUsage('`assertron.throws()` must be called with a function or promise.')
  }

  if (isPromise(value)) {
    return value.then(
      val => { throw new NotRejected(val) },
      err => {
        validateError(validator, err)
        return err
      }
    )
  }
  const { threw, err, result } = tryCatch(value)
  if (threw) {
    validateError(validator, err)
    return err
  }
  if (isPromise(result)) {
    return result.then(
      val => { throw new ReturnNotRejected(val) },
      err => {
        validateError(validator, err)
        return err
      }
    )
  }

  throw new NotThrown(result)
}

function tryCatch(fn) {
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

function validateError(validator, err) {
  if (validator) {
    if (isErrorConstructor(validator)) {
      if (!(err instanceof validator))
        throw new UnexpectedError(validator, err)
    }
    else if (!validator(err))
      throw new UnexpectedError(validator, err)
  }
}
