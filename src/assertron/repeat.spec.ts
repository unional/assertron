import a from '..'

test('repeat function n times', () => {
  let count = 0
  a.repeat(() => ++count, 10)

  expect(count).toBe(10)
})

test('repeat async function n times sequentially', async () => {
  let count = 0
  let actual = ''
  let aa = await a.repeat(() => new Promise<string>(a => {
    setTimeout(() => {
      ++count
      actual += String(count)
      a(actual)
    }, Math.random() * 10)
  }), 10)

  expect(actual).toBe('12345678910')
  expect(actual).toBe(aa)
})
