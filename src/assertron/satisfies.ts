import { createSatisfier } from 'satisfier'
import { If, IsExtend, NonComposableTypes } from 'type-plus'
import { AssertionError } from '../errors'
import { notSatisfiedMessage } from '../utils'

export type SatisfyExpectation<T> = If<
  IsExtend<T, string>,
  T | RegExp,
  If<
    IsExtend<T, NonComposableTypes>,
    T,
    If<IsExtend<T, Array<any>>,
      T extends Array<infer E> ? Array<SatisfyExpectation<E>> : never,
      {
        [P in keyof T]?: T[P] extends string
        ? SatisfyExpectation<T[P]> | RegExp
        : SatisfyExpectation<T[P]>
      }
    >>
> | ((v: T) => boolean)

/**
 * Check if `actual` satisfies criteria in `expected`.
 * @param expected All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function satisfies<Actual>(actual: Actual, expected: SatisfyExpectation<Actual>) {
  const diff = createSatisfier(expected as any).exec(actual);
  if (diff) {
    throw new AssertionError(notSatisfiedMessage(diff), { ssf: satisfies })
  }
}
