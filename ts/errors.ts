import { ModuleError } from 'iso-error'
import type { RequiredPick } from 'type-plus'
import { failOnOccurrence } from './utils/index.js'

/**
 * A base error for all assertion errors
 */
export class AssertionError extends ModuleError {
  constructor(message: string, options: AssertionError.Options) {
    super('assertron', message, options)
  }
}

export namespace AssertionError {
  export type Options = RequiredPick<ModuleError.Options, 'ssf'>
}

export class FailOnOccurrence extends AssertionError {
  constructor(public occurrence: number, public error: any, options: AssertionError.Options) {
    super(failOnOccurrence(occurrence, error), options)
  }
}
