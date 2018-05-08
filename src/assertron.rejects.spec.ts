import test from 'ava'

import a from '.'
import { FailedAssertion } from './errors';

test('pass on rejected promise', async () => {
  await a.rejects(Promise.reject(1))
})

test('throws on resolved string promise', async t => {
  const err = await t.throws(a.rejects(Promise.resolve('abc')), FailedAssertion)
  t.is(err.message, `Expected promise to reject, but it resolves with 'abc'`)
})

test('throws on resovled boolean promise', async t => {
  const err = await t.throws(a.rejects(Promise.resolve(true)), FailedAssertion)
  t.is(err.message, `Expected promise to reject, but it resolves with true`)
})

test('throws on resovled object promise', async t => {
  const err = await t.throws(a.rejects(Promise.resolve(2)), FailedAssertion)
  t.is(err.message, `Expected promise to reject, but it resolves with 2`)
})

test('throws on resovled object promise', async t => {
  const err = await t.throws(a.rejects(Promise.resolve({ a: 1 })), FailedAssertion)
  t.is(err.message, `Expected promise to reject, but it resolves with { a: 1 }`)
})
