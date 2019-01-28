import AssertionError from 'assertion-error';
import isPromise from 'is-promise';
import { ErrorConstructor, ErrorValidator, notRejectedMessage, notThrownMessage, returnNotRejectedMessage, unexpectedErrorMessage } from '../errors';
import { isErrorConstructor } from '../errors/util';

export function throws<E extends Error>(value: PromiseLike<any>, error?: ErrorValidator | ErrorConstructor<E>): Promise<E>
export function throws<E extends Error, R = any>(value: (...args: any[]) => R, error?: ErrorValidator | ErrorConstructor<E>): R extends Promise<any> ? Promise<E> : E
export function throws<T, R = any>(value: (...args: any[]) => R, validator?: ErrorValidator): R extends Promise<any> ? Promise<T> : T
export function throws(value: PromiseLike<any> | (() => any | PromiseLike<any>), validator?: ErrorValidator | ErrorConstructor<any>): any {
  if (typeof value !== 'function' && !isPromise(value)) {
    throw new AssertionError(
      '`assertron.throws()` must be called with a functio n or promise.',
      undefined,
      throws
      )
  }

  if (isPromise(value)) {
    return value.then(
      value => {
        throw new AssertionError(
          notRejectedMessage(value),
          { value },
          throws)
      },
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
      value => {
        throw new AssertionError(
          returnNotRejectedMessage(value),
          { value },
          throws)
      },
      err => {
        validateError(validator, err)
        return err
      }
    )
  }

  throw new AssertionError(
    notThrownMessage(result),
    { value: result },
    throws
  )
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

function validateError(validator, error) {
  if (validator) {
    if (isErrorConstructor(validator)) {
      if (!(error instanceof validator))
        throw new AssertionError(
          unexpectedErrorMessage(error, validator),
          { actual: error, expected: validator },
          throws
        )
    }
    else if (!validator(error))
      throw new AssertionError(
        unexpectedErrorMessage(error, validator),
        { actual: error, expected: validator },
        throws
      )
  }
}
