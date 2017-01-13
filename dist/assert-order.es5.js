/*! assert-order.js version: 2.2.3 generated on: Fri Jan 13 2017 */
var AssertOrder =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var AssertOrder = (function () {
    function AssertOrder(plannedSteps, initStep) {
        if (initStep === void 0) { initStep = 0; }
        this.plannedSteps = plannedSteps;
        this.miniSteps = 0;
        this.nextStep = initStep;
        this.possibleMoves = {
            once: [initStep],
            some: [initStep],
            all: [initStep]
        };
    }
    Object.defineProperty(AssertOrder.prototype, "next", {
        /**
         * Gets what is the next expecting step.
         * If the current step is `some(n)`, this reflects the step after `some(n)`
         */
        get: function () { return this.nextStep; },
        enumerable: true,
        configurable: true
    });
    AssertOrder.prototype.end = function (timeout) {
        var _this = this;
        var check = (function () {
            return _this.plannedSteps === undefined || _this.nextStep === _this.plannedSteps;
        });
        var getErrorMsg = function () { return "Planned " + _this.plannedSteps + " steps but executed " + _this.nextStep + " steps"; };
        if (timeout) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
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
    };
    AssertOrder.prototype.step = function (step) {
        if (this.isValidStep('step', [step])) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage('step', step));
        }
    };
    /**
     * Assert the specified step will run once.
     */
    AssertOrder.prototype.once = function (step) {
        // this.validate('once', [step], 1)
        if (this.isValidStep('once', [step])) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage('once', step));
        }
    };
    /**
     * Assert this place will be called during any of the specified steps.
     * @returns the step it is being called right now.
     */
    AssertOrder.prototype.any = function () {
        var anySteps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            anySteps[_i] = arguments[_i];
        }
        if (this.isValidStep('any', anySteps)) {
            this.moveNext();
            return this.nextStep++;
        }
        else {
            throw new Error(this.getErrorMessage.apply(this, ['any'].concat(anySteps)));
        }
    };
    /**
     * Assert the specified step will be reached at least once.
     * @returns how many times this step has occured.
     */
    AssertOrder.prototype.some = function (step) {
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
    };
    /**
     * Assert the specified step will be reached x times.
     * @returns how many times this step has occured.
     */
    AssertOrder.prototype.all = function (step, plan) {
        if (plan <= 0) {
            throw new Error(plan + " is not a valid 'plan' value.");
        }
        if (this.targetMiniSteps && this.targetMiniSteps !== plan) {
            throw new Error("The plan count (" + plan + ") does not match with previous value (" + this.targetMiniSteps + ").");
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
    };
    AssertOrder.prototype.isValidStep = function (fnName, steps, count) {
        var _this = this;
        // console.log(`${fnName}(${steps}${count ? ',' + count : ''}), c: ${this.currentStep}, m: ${this.miniSteps}`, this.possibleMoves)
        var id = AssertOrder.alias[fnName] || fnName;
        var step = steps.find(function (s) { return _this.possibleMoves[id] && _this.possibleMoves[id].some(function (x) { return x === s; }); });
        return (!count || this.miniSteps <= count) && step !== undefined;
    };
    AssertOrder.prototype.moveNext = function (nextMoves) {
        if (nextMoves === void 0) { nextMoves = {
            once: [this.nextStep + 1],
            some: [this.nextStep + 1],
            all: [this.nextStep + 1]
        }; }
        this.possibleMoves = nextMoves;
    };
    AssertOrder.prototype.getErrorMessage = function (calledFn) {
        var _this = this;
        var calledSteps = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            calledSteps[_i - 1] = arguments[_i];
        }
        var should = [];
        var _loop_1 = function (key) {
            should.push.apply(should, ([key].concat(AssertOrder.reverseAlias[key]).map(function (name) {
                return "'" + name + "(" + _this.possibleMoves[key].join('|') + ")'";
            })));
        };
        for (var key in this.possibleMoves) {
            _loop_1(key);
        }
        return "Expecting " + should.join(', ') + ", but received '" + calledFn + "(" + calledSteps.join(',') + ")'";
    };
    return AssertOrder;
}());
AssertOrder.alias = {
    step: 'once',
    any: 'once'
};
AssertOrder.reverseAlias = {
    once: ['step'],
    some: [],
    all: []
};
exports.AssertOrder = AssertOrder;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var assertOrder_1 = __webpack_require__(0);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = assertOrder_1.AssertOrder;


/***/ })
/******/ ]);
//# sourceMappingURL=assert-order.es5.js.map