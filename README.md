# assertron

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]

A supplementary assertion library that runs on both NodeJS and browser.

## Install

```sh
# npm
npm install assertron

# yarn
yarn add assertron

# pnpm
pnpm install assertron

#rush
rush add -p assertron
```

## Usage

`assertron` provides a collection of assertion methods:

- `assertron.false(value)`: asserts the provided value is false.
- `assertron.falsy(value)`: asserts the provided value is falsy.
- `assertron.isInstanceof(value, ClassType)`: asserts `value instanceof ClassType`.
- `assertron.pathEqual(actual, expected)`: asserts the two paths are equal regardless of operating system differences.
- `assertron.rejects(promise)`: asserts the promise rejects.
- `assertron.repeat(fn, times)`: repeat the specified function n times and return the last result.\
  If the result is a promise, it will run the function sequentially.
- `assertron.resolves(promise)`: asserts the promise resolves.
- `assertron.satisfies(actual, expected)`: checks if `actual` meets the requirements specified by `expected`.\
  Each property in `expected` can be a value, a `RegExp`, or a predicate function.\
  It uses `satisfier` internally to check for validity.\
  Check out [`satisfier`](https://github.com/unional/satisfier) for more detail.

```ts
import a from 'assertron' // assertron is also exported as default.

// these passes
a.satisfies({ a: 1, b: 2 }, { a: 1 })
a.satisfies({ a: 'foo', b: 'boo' }, { a: /foo/ })
a.satisfies({ a: 1, b, 2 }, { a: n => n === 1 })

// these fails
a.satisfies({ a: 1 }, { a: 2 })
a.satisfies({ a: 1 }, { a: 1, b: 2 })
a.satisfies({ a: 'foo' }, { a: /boo/ })
a.satisfies({ a: 1 }, { a: () => false })
```

- `assertron.throws(...)`: asserts the promise, function, or async function throws (or rejects) an error.

```ts
import { assertron } from 'assertron'

await assertron.throws(Promise.reject(new Error('foo')))
assertron.throws(() => { throw new Error('foo') })
await assertron.throws(() => Promise.reject(new Error('foo')))

const e1 = await assertron.throws(Promise.reject(new SpecificError('foo')), SpecificError)
const e2 = assertron.throws(() => { throw new SpecificError('foo') }, SpecificError)
const e3 = await assertron.throws(() => Promise.reject(new SpecificError('foo')), SpecificError)
```

- `assertron.true(value)`: asserts the provided value is true.
- `assertron.truthy(value)`: asserts the provided value is truthy.

## AssertOrder

Assert the code is executed in the expected order.

- `order.once(step: number)`: asserts the step `step` executed once.

```ts
import { AssertOrder } from 'assertron'

const o = new AssertOrder()
function foo() {
  o.once(1)
}

foo()
foo() // throws
```

```ts
import { AssertOrder } from 'assertron'

const o = new AssertOrder()
function foo() {
  o.once(1)
}

function boo() {
  o.once(2)
}

foo()
boo()
```

- `order.atLeastOnce(step: number)`: assert the `step` executed at least once.

```ts
import { AssertOrder } from 'assertron'

const o = new AssertOrder()

for (let i = 0; i < 10; i++)
  o.atLeastOnce(1)


o.once(2)
```

- `order.exactly(step: number, times: number)`: asserts the step `step` executed exactly n times

```ts
import { AssertOrder } from 'assertron'

const o = new AssertOrder()

for (let i = 0; i < 4; i++)
  o.exactly(1, 3) // throws at i === 3
```

- `order.any(steps: number[], handler?: (step: number) => void)`: asserts any of the steps `steps` executed.

```ts
import { AssertOrder } from 'assertron'

const o = new AssertOrder()

for (let i = 1; i <= 4; i++) {
  if (i % 2)
    o.any([1, 3])
  else
    o.any([2, 4])
}
```

There are other methods available. Use TypeScript to discover them!

## Contribute

```sh
yarn

# start making changes
git checkout -b <branch>
yarn watch

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## NPM Commands

There are a few useful commands you can use during development.

```sh
yarn test

yarn watch

yarn verify
```

[npm-image]: https://img.shields.io/npm/v/assertron.svg?style=flat
[npm-url]: https://npmjs.org/package/assertron
[downloads-image]: https://img.shields.io/npm/dm/assertron.svg?style=flat
[downloads-url]: https://npmjs.org/package/assertron

[github-nodejs]: https://github.com/unional/assertron/workflows/nodejs/badge.svg
[github-action-url]: https://github.com/unional/assertron/actions
[codecov-image]: https://codecov.io/gh/unional/assertron/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/assertron

[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release

[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
