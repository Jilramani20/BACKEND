# Difference between CJS and MJS 

<div style="display: flex; gap: 20px;">

<div style="flex: 1;">

### CJS (CommonJS)

- Older way but still followed  
- Uses `require` and `module.exports` 
- Synchronous loading of modules  
- non-strict mode
- File extension is typically `.js`  

</div>

<div style="flex: 1;">

### MJS (ES Modules)

- Newer way  
- Uses `import` and `export` 
- Asynchronous loading of modules  
- strict mode by default
- File extension is typically `.mjs` or `.js` with `"type": "module"`  

</div>

</div>


### <span style="color: orange;">Synchronous and Asynchronous module</span> 
In CJS, modules are loaded synchronously, meaning the code execution waits for the module to be fully loaded before proceeding. This can lead to blocking behavior, especially if the module is large or located on a slow network.

In MJS, modules are loaded asynchronously, allowing the code execution to continue while the module is being fetched. This non-blocking behavior is particularly beneficial for web applications where performance and responsiveness are critical.

### <span style="color: orange;">Note</span>
In node.js if we are importing somthing from a folder and we are not menstioning the file name then by default it will look for `index.js` file in that folder.

If there is no index.js file then it will throw an error.

So we can create an index.js file in that folder and export all the required files from there.

so insted of importing multiple files like this 

```js
const sum = require("./calculator/sum");
const sub = require("./calculator/sub");
const mult = require("./calculator/mult");
```
we can create an index.js file in calculator folder and export all the required files from there like this 
```js
// index.js
const sum = require("./sum");
const sub = require("./sub");
const mult = require("./mult");
module.exports = {sum, sub, mult};
```
Then we can import all the files from calculator folder like this 
```js
const {sum, sub, mult} = require("./calculator");
```