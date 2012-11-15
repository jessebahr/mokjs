var Verifier = require('./Verifier')


function mockFunction(func){

	var mocked = function(){
		arguments.callee.calls++;

		//todo log the arguments
		if (arguments.callee.callRealMethod)
			return func.apply(this, arguments);

		//todo have a way to return specific things for different args
		if (typeof arguments.callee.returnValue !== 'undefined')
			return arguments.callee.returnValue;
	}

	mocked.callRealMethod = false;
	mocked.calls = 0;

	//todo function to tell if called with a certain argument(s)

	return mocked;
}

function mockObject(obj){
	var result = {}
	for (var key in obj){
		var member = obj[key]
		if (typeof member === 'function')
			result[key] = mockFunction(member);
		else
			result[key] = member;
	}

	return result;
}

//todo function mockConstructor(const)

function mok(v){
	if (typeof v === 'object')
		return mockObject(v)
	return mockFunction(v)
}

mok.obj = mockObject;
mok.func = mockFunction;

/* optionally attach methods to the Function and Object prototypes that create mocks.
 * This way, you'll be able to do something like:
 * var mockAlert = alert.mok();
 * someFunction();
 * assert(mockAlert.called === 1);
 */
mok.attachToPrototype = function(){
	Function.prototype.mok = Object.prototype.mok = function(){
		return mok(this);
	}
}


module.exports = mok;