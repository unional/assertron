import type { AnyConstructor } from 'type-plus'
import { AssertionError } from '../errors.js'
import type { ErrorConstructor, ErrorValidator } from '../types.js'
import { notEqualMessage } from '../utils/index.js'
import { falsy } from './falsy.js'
import { isInstanceof } from './isInstanceof.js'
import { pathEqual } from './pathEqual.js'
import { rejects } from './rejects.js'
import { repeat } from './repeat.js'
import { resolves } from './resolves.js'
import { satisfies, type SatisfyExpectation } from './satisfies.js'
import { throws } from './throws.js'
import { truthy } from './truthy.js'

export type Assertron = {
	false(value: unknown, message?: string | undefined): asserts value is false
	falsy(value: any, message?: string | undefined): asserts value is false | 0 | '' | null | undefined
	isInstanceof<T extends AnyConstructor>(value: unknown, type: T): asserts value is InstanceType<T>
	pathEqual(actual: string, expected: string): void
	rejects<R = any>(promise: Promise<any>): Promise<R>
	repeat<R>(
		fn: () => R | (() => Promise<R>),
		times: number
	): ReturnType<typeof fn> extends Promise<R> ? Promise<R> : R
	resolves(promise: Promise<any>): Promise<void>
	satisfies<Actual, Expected extends Actual>(actual: Actual, expected: SatisfyExpectation<Expected>): void
	throws<E extends Error>(value: PromiseLike<any>, error?: ErrorValidator | ErrorConstructor<E>): Promise<E>
	throws<E extends Error>(value: (...args: any[]) => never, error?: ErrorValidator | ErrorConstructor<E>): E
	throws<E extends Error, R = any>(
		value: (...args: any[]) => R,
		error?: ErrorValidator | ErrorConstructor<E>
	): R extends Promise<any> ? Promise<E> : E
	throws<T, R = any>(
		value: (...args: any[]) => R,
		validator?: ErrorValidator
	): R extends Promise<any> ? Promise<T> : T
	true(value: unknown, message?: string | undefined): asserts value is true
	truthy(value: unknown, message?: string | undefined): void
	uuid(value: unknown): void
}

export const assertron: Assertron = {
	false(value: unknown, message?: string): void {
		if (value !== false)
			throw new AssertionError(message ?? notEqualMessage(value, false), { ssf: assertron.false })
	},
	falsy,
	isInstanceof,
	pathEqual,
	rejects,
	repeat,
	resolves,
	satisfies,
	throws,
	true(value: unknown, message?: string): void {
		if (value !== true)
			throw new AssertionError(message ?? notEqualMessage(value, true), { ssf: assertron.true })
	},
	truthy,
	uuid(value: unknown) {
		if (typeof value !== 'string')
			throw new AssertionError(`Expected ${value} to be a string`, { ssf: assertron.uuid })

		if (/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value))
			return

		throw new AssertionError(`Expected ${value} to be a valid UUID`, { ssf: assertron.uuid })
	}
}
