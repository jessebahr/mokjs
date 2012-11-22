var mokFunction = 	 require('./mokFunction');
var mokObject =		 require('./mokObject');
var mokConstructor = require('./mokConstructor')
var util = 			 require('./util');






function mockConstructor(con){
	var nonProtoThings = {}, key;

	function mockCon(){
		for (key in nonProtoThings){
			this[key] = nonProtoThings[key];
		}

		this.constructor = con;
	}

	/**
	 * mprototype contains all the fields that a new instance will have. This allows access to the mock functions.
	 * @type {Object}
	 */
	mockCon.mprototype = {};

	mockCon.prototype = mokObject.mock(con.prototype);


	//mock prototype fields
	for (key in mockCon.prototype)
		mockCon.mprototype[key] = mockCon.prototype[key];

	var args = util.argsToArray(arguments).slice(1);
	con.apply(nonProtoThings, args); //Fake an instantiation with nonProtoThings being the "this".

	for (key in nonProtoThings){
		nonProtoThings[key] = mokObject.mockField(nonProtoThings[key]);
		mockCon.mprototype[key] = nonProtoThings[key];
	}

	return mockCon;
}

function mok(v){
	if (typeof v === 'object')
		return mokObject.mock(v);
	return mokFunction.mock(v);
}


/**
 * mock an object, returning an object with all fields shallow-copied, and all functions mocked.
 */
mok.obj = mokObject.mock;

/**
 * mock a function, returning a mocked version of the function.
 */
mok.func = mokFunction.mock;

/**
 * mock a constructor, returning a mock-constructor which creates a mock when instantiated
 */
mok.construct = mockConstructor;

/* attach methods to the Function and Object prototypes that create mocks.
 * This way, you'll be able to do something like:
 * var mockAlert = alert.mok();
 * someFunction();
 * assert(mockAlert.called === 1);
 */
Function.prototype.mok = Object.prototype.mok = function(){
	return mok(this);
}

Function.prototype.cmok = function(){
	var args = util.argsToArray(arguments)
	args.unshift(this);

	return mok.construct.apply(this, args);
}



module.exports = mok;