import { AssertionError } from '../errors.js'
import { notEqualMessage } from '../utils/index.js'
import { falsy } from './falsy.js'
import { pathEqual } from './pathEqual.js'
import { rejects } from './rejects.js'
import { repeat } from './repeat.js'
import { resolves } from './resolves.js'
import { satisfies } from './satisfies.js'
import { throws } from './throws.js'
import { truthy } from './truthy.js'

export const assertron = {
  false(value: any) {
    if (value !== false)
      throw new AssertionError(notEqualMessage(value, false), { ssf: assertron.false })
  },
  falsy,
  pathEqual,
  rejects,
  repeat,
  resolves,
  satisfies,
  throws,
  true(value: any) {
    if (value !== true)
      throw new AssertionError(notEqualMessage(value, true), { ssf: assertron.true })
  },
  truthy
}
