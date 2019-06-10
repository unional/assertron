import a from '..'
import { FailOnOccurance } from './repeat';

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

test('error is captured as inner error and indicate which call failed', () => {
  let count = 0
  const err = a.throws(() => a.repeat(() => {
    ++count
    if (count === 5) throw new Error('failed')
  }, 10), FailOnOccurance)

  expect(err.occurance).toBe(5)
  expect(err.error.message).toBe('failed')
})

test('rejected error is captured as inner error and indicate which call failed', async () => {
  let count = 0
  let err = await a.throws(a.repeat(() => new Promise((a, r) => {
    setTimeout(() => {
      ++count
      if (count === 5) r(new Error('failed'))
      else a()
    }, Math.random() * 10)
  }), 10), FailOnOccurance)

  expect(err.occurance).toBe(5)
  expect(err.error.message).toBe('failed')
})
