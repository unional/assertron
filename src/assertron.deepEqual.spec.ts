import a from '.';

test('deepEqual is strict', () => {
  a.deepEqual([1], [1])
  a.throws(() => a.deepEqual([1], ['1'] as any))
})

test('works with array', () => {
  a.deepEqual([1, 2, 3], [1, 2, 3])
})

// test('mismatched array throws', () => {
//   a.throws(() => a.dee)
// })
