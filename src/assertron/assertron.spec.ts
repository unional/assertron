import a, { AssertionError } from '..'
import { assertThrows, noStackTraceFor } from '../testUtils'

describe('false()', () => {
  test('non-false statement throws', () => {
    assertThrows(() => a.false(true), AssertionError)
    assertThrows(() => a.false(0), AssertionError)
    assertThrows(() => a.false(''), AssertionError)
    assertThrows(() => a.false({}), AssertionError)
    assertThrows(() => a.false(() => false), AssertionError)
  })

  test('false statement pass', () => {
    a.false(false)
  })

  test('does not contain internal stack trace', () => {
    const err = assertThrows(() => a.false(true), AssertionError)
    noStackTraceFor('assertron.ts', err)
  })
})

describe('true()', () => {
  test('non-true statement throws', () => {
    assertThrows(() => a.true(false), AssertionError)
    assertThrows(() => a.true(1), AssertionError)
    assertThrows(() => a.true('a'), AssertionError)
    assertThrows(() => a.true({}), AssertionError)
    assertThrows(() => a.true(() => true), AssertionError)
  })

  test('true statement pass', () => {
    a.true(true)
  })

  test('does not contain internal stack trace', () => {
    const err = assertThrows(() => a.true(false), AssertionError)
    noStackTraceFor('assertron.ts', err)
  })
})
