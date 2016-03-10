# Multi.js v2.0.1

The light weight, easy use, cross-browsing multithread JavaScript library.

## Q. How does it work?
A. If the browser supports "Web Worker API and Blob", use Web worker. But if not, use the timer instead. Yes, trully, it is not "cross-browsing multithread", but you can use any browser.

## Q. Support?
A. IE5.5-11 and all major browsers supported (highly recommend to use with X-browsing event handlers)

## Q. How to use it?
A. Read the "how to use" below.

## Q. License?
A. Free to use. Thanks.



## How to use?

1. include "multi.js" or "multi.js.min" on your website.
2. Create "Thread" object with the inline script. That is actually works as new thread.
   ```javascript
   var myThread = new Multi.Thread(function() {
       return postData;
   });
   ```
   
   you can see "postData" variable. this is important. this variable is pre-defined variable for receiving data from caller.
   you must specify the return statement which returns data to the caller.
   
3. start the thread.
   ```javascript
   myThread.start();
   ```
   
4. execute the thread.
   ```javascript
   myThread.execute(100, function(err, data) {
       if(err) throw new Error(err);
       
       console.log(data);
   });
   ```
   
   execute method requires 2 parameter. first argument is data that send to the thread. second argument is callback function.
   callback function has 2 params, first one is error object and second one is returned data(remember the return state above).
   
5. you can terminate thread whenever you want.
   ```javascript
   myThread.terminate();
   ```
   
6. Or, you can reactivate it.
   ```javascript
   myThread.start();
   ```
   
7. you can also chaining the methods like this:
   ```javascript
   myThread.start().execute(100, function(err, data) { ... } );
   ```


## note:
* you can use this library everywhere, even you can use it for Cordova or NW.js like something.


Please don't hesitate to ask some issues on github issues page. Or you can send me a mail: rico345100@gmail.com
