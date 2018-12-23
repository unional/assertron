import { createSatisfier } from 'satisfier';
import { NotSatisfied } from '../errors';

/**
 * Check if `actual` satisfies criteria in `expected`.
 * @param expected All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function satisfies<Actual extends any>(actual: Actual, expected: any) {
  const diff = createSatisfier(expected).exec(actual);
  if (diff) {
    throw new NotSatisfied(diff)
  }
}
