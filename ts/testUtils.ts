// istanbul ignore file
import t from 'node:assert'
import isPromise from 'is-promise'
import { escapeRegExp, isError } from 'lodash'
import type { ErrorConstructor } from './types.js'

export type AnyFunction = (...args: any[]) => any

export function assertIsPromise(promiseError: Promise<any>) {
	t(isPromise(promiseError))
}

export function assertIsError(err: Error) {
	t(isError(err))
}

export function assertThrows<E extends Error>(fn: AnyFunction, ErrorType?: ErrorConstructor<E>): E {
	try {
		fn()
	} catch (e: any) {
		if (ErrorType && !(e instanceof ErrorType)) {
			throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
		}
		return e
	}
	throw new Error(`${fn} does not throw as expected`)
}

export async function assertAsyncThrows<E extends Error>(fn: AnyFunction, ErrorType?: ErrorConstructor<E>): Promise<E> {
	try {
		await fn()
	} catch (e: any) {
		// console.log('catch clause', e)
		if (ErrorType && !(e instanceof ErrorType)) {
			throw new Error(`thrown error ${e} is not of expected type ${ErrorType}`)
		}
		// console.log('returning e')
		return e
	}
	throw new Error(`${fn} does not throw as expected`)
}

export function noStackTraceFor(filename: string, err: Error) {
	if (err.stack && RegExp(escapeRegExp(filename)).test(err.stack))
		throw new Error(`contains internal stack: \n${err.stack}`)
}
