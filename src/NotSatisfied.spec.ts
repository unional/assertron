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

test(`root diff is displayed as 'actual'`, () => {
  const err = new NotSatisfied([{
    path: [],
    actual: 1,
    expected: 2
  }])
  t.strictEqual(err.toString(), `NotSatisfied: Expect actual to satisfy 2, but received 1`)
})

test(`root diff is displayed as 'actual'`, () => {
  const err = new NotSatisfied([{
    path: ['[0]'],
    actual: 1,
    expected: 2
  }])
  t.strictEqual(err.toString(), `NotSatisfied: Expect actual[0] to satisfy 2, but received 1`)
})
