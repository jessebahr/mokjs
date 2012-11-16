Mok JS
===============
Mok JS is the JavaScript mocking library that loves JavaScript. Mok JS is created for use in Node JS. For the browser, use the file exports/mok.js

Creating a mock
====
```javascript

	function aFunc(){
		...
	}

	var aFuncMock = mok(aFunc);
	aFuncMock(); //aFunc will not be called
	aFuncMock.calls; // 1, the number of times it's been called

	var anObject = {
		field: 1313,
		func: function(){
			...
		}
	};

	var anObjectMock = mok(anObject);
	anObjectMock.field; // 1313 - copies fields
	anObjectMock.func(); //anObject.func will not be called
	anObjectMock.func.calls //1, the number of times it's been called
```

Attaching to Object and Function prototype
====
Things get way easier if you just attach mok() to the prototypes.
```javascript
	mok.attachToPrototype();

	var funcMock = function(){
		...
	}.mok();
	//funcMock is a mocked version of the function

	var objectMock = {
		field: 1313,
		func: function(){
			...
		}
	}.mok();
	//objectMock is a mocked version of the object
```

The rest of this readme will assume that you did just that.

Creating a spy / calling the real method
====
To call the real method, just set callRealFunction to true:
```javascript
	var called = false;
	var funcMock = function(){
		called = true;
	}.mok();
	funcMock.callRealFunction = true;

	funcMock(); //sets called to true
	funcMock.calls; //still increments the number of calls like a regular mock
```

Returning a value
====
To force the mock to return a specific value, just set the oncall:
```javascript
	var funcMock = function(){}.mok();
	funcMock.oncall = 'my return value';
	funcMock(); // => 'my return value' (couldn't resist lining these up :D)
```

If oncall is a function, that function will be called with the arguments and this pointer intact. The return value will be returned from the mock:
```javascript
	var funcMock = function(){}.mok();
	funcMock.oncall = function(arg1, arg2, etc){
		return 'asdf';
	}
	funcMock('some arg'); // => 'asdf'
```

If there is an oncall and callRealFunction is true, the value or result of oncall overrides the return value of the real function.

Mockito to MokJS mapping
====
Familiar with the Mockito style? No problem:
<table>
	<tr>
		<th>Mockito</th>
		<th>MokJS</th>
	</tr>
	<tr>
		<td>when(mock).aMethod().thenReturn("some value");</td>
		<td>mock.aMethod.oncall = 'some value'</td>
	</tr>
	<tr>
		<td>when(mock).aMethod("this arg").thenReturn("another value")</td>
		<td>Use the oncall function <pre>
mock.aMethod.oncall = function(arg){
	if (arg === 'this arg')
		return 'another value'
}</pre></td>
	</tr>
	<tr>
		<td>verify(mock).method()</td>
		<td>assert(mock.method.calls, 1)</td>
	</tr>
	<tr>
		<td>verify(mock).method('a value')</td>
		<td>Again, use the oncall: ```javascript
var foundArg = 0;
mock.method.oncall = function(arg){
	if (arg === 'a value')
		foundArg++;
}

...

assert(foundArg, 1, 'method called with argument 1 time');
```</td>
	</tr>
</table>

To do
====
* Add a way to call the real function from the oncall
* Add constructor mocking
* Add a way to mock an object-function (a function that also has fields and methods)
