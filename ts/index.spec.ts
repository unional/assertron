import type { SatisfyExpectation } from './index.js'

it('expose SatifyExpression type', () => {
  function toSatisfies(value: SatisfyExpectation<number>) {
    return value
  }
  toSatisfies(1)
})
