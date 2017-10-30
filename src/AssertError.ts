import { Steps } from './internalInterfaces'

export class AssertError extends Error {
  possibleMoves: Steps
  functionName: string
  calledSteps: number[]
  constructor(possibleMoves: Steps, reverseAlias: object, calledFn: string, ...calledSteps: number[]) {
    const should: string[] = []
    for (let key in possibleMoves) {
      should.push(...[key].concat(reverseAlias[key]).map(name =>
        `'${name}(${possibleMoves[key].join('|')})'`
      ))
    }

    super(`Expecting ${should.join(', ')}, but received '${calledFn}(${calledSteps.join(',')})'`)
    this.possibleMoves = possibleMoves
    this.functionName = calledFn
    this.calledSteps = calledSteps
  }
}
