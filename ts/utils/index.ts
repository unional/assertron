import { tersify } from 'tersify'

export * from './isErrorConstructor.js'
export * from './notEqualMessage.js'
export * from './notSatisfiedMessage.js'
export * from './notThrownMessage.js'
export * from './promiseMessages.js'
export * from './unexpectedErrorMessage.js'

export function failOnOccurrence(occurrence: number, error: any) {
  return `Failed on ${occurrence} occurrence: ${tersify(error, { maxLength: Infinity })}`
}
