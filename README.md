Mok JS
===============
Mok JS is the JavaScript mocking library that respects JavaScript as a language. It's currently for Node JS, but I have plans to modify it for browser use later.

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
To call the real method, just set callRealMethod to true:
```javascript
	var called = false;
	var funcMock = function(){
		called = true;
	}
	funcMock.callRealMethod = true;

	funcMock(); //sets called to true
	funcMock.calls; //still increments the number of calls like a regular mock
```

To do
====
* Add a way to specify a return value
* Add a way to return specific values or call the real function when presented with certain args
* Add a way to manipulate the this pointer
* Store the arguments and this pointer for each call to the mock
* Add constructor mocking
* Add a way to mock an object-function (a function that also has fields and methods)
