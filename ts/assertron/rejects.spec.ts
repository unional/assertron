import t from 'assert'
import { isType } from 'type-plus'
import a from '../index.js'
import { assertAsyncThrows, noStackTraceFor } from '../testUtils.js'

test('pass on rejected promise', async () => {
  await a.rejects(Promise.reject(1))
})

it('returns the rejected value', async () => {
  expect(await a.rejects(Promise.reject(2))).toBe(2)
})

it('can specify the return value type', async () => {
  const value = await a.rejects<string>(Promise.reject<any>('123'))
  isType.equal<true, string, typeof value>()
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
