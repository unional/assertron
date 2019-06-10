import isPromise from 'is-promise';

/**
 * Repeat the specified function n times and return the last result.
 * If the result is a promise, it will run the function sequentially.
 */
export function repeat<R>(fn: () => R | (() => Promise<R>), times: number): ReturnType<typeof fn> extends Promise<R> ? Promise<R> : R {
  const result = fn()
  if (isPromise(result)) {
    if (times <= 1) return result as any
    return result.then(() => repeat(fn, times - 1)) as any
  }
  else {
    let result
    for (let i = 1; i < times; i++) {
      result = fn()
    }
    return result
  }
}
