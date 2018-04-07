import a from '.'
import test from 'ava'
import { FailedAssertion } from './errors'

test('non-false statement throws', t => {
  t.throws(() => a.false(true), FailedAssertion)
  t.throws(() => a.false(1 === 1), FailedAssertion)
})

test('non-false function throws', t => {
  t.throws(() => a.false(() => true), FailedAssertion)
  t.throws(() => a.false(() => 1), FailedAssertion)
  t.throws(() => a.false(() => ''), FailedAssertion)
})

test('false statement pass', () => {
  a.false(false)
  a.false(1 === 2 as any)
})

test('false function pass', () => {
  a.false(() => false)
})
