import AssertionError from 'assertion-error'
import { createSatisfier } from 'satisfier'
import { And, If, PrimitiveTypes, IsExtend } from 'type-plus'
import { notSatisfiedMessage } from '../errors'

export type SatisfyExpectation<T> = If<
  And<IsExtend<T, PrimitiveTypes>, IsExtend<T, Array<any>>>,
  T | ((v: T) => boolean),
  {
    [P in keyof T]?: T[P] extends string
    ? SatisfyExpectation<T[P]> | ((v: T[P]) => boolean) | RegExp
    : SatisfyExpectation<T[P]> | ((v: T[P]) => boolean)
  }>

/**
 * Check if `actual` satisfies criteria in `expected`.
 * @param expected All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function satisfies<Actual>(actual: Actual, expected: SatisfyExpectation<Actual>) {
  const diff = createSatisfier(expected as any).exec(actual);
  if (diff) {
    throw new AssertionError(
      notSatisfiedMessage(diff),
      { diff },
      satisfies
    )
  }
}
