import isPromise = require('is-promise')

import { NotRejected } from './NotRejected'
import { InvalidUsage } from './InvalidUsage'
import { NotThrown } from './NotThrown'
import { ReturnNotRejected } from './ReturnNotRejected'
import { UnexpectedError } from './UnexpectedError'

export type ErrorValidator = (value) => boolean

export interface Assertron {
  throws(value: PromiseLike<any>, error?: ErrorValidator, message?: string): Promise<any>,
  throws(value: () => any | PromiseLike<any>, error?: ErrorValidator, message?: string): any
}

export const assertron: Assertron = {
  throws(value: PromiseLike<any> | (() => any | PromiseLike<any>), validator?: ErrorValidator): any {
    if (typeof value !== 'function' && !isPromise(value)) {
      throw new InvalidUsage('`assertron.throws()` must be called with a function or promise.')
    }

    if (isPromise(value)) {
      return value.then(
        val => { throw new NotRejected(val) },
        err => {
          if (validator && !validator(err)) {
            throw new UnexpectedError(err)
          }
        }
      )
    }

    const { threw, result } = tryCatch(value)
    if (!threw) {
      if (isPromise(result)) {
        return result.then(
          val => { throw new ReturnNotRejected(val) },
          err => {
            if (validator && !validator(err)) {
              throw new UnexpectedError(err)
            }
          }
        )
      }
      throw new NotThrown(result)
    }
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

