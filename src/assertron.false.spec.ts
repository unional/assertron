import a from '.'
import { FailedAssertion } from './errors'
import { assertThrows } from './testUtils';

test('non-false statement throws', () => {
  assertThrows(() => a.false(true), FailedAssertion)
  assertThrows(() => a.false(1 === 1), FailedAssertion)
})

test('non-false function throws', () => {
  assertThrows(() => a.false(() => true), FailedAssertion)
  assertThrows(() => a.false(() => 1), FailedAssertion)
  assertThrows(() => a.false(() => ''), FailedAssertion)
})

test('false statement pass', () => {
  a.false(false)
  a.false(1 === 2 as any)
})

test('false function pass', () => {
  a.false(() => false)
})
