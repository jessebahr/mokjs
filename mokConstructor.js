//constructor-specific mocks

var mokObject = require('./mokObject');

module.exports = {
	mock: function(){
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
}