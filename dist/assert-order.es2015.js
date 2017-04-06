(function (exports) {
'use strict';

class AssertOrder$1 {
    constructor(plannedSteps, initStep = 0) {
        this.plannedSteps = plannedSteps;
        this.miniSteps = 0;
        this.nextStep = initStep;
        this.possibleMoves = {
            once: [initStep],
            some: [initStep],
            all: [initStep]
        };
    }
    /**
     * Gets what is the next expecting step.
     * If the current step is `some(n)`, this reflects the step after `some(n)`
     */
    get next() { return this.nextStep; }
    end(timeout) {
        const check = (() => {
            return this.plannedSteps === undefined || this.nextStep === this.plannedSteps;
        });
        const getErrorMsg = () => `Planned ${this.plannedSteps} steps but executed ${this.nextStep} steps`;
        if (timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (check()) {
                        resolve();
                    }
                    else {
                        reject(new Error(getErrorMsg()));
                    }
                }, timeout);
            });
        }
        if (!check()) {
            throw new Error(getErrorMsg());
        }
    }
    step(step) {
        if (this.isValidStep('step', [step])) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage('step', step));
        }
    }
    /**
     * Assert the specified step will run once.
     */
    once(step) {
        // this.validate('once', [step], 1)
        if (this.isValidStep('once', [step])) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage('once', step));
        }
    }
    /**
     * Assert this place will be called during any of the specified steps.
     * @returns the step it is being called right now.
     */
    any(...anySteps) {
        if (this.isValidStep('any', anySteps)) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage('any', ...anySteps));
        }
    }
    /**
     * Assert the specified step will be reached at least once.
     * @returns how many times this step has occured.
     */
    some(step) {
        if (this.isValidStep('some', [step])) {
            if (step === this.nextStep) {
                this.moveNext({
                    once: [step + 1],
                    some: [step, step + 1],
                    all: [step + 1]
                });
                this.miniSteps = 0;
                this.nextStep++;
            }
            return ++this.miniSteps;
        }
        else {
            throw new Error(this.getErrorMessage('some', step));
        }
    }
    /**
     * Assert the specified step will be reached x times.
     * @returns how many times this step has occured.
     */
    all(step, plan) {
        if (plan <= 0) {
            throw new Error(`${plan} is not a valid 'plan' value.`);
        }
        if (this.targetMiniSteps && this.targetMiniSteps !== plan) {
            throw new Error(`The plan count (${plan}) does not match with previous value (${this.targetMiniSteps}).`);
        }
        if (this.isValidStep('all', [step], plan)) {
            if (this.targetMiniSteps === undefined) {
                this.targetMiniSteps = plan;
                this.miniSteps = 0;
                this.moveNext({
                    all: [step]
                });
            }
            this.miniSteps++;
            if (plan === this.miniSteps) {
                this.moveNext();
                this.nextStep++;
                this.targetMiniSteps = undefined;
            }
            return this.miniSteps;
        }
        else {
            throw new Error(this.getErrorMessage('all', step));
        }
    }
    isValidStep(fnName, steps, count) {
        // console.log(`${fnName}(${steps}${count ? ',' + count : ''}), c: ${this.currentStep}, m: ${this.miniSteps}`, this.possibleMoves)
        const id = AssertOrder$1.alias[fnName] || fnName;
        const step = steps.find(s => this.possibleMoves[id] && this.possibleMoves[id].some(x => x === s));
        return (!count || this.miniSteps <= count) && step !== undefined;
    }
    moveNext(nextMoves = {
            once: [this.nextStep + 1],
            some: [this.nextStep + 1],
            all: [this.nextStep + 1]
        }) {
        this.possibleMoves = nextMoves;
    }
    getErrorMessage(calledFn, ...calledSteps) {
        const should = [];
        for (let key in this.possibleMoves) {
            should.push(...([key, ...AssertOrder$1.reverseAlias[key]].map(name => `'${name}(${this.possibleMoves[key].join('|')})'`)));
        }
        return `Expecting ${should.join(', ')}, but received '${calledFn}(${calledSteps.join(',')})'`;
    }
}
AssertOrder$1.alias = {
    step: 'once',
    any: 'once',
    multiple: 'all'
};
AssertOrder$1.reverseAlias = {
    once: ['step'],
    some: [],
    all: ['multiple']
};

exports['default'] = AssertOrder$1;

}((this.AssertOrder = this.AssertOrder || {})));
//# sourceMappingURL=assert-order.es2015.js.map
