import t from 'assert'
import a, { AssertionError } from '..'
import { assertAsyncThrows, assertIsError, assertIsPromise, assertThrows, noStackTraceFor } from '../testUtils'

test('when value is PromiseLike returns a promise with the rejected value', async () => {
  let actual = a.throws(Promise.reject(new Error('Miku')), Error)
  assertIsPromise(actual)
  t.equal((await actual).message, 'Miku')

  actual = a.throws(Promise.reject(new Error('Ren')), () => true)
  assertIsPromise(actual)
  t.equal((await actual).message, 'Ren')

  actual = a.throws(Promise.reject(new Error('Luka')))
  assertIsPromise(actual)
  t.equal((await actual).message, 'Luka')
})

test('when value is function returning a promise, will return a promise with the rejected value', async () => {
  let actual = a.throws(() => Promise.reject(new Error('Miku')), Error)
  assertIsPromise(actual)
  t.equal((await actual).message, 'Miku')

  actual = a.throws(() => Promise.reject(new Error('Luka')), () => true)
  assertIsPromise(actual)
  t.equal((await actual).message, 'Luka')

  actual = a.throws(() => Promise.reject('Ren'))
  assertIsPromise(actual)
  t.equal((await actual), 'Ren')
})

test('when value is function returns error', () => {
  let actual = a.throws((() => { throw new Error() }), Error)
  assertIsError(actual)

  actual = a.throws((() => { throw new Error() }))
  assertIsError(actual)
})

test('throws if input is not a function or promise', () => {
  assertThrows(() => a.throws(0 as any))
  assertThrows(() => a.throws(true as any))
  assertThrows(() => a.throws('...' as any))
  assertThrows(() => a.throws(/foo/ as any))
})

test('throws for resolved promise', () => {
  return assertAsyncThrows(() => a.throws(Promise.resolve('ok')), AssertionError)
})

test('throws error does not contain internal stack trace for resolved promise', async () => {
  const err = await assertAsyncThrows(() => a.throws(Promise.resolve('ok')), AssertionError)
  noStackTraceFor('throws.ts', err)
})

test('passes with rejected promise', async () => {
  const actual = await a.throws<string>(() => new Promise((_, r) => setImmediate(() => r('no'))))
  t.strictEqual(actual, 'no')
})

test('passes with rejected promise passing validator', () => {
  return a.throws(Promise.reject('no'), err => err === 'no')
})

test('throws with rejected promise failing validator', async () => {
  await assertAsyncThrows(
    () => a.throws(Promise.reject('no'), err => err !== 'no'),
    AssertionError)
})

test('thrown error does not contain internal stack trace with rejected promise failing validator', async () => {
  const err = await assertAsyncThrows(() => a.throws(Promise.reject('no'), err => err !== 'no'), AssertionError)
  // Error.captureStackTrace(err, a.throws)

  noStackTraceFor('throws.ts', err)
})

test('passes with throwing function', () => {
  a.throws(() => { throw new Error('foo') })
})

test('throws if function does not', () => {
  assertThrows(
    () => a.throws(() => { return 'foo' }, AssertionError),
    AssertionError
  )
})

test('thrown error does not contain internal stack track if function does not', () => {
  const err = assertThrows(
    () => a.throws(() => { return 'foo' }, AssertionError),
    AssertionError
  )
  noStackTraceFor('throws.ts', err)
})

test('throws if function returns resolved promise', async () => {
  await assertAsyncThrows(
    () => a.throws(() => Promise.resolve('ok')),
    AssertionError)
})

test('thrown error does not contain internal stack trace if function returns resolved promise', async () => {
  const err = await assertAsyncThrows(
    () => a.throws(() => Promise.resolve('ok')),
    AssertionError)
  noStackTraceFor('throws.ts', err)
})

test('pass if function returns rejected promise', () => {
  return a.throws(() => { return Promise.reject('ok') })
})

test('pass if function returns rejected promise passing valdation', () => {
  return a.throws(
    () => { return Promise.reject('ok') },
    err => err === 'ok')
})

test('throws if function returns rejected promise not passing valdation', async () => {
  await assertAsyncThrows(
    () => a.throws(() => Promise.reject('ok'), err => err !== 'ok'),
    AssertionError
  )
})

test('thrown error does not contain stack trace if function returns rejected promise not passing valdation', async () => {
  const err = await assertAsyncThrows(
    () => a.throws(() => Promise.reject('ok'), err => err !== 'ok'),
    AssertionError
  )
  // console.log('got err', err)
  noStackTraceFor('throws.ts', err)
})

class FakeError extends Error {
  constructor(msg?: string) {
    super(msg || 'some fake msg')

    Object.setPrototypeOf(this, new.target.prototype)
  }
  foo = 'foo'
}

test('validate Promise using Error constructor', async () => {
  const err = await a.throws(Promise.reject(new FakeError('abc')), FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate Promise using another Error constructor will throw', async () => {
  const err = await assertAsyncThrows(() => a.throws(Promise.reject(new FakeError()), AssertionError), AssertionError)

  t.strictEqual(err.message, `Unexpected error. Expecting 'AssertionError' but received FakeError('some fake msg')`)
})

test('validate () => Promise using Error constructor', async () => {
  const err = await a.throws(() => Promise.reject(new FakeError()), FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate () => Promise using another Error constructor will throw', () => {
  return assertAsyncThrows(() => a.throws(() => Promise.reject(new FakeError()), AssertionError))
})

test('validate () => throw using Error constructor', async () => {
  const err = await a.throws((() => { throw new FakeError() }) as any, FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate () => throw using another Error constructor will throw', async () => {
  return t.throws(() => a.throws((() => { throw new FakeError() }) as any, AssertionError))
})

test(`a.throws(() => never) returns error of type Error`, () => {
  const err = a.throws(() => { throw new Error('failure') })
  expect(err.message).toBe('failure')
})

test('throw if function returns an object', () => {
  class Dummy { a = 1; foo() { } }
  const err = assertThrows(() => a.throws(() => new Dummy()), AssertionError)
  expect(err.message).toBe(`Expect function to throw, but it returned 'Dummy { a: 1 }' instead.`)
})
