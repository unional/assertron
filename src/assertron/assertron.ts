import { AssertionError } from '../errors'
import { notEqualMessage } from '../utils'
import { falsy } from './falsy'
import { pathEqual } from './pathEqual'
import { rejects } from './rejects'
import { repeat } from './repeat'
import { resolves } from './resolves'
import { satisfies } from './satisfies'
import { throws } from './throws'
import { truthy } from './truthy'

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
