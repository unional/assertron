import { assertron } from './assertron/index.js'

export {
	anything,
	every,
	has,
	hasAll,
	isInClosedInterval,
	isInLeftClosedInterval,
	isInOpenInterval,
	isInRange,
	isInRightClosedInterval,
	isTypeOf,
	none,
	some,
	startsWith,
} from 'satisfier'
export * from './assert-order/index.js'
export * from './assertron/index.js'
export * from './errors.js'
export { assertron as a }

export default assertron
