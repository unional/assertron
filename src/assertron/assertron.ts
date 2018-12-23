import { FailedAssertion } from '../errors';
import { falsy } from './falsy';
import { pathEqual } from './pathEqual';
import { rejects } from './rejects';
import { resolves } from './resolves';
import { satisfies } from './satisfies';
import { throws } from './throws';
import { truthy } from './truthy';

export const assertron = {
  false(value: any) {
    if (value !== false) throw new FailedAssertion(value, value, `Expected value to equal false, but received ${value}`)
  },
  falsy,
  pathEqual,
  rejects,
  resolves,
  satisfies,
  throws,
  true(value: any) {
    if (value !== true) throw new FailedAssertion(value, value, `Expected value to equal true, but received ${value}`)
  },
  truthy
}
