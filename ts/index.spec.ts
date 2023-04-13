import {
	SatisfyExpectation,
	anything,
	every,
	has,
	hasAll,
	isInClosedInterval,
	isInLeftClosedInterval,
	isInOpenInterval,
	isInRange,
	isInRightClosedInterval,
	none,
	some,
	startsWith
} from './index.js'

it('expose SatifyExpression type', () => {
	function toSatisfies(value: SatisfyExpectation<number>) {
		return value
	}
	toSatisfies(1)
})

it('expose types from satisfier', () => {
	expect(anything).toBeDefined()
	expect(has).toBeDefined()
	expect(every).toBeDefined()
	expect(hasAll).toBeDefined()
	expect(isInClosedInterval).toBeDefined()
	expect(isInLeftClosedInterval).toBeDefined()
	expect(isInOpenInterval).toBeDefined()
	expect(isInRange).toBeDefined()
	expect(isInRightClosedInterval).toBeDefined()
	expect(none).toBeDefined()
	expect(some).toBeDefined()
	expect(startsWith).toBeDefined()
})
