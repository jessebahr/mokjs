

module.exports = {
	/**
	 * convert an arguments object to an array (for use in function.call())
	 * @param args an arguments object, like the one you get out of a function call.
	 * @return {Array}
	 */
	argsToArray: function(args){
		//arguments object is not an actual array!
		var result = [];
		for (var i = 0; i < args.length; i++){
			result[i] = args[i];
		}

		return result;
	}
}