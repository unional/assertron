import t from 'assert'
import a from '..'
import { assertAsyncThrows, noStackTraceFor } from '../testUtils'

test('pass on rejected promise', async () => {
  await a.rejects(Promise.reject(1))
})

test('throws on resolved string promise', async () => {
  const err = await a.throws(a.rejects(Promise.resolve('abc')))
  t.strictEqual(err.message, `Expected promise to reject, but it resolves with 'abc'`)
})

test('throws on resolved boolean promise', async () => {
  const err = await a.throws(a.rejects(Promise.resolve(true)))
  t.strictEqual(err.message, `Expected promise to reject, but it resolves with true`)
})

test('throws on resolved object promise', async () => {
  const err = await a.throws(a.rejects(Promise.resolve(2)))
  t.strictEqual(err.message, `Expected promise to reject, but it resolves with 2`)
})

test('throws on resolved object promise', async () => {
  const err = await a.throws(a.rejects(Promise.resolve({ a: 1 })))
  t.strictEqual(err.message, `Expected promise to reject, but it resolves with { a: 1 }`)
})

test('does not contain internal stack trace', async () => {
  const err = await assertAsyncThrows(() => a.rejects(Promise.resolve({ a: 1 })))
  noStackTraceFor('rejects.ts', err)
})
