import a from '.';

test('equal is strict', () => {
  a.equal(1, 1)
  a.throws(() => a.equal(1, '1' as any))
})
