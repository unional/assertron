import { FailedAssertion } from '../errors';

export function falsy(value: any) {
  if (value) throw new FailedAssertion(value, value, `Expected value to be falsy, but received ${value}`)
}
