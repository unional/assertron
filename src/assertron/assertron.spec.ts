import a from '..'
import { FailedAssertion } from '../errors'
import { assertThrows } from '../testUtils';

describe('false()', () => {
  test('non-false statement throws', () => {
    assertThrows(() => a.false(true), FailedAssertion)
    assertThrows(() => a.false(0), FailedAssertion)
    assertThrows(() => a.false(''), FailedAssertion)
    assertThrows(() => a.false({}), FailedAssertion)
    assertThrows(() => a.false(() => false), FailedAssertion)
  })

  test('false statement pass', () => {
    a.false(false)
  })
})

describe('true()', () => {
  test('non-true statement throws', () => {
    assertThrows(() => a.true(false), FailedAssertion)
    assertThrows(() => a.true(1), FailedAssertion)
    assertThrows(() => a.true('a'), FailedAssertion)
    assertThrows(() => a.true({}), FailedAssertion)
    assertThrows(() => a.true(() => true), FailedAssertion)
  })

  test('true statement pass', () => {
    a.true(true)
  })
})
