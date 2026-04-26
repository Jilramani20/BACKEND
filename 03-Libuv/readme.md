# <span style="color: red;">Libuv</span>

JavaScript is single-threaded by nature, which means it can only execute one operation at a time.

Also javaScript cannot do this things like file system operations, network fetching, timers, etc. on its own. this all operations need operating system support to perform these tasks.

So when we need a system access we need operation system support to perform these tasks. But in JavaScript we don't have direct access to operating system APIs in frontend we have used browser APIs but in backend we are using node.js so how will node.js access operating system APIs?

We know that node.js has a global object with which we can access some built-in modules like `fs`, `http`, `net`, etc. but how these modules are implemented in node.js?

JavaScript is High-level programming language but to access operating system APIs we need low-level programming language like C or C++. So node.

> Here comes the role of <span style="color: red;">**Libuv**</span>.

Libuv is a **multi-platform** support library with a focus on asynchronous I/O based on event loops it is written in C.

## <span style="color: orange;">Let's see how It works ?</span> 

When we want some system access like file system operation or network request, the node.js built-in modules internally use libuv to perform these operations.

V8 engine executes JavaScript code and when it encounters some I/O operation it sends the request to libuv and libuv uses operating system APIs to perform these tasks asynchronously after completing the operation it notifies V8 engine through event loop and the callback function associated with that operation is executed.

Also libuv is multi-platform which means it can run on different operating systems like Windows, Linux, macOS, etc. so V8 engine doesn't need to worry about the operating system.s