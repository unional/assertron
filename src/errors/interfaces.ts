
export type ErrorValidator = (value) => boolean
export type ErrorConstructor<E extends Error> = new (...args: any[]) => E
