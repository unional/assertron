// istanbul ignore file
import t from 'assert';
import isPromise from 'is-promise';
import { isError } from 'lodash';
import { ErrorConstructor } from './errors';

export function runAsync(fn) {
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

export function runSequentialAsync(...fns) {
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

export function runParallelAsync(...fns) {
  return Promise.all(fns.map(fn => runAsync(fn)))
}


export function assertIsPromise(promiseError: Promise<any>) {
  t(isPromise(promiseError))
}

export function assertIsError(err: Error) {
  t(isError(err))
}

export function assertThrows<E extends Error>(fn, ErrorType?: ErrorConstructor<E>): E {
  try {
    fn()
  }
  catch (e) {
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
    }
    return e
  }
  throw new Error(`${fn} does not throw as expected`)
}

export async function assertAsyncThrows<E extends Error>(fn, ErrorType?: ErrorConstructor<E>): Promise<E> {
  try {
    await fn()
  }
  catch (e) {
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
    }
    return e
  }
  throw new Error(`${fn} does not throw as expected`)
}

