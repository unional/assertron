import t from 'assert';
import a, { InvalidUsage, NotRejected, NotThrown, ReturnNotRejected, UnexpectedError } from '.';
import { assertAsyncThrows, assertIsError, assertIsPromise, assertThrows } from './testUtils';


test('when value is PromiseLike returns Promise', async () => {
  let actual = a.throws(Promise.reject(new Error()), Error, 'some message')
  assertIsPromise(actual)

  actual = a.throws(Promise.reject(new Error()), Error)
  assertIsPromise(actual)

  actual = a.throws(Promise.reject(new Error()), () => true)
  assertIsPromise(actual)

  actual = a.throws(Promise.reject(new Error()))
  assertIsPromise(actual)
})

test('when value is function returning promise, will return promise', () => {
  let actual = a.throws(() => Promise.reject(new Error()), Error, 'some message')
  assertIsPromise(actual)

  actual = a.throws(() => Promise.reject(new Error()), Error)
  assertIsPromise(actual)

  actual = a.throws(() => Promise.reject(new Error()), () => true)
  assertIsPromise(actual)

  actual = a.throws(() => Promise.reject())
  assertIsPromise(actual)
})

test('when value is function returns error', () => {
  let actual = a.throws((() => { throw new Error() }) as () => void, Error, 'some message')
  assertIsError(actual)

  actual = a.throws((() => { throw new Error() }) as () => void, Error)
  assertIsError(actual)

  actual = a.throws((() => { throw new Error() }) as () => void)
  assertIsError(actual)
})

test('throws InvalidUsage if input is not a function or promise', () => {
  assertThrows(() => a.throws(0 as any), InvalidUsage)
  assertThrows(() => a.throws(true as any), InvalidUsage)
  assertThrows(() => a.throws('...' as any), InvalidUsage)
  assertThrows(() => a.throws(/foo/ as any), InvalidUsage)
})

test('throws NotRejected for resolved promise', async () => {
  const actual = await assertAsyncThrows(() => a.throws(Promise.resolve('ok')), NotRejected)
  t.strictEqual(actual.value, 'ok')
})

test('passes with rejected promise', async () => {
  const actual = await a.throws<string>(new Promise((_, r) => {
    setImmediate(() => r('no'))
  }))
  t.strictEqual(actual, 'no')
})

test('assertron.throws() passes with rejected promise passing validator', () => {
  return a.throws(Promise.reject('no'), err => err === 'no')
})

test('assertron.throws() throws with rejected promise failing validator', async () => {
  const err = await assertAsyncThrows(() => a.throws(Promise.reject('no'), err => err !== 'no'), UnexpectedError)

  t.strictEqual(err.actual, 'no')
})

test('assertron.throws() passes with throwing function', () => {
  a.throws(() => { throw new Error('foo') })
})

test('assertron.throws() throws if function does not', () => {
  t.throws(() => a.throws(
    () => { return 'foo' },
    err => err instanceof NotThrown && err.value === 'foo'))
})

test('assertron.throws() throws if function returns resolved promise', async () => {
  const err = await assertAsyncThrows(() => a.throws(() => Promise.resolve('ok')), ReturnNotRejected)
  t.strictEqual(err.value, 'ok')
})

test('assertron.throws() pass if function returns rejected promise', () => {
  return a.throws(() => { return Promise.reject('ok') })
})

test('assertron.throws() pass if function returns rejected promise passing valdation', () => {
  return a.throws(
    () => { return Promise.reject('ok') },
    err => err === 'ok')
})

test('assertron.throws() throws if function returns rejected promise not passing valdation', async () => {
  const err = await assertAsyncThrows(() => a.throws(() => Promise.reject('ok'), err => err !== 'ok'), UnexpectedError)
  t.strictEqual(err.actual, 'ok')
})

class FakeError extends Error {
  constructor() {
    super('')

    Object.setPrototypeOf(this, new.target.prototype)
  }
  foo = 'foo'
}

test('validate Promise using Error constructor', async () => {
  const err = await a.throws(Promise.reject(new FakeError()), FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate Promise using another Error constructor will throw', async () => {
  const err = await assertAsyncThrows(() => a.throws(Promise.reject(new FakeError()), InvalidUsage), UnexpectedError)

  t.strictEqual(err.message, `Unexpected error. Expecting 'InvalidUsage' but received Error: { foo: 'foo', message: '' }`)
})

test('validate () => Promise using Error constructor', async () => {
  const err = await a.throws(() => Promise.reject(new FakeError()), FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate () => Promise using anothert Error constructor will throw', async () => {
  return assertAsyncThrows(a.throws(() => Promise.reject(new FakeError()), InvalidUsage))
})

test('validate () => throw using Error constructor', async () => {
  const err = await a.throws((() => { throw new FakeError() }) as any, FakeError)
  t.strictEqual(err.foo, 'foo')
})

test('validate () => throw using another Error constructor will throw', async () => {
  return t.throws(() => a.throws((() => { throw new FakeError() }) as any, InvalidUsage))
})
