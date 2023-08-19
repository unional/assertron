import a, { AssertionError } from '../index.js'
import { assertThrows, noStackTraceFor } from '../testUtils.js'

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
		// const err = assertThrows(() => a.false(true), AssertionError)
		// noStackTraceFor('assertron.ts', err)

		try {
			a.false(true)
		} catch (err: any) {
			noStackTraceFor('assertron.ts', err)
			// console.info(err)
		}
	})
	it('can supply a custom message', () => {
		const err = assertThrows(() => a.false(true, 'custom message'), AssertionError)
		a.true(err.message === 'custom message')
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
	it('can supply a custom message', () => {
		const err = assertThrows(() => a.true(false, 'custom message'), AssertionError)
		a.true(err.message === 'custom message')
	})
})

describe(`uuid()`, () => {
	it('throws if input is not a string', () => {
		assertThrows(() => a.uuid(1), AssertionError)
	})
	it('throws if input is not uuid', () => {
		assertThrows(() => a.uuid('a'), AssertionError)
	})
	it('passes if input is uuid', () => {
		a.uuid('11e9b365-a558-54aa-a824-c60aca166f6a')
	})
})
