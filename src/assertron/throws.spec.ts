import t from 'assert';
import AssertionError from 'assertion-error';
import a from '..';
import { assertAsyncThrows, assertIsError, assertIsPromise, assertThrows, noStackTraceFor } from '../testUtils';

test('when value is PromiseLike returns Promise', async () => {
  let actual = a.throws(Promise.reject(new Error()), Error)
  assertIsPromise(actual)

  actual = a.throws(Promise.reject(new Error()), () => true)
  assertIsPromise(actual)

  actual = a.throws(Promise.reject(new Error()))
  assertIsPromise(actual)
})

test('when value is function returning promise, will return promise', () => {
  let actual = a.throws(() => Promise.reject(new Error()), Error)
  assertIsPromise(actual)

  actual = a.throws(() => Promise.reject(new Error()), () => true)
  assertIsPromise(actual)

  actual = a.throws(() => Promise.reject())
  assertIsPromise(actual)
})

test('when value is function returns error', () => {
  let actual = a.throws((() => { throw new Error() }) as () => void, Error)
  assertIsError(actual)

  actual = a.throws((() => { throw new Error() }) as () => void)
  assertIsError(actual)
})

test('throws InvalidUsage if input is not a function or promise', () => {
  assertThrows(() => a.throws(0 as any))
  assertThrows(() => a.throws(true as any))
  assertThrows(() => a.throws('...' as any))
  assertThrows(() => a.throws(/foo/ as any))
})

test('throws for resolved promise', async () => {
  const actual = await assertAsyncThrows<AssertionError<{ value: string }>>(() => a.throws(Promise.resolve('ok')), AssertionError)
  t.strictEqual(actual.value, 'ok')
})

test('throws error does not contain internal stack trace for resolved promise', async () => {
  const err = await assertAsyncThrows<AssertionError<{ value: string }>>(() => a.throws(Promise.resolve('ok')), AssertionError)
  noStackTraceFor('throws.ts', err)
})

test('passes with rejected promise', async () => {
  const actual = await a.throws<string>(() => new Promise((_, r) => {
    setImmediate(() => r('no'))
  }))
  t.strictEqual(actual, 'no')
})

test('passes with rejected promise passing validator', () => {
  return a.throws(Promise.reject('no'), err => err === 'no')
})

test('throws with rejected promise failing validator', async () => {
  const err = await assertAsyncThrows<AssertionError<{ actual: string }>>(() => a.throws(Promise.reject('no'), err => err !== 'no'))

  t.strictEqual(err.actual, 'no')
})

test('thrown error does not contain internal stack trace with rejected promise failing validator', async () => {
  const err = await assertAsyncThrows<AssertionError<{ actual: string }>>(() => a.throws(Promise.reject('no'), err => err !== 'no'))

  noStackTraceFor('throws.ts', err)
})

test('passes with throwing function', () => {
  a.throws(() => { throw new Error('foo') })
})

test('throws if function does not', () => {
  const err = assertThrows<AssertionError<{ value: string }>>(
    () => a.throws(() => { return 'foo' }, AssertionError),
    AssertionError
  )
  t.strictEqual(err.value, 'foo')
})

test('thrown error does not contain internal stack track if function does not', () => {
  const err = assertThrows<AssertionError<{ value: string }>>(
    () => a.throws(() => { return 'foo' }, AssertionError),
    AssertionError
  )
  noStackTraceFor('throws.ts', err)
})

test('throws if function returns resolved promise', async () => {
  const err = await assertAsyncThrows<AssertionError<{ value: string }>>(() => a.throws(() => Promise.resolve('ok')), AssertionError)
  t.strictEqual(err.value, 'ok')
})

test('thrown error does not contain internal stack trace if function returns resolved promise', async () => {
  const err = await assertAsyncThrows<AssertionError<{ value: string }>>(() => a.throws(() => Promise.resolve('ok')), AssertionError)
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
  const err = await assertAsyncThrows<AssertionError<{ actual: any }>>(() => a.throws(() => Promise.reject('ok'), err => err !== 'ok'))
  t.strictEqual(err.actual, 'ok')
})

test('thrown error does not contain stack trace if function returns rejected promise not passing valdation', async () => {
  const err = await assertAsyncThrows<AssertionError<{ actual: any }>>(() => a.throws(() => Promise.reject('ok'), err => err !== 'ok'))
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
