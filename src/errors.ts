import { IsoError, ModuleError } from 'iso-error'
import { RequiredPick } from 'type-plus'
import { failOnOccurrence } from './utils'

/**
 * A base error for all assertion errors
 */
export class AssertionError extends ModuleError {
  constructor(message: string, options: AssertionError.Options) {
    super('assertron', message, options)
  }
}

export namespace AssertionError {
  export type Options = RequiredPick<IsoError.Options, 'ssf'>
}

export class FailOnOccurrence extends AssertionError {
  constructor(public occurrence: number, public error: any, options: AssertionError.Options) {
    super(failOnOccurrence(occurrence, error), options)
  }
}
