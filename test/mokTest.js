var assert = require('assert');
var mok = require('../mok');

describe('mok', function () {
	mok.attachToPrototype();

	describe('attachToPrototype()', function(){
		it('should attach to the correct prototypes', function(){
			assert(function(){}.mok, 'function prototype should have mok()');
			assert({}.mok, 'object prototype should have mok()');
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
			mock.callRealMethod = true;

			mock();

			assert(wasCalled, 'the function should have been called');
		});
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
			mock.func.callRealMethod = true;
			mock.func();

			assert.equal(that, mock, 'this should be the mocked item on function calls')
		});
	});
});