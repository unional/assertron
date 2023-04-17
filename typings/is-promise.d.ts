declare module 'is-promise' {
	export default function isPromise(val: any): val is Promise<any>
}
