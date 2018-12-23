import a from '..';
import { FailedAssertion } from '../errors';
import { assertThrows } from '../testUtils';

test('non-false statement throws', () => {
  assertThrows(() => a.falsy(true), FailedAssertion)
  assertThrows(() => a.falsy(1 === 1), FailedAssertion)
  assertThrows(() => a.falsy(1), FailedAssertion)
  assertThrows(() => a.falsy({}), FailedAssertion)
  assertThrows(() => a.falsy(() => true), FailedAssertion)
})

test('false statement pass', () => {
  a.falsy(false)
  a.falsy(1 === 2 as any)
})
