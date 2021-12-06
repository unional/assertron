// istanbul ignore file
import t from 'assert'
import AssertionError from 'assertion-error'
import isPromise from 'is-promise'
import { isError } from 'lodash'
import { ErrorConstructor } from './errors'

export type AnyFunction = (...args: any[]) => any

export function runAsync(fn: AnyFunction) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn())
      }
      catch (err) {
        reject(err)
      }
    }, 1)
  })
}

export function runSequentialAsync(...fns: AnyFunction[]) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let i = 0
        for (; i < fns.length - 1; i++) {
          fns[i]()
        }
        resolve(fns[i]())
      }
      catch (err) {
        reject(err)
      }
    }, 1)
  })
}

export function runParallelAsync(...fns: AnyFunction[]) {
  return Promise.all(fns.map(fn => runAsync(fn)))
}


export function assertIsPromise(promiseError: Promise<any>) {
  t(isPromise(promiseError))
}

export function assertIsError(err: Error) {
  t(isError(err))
}

export function assertThrows<E extends Error>(fn: AnyFunction, ErrorType?: ErrorConstructor<E>): E {
  try {
    fn()
  }
  catch (e: any) {
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
    }
    return e
  }
  throw new Error(`${fn} does not throw as expected`)
}

export async function assertAsyncThrows<E extends Error>(fn: AnyFunction, ErrorType?: ErrorConstructor<E>): Promise<E> {
  try {
    await fn()
  }
  catch (e: any) {
    // console.log('catch clause', e)
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
    }
    // console.log('returning e')
    return e
  }
  throw new Error(`${fn} does not throw as expected`)
}


export function noStackTraceFor(filename: string, err: AssertionError<any>) {
  if (err.stack && RegExp(filename).test(err.stack))
    throw new Error(`contains internal stack: \n${err.stack}`)
}
