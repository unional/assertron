import t from 'assert'
import a, { AssertionError } from '..'
import { assertAsyncThrows, noStackTraceFor } from '../testUtils'


test('pass on resolved promise', async () => {
  await a.resolves(Promise.resolve())
})

test('throws on rejected string promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject('abc')), AssertionError)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with 'abc'`)
})

test('throws on rejected error promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject(new Error('foo'))), AssertionError)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with Error: foo`)
})

test('throws on rejected object promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject({ a: 1 })), AssertionError)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with { a: 1 }`)
})

test('does not contain internal stack trace', async () => {
  const err = await assertAsyncThrows(() => a.resolves(Promise.reject({ a: 1 })), AssertionError)
  noStackTraceFor('resolves.ts', err)
})

