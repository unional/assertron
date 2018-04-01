import { test } from 'ava'

import a, { satisfy } from '.'

test('exposes satisfy', t => {
  t.is(a.satisfy, satisfy)
})
