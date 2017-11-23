export type SatisfyExpected<T> = {
  [P in keyof T]: Partial<SatisfyExpected<T[P]>> | RegExp | Function
}

export function satisfy<
  Actual,
  Expected extends Partial<SatisfyExpected<Actual>>>(actual: Actual, expected: Expected) {
  satisfyInternal(actual, expected, '')
}
export class FailedPredicate extends Error {
  constructor(path: string) {
    super(`Property ${path ? path : 'actual'} fails predicate`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
export class NotMatch extends Error {
  constructor(actual, expected, path) {
    super(`Expect ${path ? path : 'actual'} to be ${typeof expected === 'string' ? `'${expected}'` : expected}, but received ${typeof actual === 'string' ? `'${actual}'` : actual}`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
export class MissingProperty extends Error {
  constructor(path: string) {
    super(`Missing property ${path}`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
function satisfyInternal(actual, expected, path: string) {
  if (expected instanceof RegExp && typeof actual === 'string')
    expected.test(actual)
  else if (expected instanceof Function) {
    if (!expected(actual))
      throw new FailedPredicate(path)
  }
  // tslint:disable-next-line
  else if (typeof actual !== typeof expected)
    throw new Error(`Type mismatch. Expecting ${typeof expected}`)
  else if (Array.isArray(actual)) {
    if (actual.length !== expected.length)
      throw new Error(`Number of entries does not match`)
    actual.forEach((a, i) => {
      const e = expected[i]
      satisfyInternal(a, e, `entry[${i}]`)
    })
  }
  else if (typeof actual !== 'object') {
    if (!Object.is(actual, expected))
      throw new NotMatch(actual, expected, path)
  }
  else
    Object.keys(expected).forEach(k => {
      if (actual[k] === undefined)
        throw new MissingProperty(path ? `${path}.${k}` : k)
      else
        satisfyInternal(actual[k], expected[k], path ? `${path}.${k}` : k)
    })
}
