import {Steps} from './assertOrder'

export class FormatError{
  public formatError(calledFnName: string, possibleMoves:Steps, reverseAlias: {},...calledSteps: number[]) {
    const expectedFunction: string[] = [];
    for (let key in possibleMoves) {
      expectedFunction.push(...([key, ...reverseAlias[key]].map(name =>`'${name}(${possibleMoves[key].join('|')})'`)));
    }
    return `Expecting ${expectedFunction.join(', ')}, but received '${calledFnName}(${calledSteps.join(',')})'`;
  }
}
