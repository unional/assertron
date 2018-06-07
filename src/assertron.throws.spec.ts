import { test } from 'ava'

import a, { InvalidUsage, NotRejected, NotThrown, ReturnNotRejected, UnexpectedError } from '.'

test('assertron.throws() throws if input not function or promise', t => {
  t.throws(() => a.throws(0 as any), InvalidUsage)
  t.throws(() => a.throws(true as any), InvalidUsage)
  t.throws(() => a.throws('...' as any), InvalidUsage)
  t.throws(() => a.throws(/foo/ as any), InvalidUsage)
})

test('assertron.throws() throws NotRejected for resolved promise', t => {
  return t.throws(
    a.throws(Promise.resolve('ok')),
    err => err instanceof NotRejected && err.value === 'ok')
})

test('assertron.throws() passes with rejected promise', async t => {
  const actual = await a.throws<string>(new Promise((_, r) => {
    setImmediate(() => r('no'))
  }))
  t.is(actual, 'no')
})

test('assertron.throws() passes with rejected promise passing validator', () => {
  return a.throws(Promise.reject('no'), err => err === 'no')
})

test('assertron.throws() throws with rejected promise failing validator', t => {
  return t.throws(
    a.throws(Promise.reject('no'), err => err !== 'no'),
    err => err instanceof UnexpectedError && err.actual === 'no')
})

test('assertron.throws() passes with throwing function', () => {
  return a.throws(() => { throw new Error('foo') })
})

test('assertron.throws() throws if function does not', t => {
  t.throws(() => a.throws(
    () => { return 'foo' },
    err => err instanceof NotThrown && err.value === 'foo'))
})

test('assertron.throws() throws if function returns resolved promise', t => {
  return t.throws(
    a.throws(() => Promise.resolve('ok')),
    err => err instanceof ReturnNotRejected && err.value === 'ok')
})

test('assertron.throws() pass if function returns rejected promise', () => {
  return a.throws(() => { return Promise.reject('ok') })
})

test('assertron.throws() pass if function returns rejected promise passing valdation', () => {
  return a.throws(
    () => { return Promise.reject('ok') },
    err => err === 'ok')
})

test('assertron.throws() throws if function returns rejected promise not passing valdation', t => {
  return t.throws(
    a.throws(() => { return Promise.reject('ok') }, err => err !== 'ok'),
    err => err instanceof UnexpectedError && err.actual === 'ok')
})

class FakeError extends Error {
  constructor() {
    super('')

    Object.setPrototypeOf(this, new.target.prototype)
  }
  foo = 'foo'
}

test('validate Promise using Error constructor', async t => {
  const err = await a.throws(Promise.reject(new FakeError()), FakeError)
  t.is(err.foo, 'foo')
})

test('validate Promise using another Error constructor will throw', async t => {
  const err = await t.throws(a.throws(Promise.reject(new FakeError()), InvalidUsage), UnexpectedError)

  t.is(err.message, `Unexpected error. Expecting 'InvalidUsage' but received Error: { foo: 'foo', message: '' }`)
})

test('validate () => Promise using Error constructor', async t => {
  const err = await a.throws(() => Promise.reject(new FakeError()), FakeError)
  t.is(err.foo, 'foo')
})

test('validate () => Promise using anothert Error constructor will throw', async t => {
  return t.throws(a.throws(() => Promise.reject(new FakeError()), InvalidUsage))
})

test('validate () => throw using Error constructor', async t => {
  const err = await a.throws(() => { throw new FakeError() }, FakeError)
  t.is(err.foo, 'foo')
})

test('validate () => throw using another Error constructor will throw', async t => {
  return t.throws(() => a.throws(() => { throw new FakeError() }, InvalidUsage))
})
