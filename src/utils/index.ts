import { tersify } from 'tersify';

export * from './isErrorConstructor';
export * from './notEqualMessage';
export * from './notSatisfiedMessage';
export * from './notThrownMessage';
export * from './promiseMessages';
export * from './unexpectedErrorMessage';

export function failOnOccurrence(occurrence: number, error: any) {
  return `Failed on ${occurrence} occurrence: ${tersify(error, { maxLength: Infinity })}`
}
