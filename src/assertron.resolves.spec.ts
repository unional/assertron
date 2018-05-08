import test from 'ava'

import a from '.'
import { FailedAssertion } from './errors';

test('pass on resolved promise', async () => {
  await a.resolves(Promise.resolve())
})

test('throws on rejected string promise', async t => {
  const err = await t.throws(a.resolves(Promise.reject('abc')), FailedAssertion)
  t.is(err.message, `Expected promise to resolve, but it rejects with 'abc'`)
})

test('throws on rejected error promise', async t => {
  const err = await t.throws(a.resolves(Promise.reject(new Error('foo'))), FailedAssertion)
  t.is(err.message, `Expected promise to resolve, but it rejects with Error: foo`)
})

test('throws on rejected object promise', async t => {
  const err = await t.throws(a.resolves(Promise.reject({ a: 1 })), FailedAssertion)
  t.is(err.message, `Expected promise to resolve, but it rejects with { a: 1 }`)
})
