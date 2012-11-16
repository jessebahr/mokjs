function argsToArray(args){
	//arguments object is not an actual array!
	var result = [];
	for (var i = 0; i < args.length; i++){
		result[i] = args[i];
	}

	return result;
}

function mockFunction(func){
	var mocked = function(){
		arguments.callee.calls++;
		var returnval;

		//todo have a way to call a function but still return the real method return value - beforecall
		if (arguments.callee.callRealFunction)
			returnval = func.apply(this, argsToArray(arguments));

		var oncall = arguments.callee.oncall;
		if (typeof oncall === 'function')
			returnval = oncall.apply(this, argsToArray(arguments));
		else if (typeof oncall !== 'undefined')
			returnval = oncall;

		return returnval;
	}

	mocked.callRealFunction = false;
	mocked.calls = 0;

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