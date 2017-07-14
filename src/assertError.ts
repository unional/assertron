import { Steps } from './assertOrder'

export default class AssertError extends Error {
  constructor(possibleMoves: Steps, reverseAlias: object, calledFn: string, ...calledSteps: number[]) {
    const should: string[] = []
    for (let key in possibleMoves) {
      should.push(...[key].concat(reverseAlias[key]).map(name =>
        `'${name}(${possibleMoves[key].join('|')})'`
      ))
    }

    super(`Expecting ${should.join(', ')}, but received '${calledFn}(${calledSteps.join(',')})'`)
  }
}
