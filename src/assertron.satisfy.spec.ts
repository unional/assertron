import t from 'assert'

import a, { satisfy } from '.'

test('exposes satisfy', () => {
  t.strictEqual(a.satisfy, satisfy)
})
