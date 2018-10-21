import t from 'assert'
import { NotSatisfied } from '.'

test('array should be tersified', () => {
  const err = new NotSatisfied([{
    path: ['a'],
    actual: {
      a: [1, 2, 3]
    },
    expected: {
      b: ['a', 'b', 'c']
    }
  }])
  t.strictEqual(err.toString(), `NotSatisfied: Expect a to satisfy { b: ['a', 'b', 'c'] }, but received { a: [1, 2, 3] }`)
})
