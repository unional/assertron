import t from 'assert'
import isPromise from 'is-promise'
import { isFunction, isArray } from 'lodash'
import { pathEqual } from 'path-equal'
import { tersify } from 'tersify'

import { NotRejected } from './NotRejected'
import { NotEqual } from './NotEqual'
import { NotThrown } from './NotThrown'
import { InvalidUsage } from './InvalidUsage'
import { ReturnNotRejected } from './ReturnNotRejected'
import { satisfy } from './satisfy'
import { UnexpectedError } from './UnexpectedError'
import { ErrorConstructor, ErrorValidator, isErrorConstructor, FailedAssertion } from './errors'
import { resolves, rejects } from './promise'

// NOTE: `Promise<X>`, `PromiseLike<X>` and `() => X` only describes the resolve/return value.
// They don't describe reject/Error type.
// Thus, it is not possible to infer the return type of the `throws()`,
// except for the `ErrorConstructor` overload.

export interface Assertron {
  throws<E extends Error = Error & { [k: string]: any }>(value: (() => any) | PromiseLike<any>, error?: ErrorConstructor<E>, message?: string): Promise<E>,
  throws<T = any>(value: PromiseLike<any>, error?: ErrorValidator, message?: string): Promise<T>,
  throws<T = any>(value: (() => any) | PromiseLike<any>, error?: ErrorValidator, message?: string): T,
  pathEqual(actual: string, expected: string): void
  satisfy: typeof satisfy,
  false(value: any): void,
  resolves(promise: Promise<any>): Promise<void>
  rejects(promise: Promise<any>): Promise<void>,
  equal<T>(actual: T, expected: T): void,
  deepEqual<T extends Array<any>>(actual: T, expected: T): void
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
  satisfy,
  false(value) {
    if (isFunction(value)) {
      const result = value()
      if (result !== false) {
        throw new FailedAssertion(value, result, `Expected '${tersify(value)}' to equal false, but received ${result}`)
      }
    }
    else if (value !== false) {
      throw new FailedAssertion(value, value, `Expected value to equal false, but received ${value}`)
    }
  },
  resolves,
  rejects,
  equal<T>(actual: T, expected: T) {
    if (actual !== expected) {
      throw new NotEqual(actual, expected)
    }
  },
  deepEqual(actual, expected) {
    if (isArray(actual) && JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new NotEqual(actual, expected)
    }
    t.deepStrictEqual(actual, expected)
  }
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
