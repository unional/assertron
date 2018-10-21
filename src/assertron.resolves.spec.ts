import t from 'assert';
import a from '.';
import { FailedAssertion } from './errors';


test('pass on resolved promise', async () => {
  await a.resolves(Promise.resolve())
})

test('throws on rejected string promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject('abc')), FailedAssertion)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with 'abc'`)
})

test('throws on rejected error promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject(new Error('foo'))), FailedAssertion)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with Error: foo`)
})

test('throws on rejected object promise', async () => {
  const err = await a.throws(a.resolves(Promise.reject({ a: 1 })), FailedAssertion)
  t.strictEqual(err.message, `Expected promise to resolve, but it rejects with { a: 1 }`)
})
