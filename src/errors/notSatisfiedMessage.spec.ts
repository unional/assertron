import t from 'assert';
import { notSatisfiedMessage } from '.';

test('array should be tersified', () => {

  t.strictEqual(notSatisfiedMessage([{
    path: ['a'],
    actual: {
      a: [1, 2, 3]
    },
    expected: {
      b: ['a', 'b', 'c']
    }
  }]), `Expect a to satisfy { b: ['a', 'b', 'c'] }, but received { a: [1, 2, 3] }`)
})

test(`root diff is displayed as 'actual'`, () => {
  t.strictEqual(notSatisfiedMessage([{
    path: [],
    actual: 1,
    expected: 2
  }]), `Expect actual to satisfy 2, but received 1`)
})

test(`root diff is displayed as 'actual'`, () => {
  t.strictEqual(notSatisfiedMessage([{
    path: ['[0]'],
    actual: 1,
    expected: 2
  }]), `Expect [0] to satisfy 2, but received 1`)
})
