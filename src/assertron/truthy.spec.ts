import AssertionError from 'assertion-error';
import a from '..';
import { assertThrows, noStackTraceFor } from '../testUtils';

test('falsy statement throws', () => {
  assertThrows(() => a.truthy(false), AssertionError)
  assertThrows(() => a.truthy(''), AssertionError)
  assertThrows(() => a.truthy(0), AssertionError)
  assertThrows(() => a.truthy(null), AssertionError)
  assertThrows(() => a.truthy(undefined), AssertionError)
})

test('truthy statement pass', () => {
  a.truthy(true)
  a.truthy('a')
  a.truthy(-1)
  a.truthy({})
  a.truthy(() => false)
})

test('does not contain internal stack trace', () => {
  const err = assertThrows(() => a.truthy(false), AssertionError)
  noStackTraceFor('truthy.ts', err)
})
