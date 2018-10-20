import test from 'ava';
import assertron from '.';

test('equal is strict', async () => {
  assertron.equal(1, 1)
  await assertron.throws(() => assertron.equal(1, '1' as any))
})
