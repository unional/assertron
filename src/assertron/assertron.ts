import AssertionError from 'assertion-error';
import { falsy } from './falsy';
import { pathEqual } from './pathEqual';
import { rejects } from './rejects';
import { resolves } from './resolves';
import { satisfies } from './satisfies';
import { throws } from './throws';
import { truthy } from './truthy';


export const assertron = {
  false(value: any) {
    if (value !== false)
      throw new AssertionError(
        `Expected value to equal false, but received ${value}`,
        { value },
        assertron.false)
  },
  falsy,
  pathEqual,
  rejects,
  resolves,
  satisfies,
  throws,
  true(value: any) {
    if (value !== true) throw new AssertionError(`Expected value to equal true, but received ${value}`, { value }, assertron.true)
  },
  truthy
}
