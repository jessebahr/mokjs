//function-related mocks
var util = require('./util');


function mockFunction(func){
	var mocked = function(){
		arguments.callee.calls++;
		var returnval;

		//todo have a way to call a function but still return the real method return value - beforecall
		if (arguments.callee.callRealFunction)
			returnval = func.apply(this, util.argsToArray(arguments));

		var oncall = arguments.callee.oncall;
		if (typeof oncall === 'function')
			returnval = oncall.apply(this, util.argsToArray(arguments));
		else if (typeof oncall !== 'undefined')
			returnval = oncall;

		return returnval;
	}

	mocked.callRealFunction = false;
	mocked.calls = 0;

	return mocked;
}



module.exports = {
	mock: mockFunction
}