import { createSatisfier } from 'satisfier'
import type { If, IsExtend, NonComposableTypes } from 'type-plus'
import { AssertionError } from '../errors.js'
import { notSatisfiedMessage } from '../utils/index.js'

export type SatisfyExpectation<T> =
	| If<
			IsExtend<T, string>,
			T | RegExp,
			If<
				IsExtend<T, NonComposableTypes>,
				T,
				If<
					IsExtend<T, Array<any>>,
					T extends Array<infer E> ? Array<SatisfyExpectation<E>> : never,
					{
						[P in keyof T]?: T[P] extends string
							? SatisfyExpectation<T[P]> | RegExp
							: SatisfyExpectation<T[P]>
					}
				>
			>
	  >
	| ((v: T) => boolean)

/**
 * Check if `actual` satisfies criteria in `expected`.
 * @param expected All properties can be a value which will be compared to the same property in `actual`,
 * RegExp, or a predicate function that will be used to check against the property.
 */
export function satisfies<Actual, Expected extends Actual>(
	actual: Actual,
	expected: SatisfyExpectation<Expected>
): void {
	const diff = createSatisfier(expected as any).exec(actual)
	if (diff) {
		throw new AssertionError(notSatisfiedMessage(diff), { ssf: satisfies })
	}
}
