import isPromise from 'is-promise'
import { pathEqual } from 'path-equal'

import { NotRejected } from './NotRejected'
import { NotEqual } from './NotEqual'
import { NotThrown } from './NotThrown'
import { InvalidUsage } from './InvalidUsage'
import { ReturnNotRejected } from './ReturnNotRejected'
import { satisfy } from './satisfy'
import { UnexpectedError } from './UnexpectedError'
import { ErrorConstructor, ErrorValidator, isErrorConstructor } from './errors'

// NOTE: `Promise<X>`, `PromiseLike<X>` and `() => X` only describes the resolve/return value.
// They don't describe reject/Error type.
// Thus, it is not possible to infer the return type of the `throws()`,
// except for the `ErrorConstructor` overload.

export interface Assertron {
  throws<E extends Error>(value: (() => any) | PromiseLike<any>, error?: ErrorConstructor<E>, message?: string): Promise<E>,
  throws<T = any>(value: PromiseLike<any>, error?: ErrorValidator, message?: string): Promise<T>,
  throws<T = any>(value: (() => any) | PromiseLike<any>, error?: ErrorValidator, message?: string): T,
  pathEqual(actual: string, expected: string): void
  satisfy: typeof satisfy
}

export const assertron: Assertron = {
  throws(value: PromiseLike<any> | (() => any | PromiseLike<any>), validator?: ErrorValidator | ErrorConstructor<any>): any {
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
  },
  pathEqual(actual: string, expected: string) {
    if (!pathEqual(actual, expected))
      throw new NotEqual(actual, expected)
  },
  satisfy
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
