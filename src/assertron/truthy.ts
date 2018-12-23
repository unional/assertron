import { FailedAssertion } from '../errors';

export function truthy(value: any) {
  if (!value) throw new FailedAssertion(value, value, `Expected value to be truthy, but received ${value}`)
}
