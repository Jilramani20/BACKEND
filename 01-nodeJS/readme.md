## <span style="color: red">What is Node.js</span> 

Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to execute JavaScript code outside of a web browser. It is built on Chrome's V8 JavaScript engine.

It has extra functionalities. It has global objects and methods that are not part of the JavaScript language but are provided by Node.js to facilitate server-side development.

## <span style="color: red">V8 Engine</span>

It is just a piece of code that is written in c++ which understand JavaScript and convert it into machine code so that the computer can understand it.

V8 Engine follows acma script specifications to understand the JS code.

> JS code -> V8 Engine (C++) -> Machine Code

## <span style="color: red">How c++ understand JS code?</span>
V8 engine has two main components: a parser and a compiler. The parser reads the JavaScript code and converts it into an intermediate representation called Abstract Syntax Tree (AST). The compiler then takes this AST and translates it into machine code that can be executed by the computer's CPU.


## <span style="color: red">Why C++ not any other?</span>
Sever where build on C++ before so the sever allready understand C++ code. So if we want to run JS code there we just have to give V8 engine which is written in C++ so now server will understand JS code.

>so v8 can be embedded into any C++ application 

also C++ is a high-performance language that allows for efficient memory management and low-level system access, making it well-suited for building a runtime environment like Node.js.

It does not have garbage collection like Java or Python so it is faster.

## <span style="color: red">Comman JS Module (CJS)?</span>

CommonJS is a module system used in Node.js to organize and share code between different files. It allows developers to create reusable modules that can be imported and exported using the `require` and `module.exports` syntax.

```JavaScript
//second.js
console.log('welcome from 2nd file');

function sum(a,b){
    return a+b;
}

//first.js

require('./second'); //importing second.js file

const result = sum(2,3); //using sum function from second.js will give error
console.log(result);
```

Here we have imported second.js file in first.js file but when we try to use sum function it will give error because sum function is private to second.js file.

behinde the seen it is imported as a IIFE(Immediately Invoked Function Expression)

```JavaScript
//first.js
(function(){
    //code of second.js
    console.log('welcome from 2nd file');

    function sum(a,b){
        return a+b;
    }
})();
const result = sum(2,3); //using sum function from second.js will give error
console.log(result);
```

here we cab see that second.js code is wrapped inside a function so sum function is private to that function only. and that function runs immediately when it is defined.

### <span style="color: orange">module.exports and require()</span>

Now if we want to use sum function in first.js file then we have to export it from second.js file using module.exports

```JavaScript
//second.js
console.log('welcome from 2nd file');
function sum(a,b){
    return a+b;
}
module.exports = sum; //exporting sum function
```

```JavaScript
//first.js
const sum = require('./second')

console.log(sum(2, 6));
console.log('welcome to backend');
```

Here we have exported sum function from second.js file using module.exports and imported it in first.js file using require() function.

For multiple exports we can use an object to export multiple functions or variables.

```JavaScript
//second.js
console.log('welcome from 2nd file');
function sum(a,b){
    return a+b;
}
function multiply(a,b){
    return a*b;
}
module.exports = {sum, multiply}; //exporting sum and multiply functions
```
```JavaScript
//first.js
const {sum, multiply} = require('./second')
console.log(sum(2, 6));
console.log(multiply(2, 6));
console.log('welcome to backend');
```

module.exports is nothing but an empty object which is provided by Node.js to each module by default. We can add properties to this object to export them.

```JavaScript
//second.js
console.log('welcome from 2nd file');
function sum(a,b){
    return a+b;
}
function multiply(a,b){
    return a*b;
}
module.exports.sum = sum; //exporting sum function
module.exports.multiply = multiply; //exporting multiply function
```

### <span style="color: red">Latest Way</span>
In the latest version of Node.js we can use ES6 module system to import and export modules using `import` and `export` keywords.

But Node.js by default does not support ES6 module system. 

Fist way is that we can change the file extension from .js to .mjs

other way is to add "type": "module" in package.json file.

```JavaScript
//second.js
console.log('good to see you');

export function sum(a, b){
    return a+b;
}
```
```JavaScript
//first.js
import {sum} from './second.js';
console.log(sum(5, 7));
```