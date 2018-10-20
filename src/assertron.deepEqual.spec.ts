import test from 'ava';
import assertron from '.';

test('deepEqual is strict', async () => {
  assertron.deepEqual([1], [1])
  await assertron.throws(() => assertron.equal([1], ['1'] as any))
})

test('works with array', async () => {
  assertron.deepEqual([1, 2, 3], [1, 2, 3])
})
