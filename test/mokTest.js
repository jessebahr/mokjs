var assert = require('assert');
var mok = require('../mok');

describe('mok', function () {
	describe('attachToPrototype()', function(){
		it('should attach to the correct prototypes', function(){
			assert(function(){}.mok, 'function prototype should have mok()');
			assert({}.mok, 'object prototype should have mok()');
		});

		it('attaches the constructor mock', function(){
			assert(function(){}.cmok, 'function prototype should have cmok()');
		})
	})

	describe('mok()', function(){
		it('should make a function one if appropriate', function(){
			var mock = function(){}.mok();
			assert.equal(typeof mock, 'function', 'mocked functions are a function');
		});

		it('should make an object one if appropriate', function(){
			var mock = {}.mok();
			assert.equal(typeof mock, 'object', 'mocked objects are an object');
		});
	})

	describe('mokFunction()', function () {
		it('should not call the actual function', function () {
			var wasCalled = false;
			var mock = function(){
				wasCalled = true;
			}.mok();

			mock();

			assert(!wasCalled, 'the function shouldnt have been called');
		});

		it('should increment the calls value', function(){
			var mock = function(){}.mok();
			mock();
			assert.equal(mock.calls, 1, 'the calls field should have been incremented');
		});

		it('should call the actual function when i tell it to', function(){
			var wasCalled = false;
			var mock = function(){
				wasCalled = true;
			}.mok();
			mock.callRealFunction = true;

			mock();

			assert(wasCalled, 'the function should have been called');
		});

		it('passes the arguments to the real function', function(){
			var arg = 'from here they appear to be tied, but I will go in for a closer look...';
			var mock = function(actual){
				assert.equal(actual, arg, 'the passed in argument is the right one');
			}.mok();
			mock.callRealFunction = true;

			mock(arg);
		});

		it('returns value of oncall', function(){
			var returnVal = 'That is the joke.';
			var mock = function(){}.mok();
			mock.oncall = returnVal;

			var actualReturnVal = mock();

			assert.equal(actualReturnVal, returnVal, 'mock should have returned what i set oncall to');
		});

		it('returns the oncall value', function(){
			var returnVal = 'On top of a pile of money';
			var mock = function(){}.mok();
			mock.oncall = function(){return returnVal}

			var actual = mock();

			assert.equal(actual, returnVal, 'return')
		})

		it('calls the oncall function with the passed-in args and this pointer', function(){
			var arg1 = 'my eyes!';
			var arg2 = 'the goggles do nothing!';

			var mock = function(){}.mok();
			mock.oncall = function(actual1, actual2){
				assert.equal(actual1, arg1, 'the first argument should be the expected one');
				assert.equal(actual2, arg2, 'the second argument should be the expected one');
				assert.equal(this, theThis, 'the this pointer should be the right one');
			}

			var theThis = {mock: mock};
			theThis.mock(arg1, arg2);
		})
	});

	describe('mokObject()', function(){
		it('mocks all functions of the object', function(){
			var mock = {
				func: function(){}
			}.mok();

			mock.func();

			assert.equal(mock.func.calls, 1, 'the calls field needs to be 1, indicating that we have a mock!');
		});

		it('copies over fields of the object', function(){
			var FIELD = 100000;
			var mock = {
				func: function(){},
				field: FIELD
			}.mok();

			assert.equal(mock.field, FIELD, 'the mocked object should have field from the original object')
		});

		it('maintains this pointer', function(){
			var that = null;
			var obj = {
				func: function(){
					that = this;
				}
			}
			var mock = obj.mok();
			mock.func.callRealFunction = true;
			mock.func();

			assert.equal(that, mock, 'this should be the mocked item on function calls')
		});
	});

	describe('mockConstructor()', function(){
		function Const(){

			this.field = 'Up and atom!';
			this.funcCalled = 0;
			this.func = function(){
				this.funcCalled++;
			}
		}

		Const.prototype.pfield = 'Up and at them!';
		Const.prototype.pfuncCalled = 0;
		Const.prototype.pfunc = function(){
			this.pfuncCalled++;
		};

		it('reports the correct constructor', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			assert.equal(mock.constructor, Const, 'mock should report the original constructor');
		});

		it('mocks prototype functions', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			mock.pfunc();
			assert.equal(mock.pfunc.calls, 1, 'prototyped functions should be mocked');
			assert.equal(mock.pfuncCalled, 0, 'prototyped function should not be called');
		});

		it('copies prototype fields', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			assert.equal(mock.pfield, Const.prototype.pfield, 'prototype field should be copied onto the mock');
		});

		it('copies non-prototype fields', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			assert.equal(mock.field, 'Up and atom!', 'non-prototype field found');
		});

		it('mocks non-prototype functions', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			mock.func();
			assert.equal(mock.funcCalled, 0, 'mock function should not be called');
			assert.equal(mock.func.calls, 1, 'mock should be called once');
		});

		it('calls the constructor with the right arguments', function(){
			var theArg = 'Mcbain to base, under attack by commie-nazis';
			function TheConst(arg){
				if (arg === theArg)
					this.foundIt = true;
			}
			var Mock = TheConst.cmok(theArg);
			var mock = new Mock;

			assert(mock.foundIt, 'the argument needs to be passed correctly');
		});

		it('only puts non-prototype fields on the object', function(){
			var Mock = Const.cmok();
			var mock = new Mock;

			assert(mock.hasOwnProperty('field'), 'mock should the property');
			assert(!mock.hasOwnProperty('pfield'), 'mock should not the prototype property');
		});

		it('puts prototype functions on mprototype', function(){
			var Mock = Const.cmok();

			assert.equal(typeof Mock.mprototype.pfunc, 'function', 'On the mprototype, pfunc is a function');

			Mock.mprototype.pfunc.oncall = 12345;
			var mock = new Mock;

			assert.equal(mock.pfunc(), 12345, 'pfunc returns the right thing because it is a mock');
		});

		it('puts non-proto functions on mprototype', function(){
			var Mock = Const.cmok();

			assert.equal(typeof Mock.mprototype.func, 'function', 'On the mprototype, func is a function');

			Mock.mprototype.func.oncall = 54321;
			var mock = new Mock;

			assert.equal(mock.func(), 54321, 'func returns the right thing because it is a mock');
		});
	});
});