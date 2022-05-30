import { AssertionError } from '../errors.js'

export function truthy(value: any) {
  if (!value) throw new AssertionError(
    `Expected value to be truthy, but received ${value}`,
    { ssf: truthy }
  )
}