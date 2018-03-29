import { test } from 'ava'
import { NotSatisfied } from './index'

test('array should be tersified', t => {
  const err = new NotSatisfied([{
    path: ['a'],
    actual: {
      a: [1, 2, 3]
    },
    expected: {
      b: ['a', 'b', 'c']
    }
  }])
  t.is(err.toString(), `NotSatisfied: Expect a to satisfy { b: ['a', 'b', 'c'] }, but received { a: [1, 2, 3] }`)
})
