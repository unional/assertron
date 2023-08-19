import a, { AssertionError } from '../index.js'
import { assertThrows, noStackTraceFor } from '../testUtils.js'

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

it('can supply a custom message', () => {
	const err = assertThrows(() => a.truthy(false, 'custom message'), AssertionError)
	a.true(err.message === 'custom message')
})
