import a from '..'
import { FailedAssertion } from '../errors'
import { assertThrows } from '../testUtils';

test('falsy statement throws', () => {
  assertThrows(() => a.truthy(false), FailedAssertion)
  assertThrows(() => a.truthy(''), FailedAssertion)
  assertThrows(() => a.truthy(0), FailedAssertion)
  assertThrows(() => a.truthy(null), FailedAssertion)
  assertThrows(() => a.truthy(undefined), FailedAssertion)
})

test('truthy statement pass', () => {
  a.truthy(true)
  a.truthy('a')
  a.truthy(-1)
  a.truthy({})
  a.truthy(() => false)
})
