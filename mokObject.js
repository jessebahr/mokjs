var mokFunction = require('./mokFunction');

/**
 * mock a field of an object. If the field is a function, mock it. Otherwise, just return it.
 *
 * @param member
 * @return a mock of member if member is a function, or just member otherwise.
 */
function mockField(member){
	if (typeof member === 'function')
		return mokFunction.mock(member);
	else
		return member;
}


function mockObject(obj){
	var result = {}
	for (var key in obj){
		result[key] = mockField(obj[key]);

	}

	return result;
}

module.exports = {
	mock: mockObject,
	mockField: mockField
}