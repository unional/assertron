
export type ErrorValidator = (value: any) => boolean
export type ErrorConstructor<E extends Error> = new (...args: any[]) => E
