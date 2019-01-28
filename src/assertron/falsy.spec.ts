import a from '..';
import AssertionError from 'assertion-error'
import { assertThrows, noStackTraceFor } from '../testUtils';

test('non-false statement throws', () => {
  assertThrows(() => a.falsy(true), AssertionError)
  assertThrows(() => a.falsy(1 === 1), AssertionError)
  assertThrows(() => a.falsy(1), AssertionError)
  assertThrows(() => a.falsy({}), AssertionError)
  assertThrows(() => a.falsy(() => true), AssertionError)
})

test('does not contain internal stack trace', () => {
  const err = assertThrows(() => a.falsy(true), AssertionError)
  noStackTraceFor('falsy.ts', err)
})

test('false statement pass', () => {
  a.falsy(false)
  a.falsy(1 === 2 as any)
})
