import a from '..'
import { FailedAssertion } from '../errors'
import { assertThrows } from '../testUtils';

describe('false()', () => {
  test('non-false statement throws', () => {
    assertThrows(() => a.false(true), FailedAssertion)
    assertThrows(() => a.false(1 === 1), FailedAssertion)
  })

  test('false statement pass', () => {
    a.false(false)
    a.false(1 === 2 as any)
  })

  test('falsy statement does not pass', () => {
    a.throws(() => a.false(1), FailedAssertion)
  })
})
