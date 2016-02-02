window.Multi = new function () {
    var URL = window.URL || window.webkitURL;
    var Blob = window.Blob;
    var BlobUrl = false;
    var supportWorker = false;

    //Check worker is supported
    if( typeof window.Worker !== 'undefined' )
        supportWorker = true;
    if( !URL || !Blob )
        supportWorker = false;

    var threadNumber = 0;   //ID of each thread
    var states = { wait: 'wait', work: 'work', complete: 'complete', error: 'error' };
    
    this.isSupportWorker = function() {
        return supportWorker;
    };
    
    //Create new Thread
    this.Thread = function (threadFunc) {
        //Object properties
        this._threadFunc = threadFunc;
        this._evalCode = false;
        this._id = threadNumber++;
        this._state = states.wait;
        this._worker = null;
    };
    //Thread.getId
    this.Thread.prototype.getId = function () {
        return this._id;
    };
    //Thread States
    this.Thread.prototype.getState = function () {
        return this._state;
    };
    //Post message
    this.Thread.prototype.execute = function (data, callback) {
        if (!this._worker) throw new Error('Thread is not activated.');

        var self = this;
        this._state = states.work;

        //If support Worker, post data to thread
        if (supportWorker) {
            this._worker.postMessage(data);
            this._worker.onmessage = function (e) {
                self._state = states.complete;
                callback(null, e.data);
            };
            this._worker.onerror = function (e) {
                self._state = states.error;
                callback(e, null);
            }
        }
       //Else, let's just execute after 10 ms
        else {
            eval('var postData = ' + data + ';' + this._evalCode);
        }
        
        return this;
    };
    //Start Thread
    this.Thread.prototype.start = function () {
        if (this._worker) throw new Error('Thread already started.');

        var functionCode = this._threadFunc.toString();
        functionCode = functionCode.slice(functionCode.indexOf("{") + 1, functionCode.lastIndexOf("}"));

        var postVariable = functionCode.match(/return(\s*)(.*);/, 'postMessage ');
        //Check return statement is exists
        if (!postVariable || typeof postVariable[1] === 'undefined') throw new Error('Thread requires return statement.');

        //Check return statement is comment (\s : space selector)
        if (new RegExp(/\/\/(\s*)return/).test(functionCode)) throw new Error('Thread requires return statement.');
        if (new RegExp(/\/\*(\s*)return/).test(functionCode)) throw new Error('Thread requires return statement.');

        var returnCode = functionCode.match(/return(.*)(\s*);/)[1];

        //Support worker -> Create worker
        if (supportWorker) {
            functionCode = functionCode.replace(/return(\s*)(.*);/, 'postMessage(') + returnCode + ');';
            functionCode = "self.addEventListener('message', function(message) { var postData = message.data;" + functionCode + " });";

            var blob = new Blob([functionCode]);
            BlobUrl = URL.createObjectURL(blob); 
            this._worker = new Worker(BlobUrl);
        }
        //Else -> Parse for eval
        else {
            var evalCode = 'var threadResultData = 0; setTimeout(function() { ';
            var removeReturnCode = functionCode.replace(/return(.*)(\s*);/, '');
            removeReturnCode = removeReturnCode.replace(/return(.*)(\s*);/, '');

            evalCode += removeReturnCode;
            evalCode += 'threadResultData = ' + returnCode + ';';
            evalCode += 'callback(null, threadResultData);';
            evalCode += '}, 10);';

            this._evalCode = evalCode;
            this._worker = true;
        }
        
        return this;
    };
    //Terminate Thread
    this.Thread.prototype.terminate = function () {
        if(!this._worker) throw new Error('Thread is not activated');
        
        if(supportWorker) {
            this._worker.terminate();
            this._worker = URL.revokeObjectURL(BlobUrl);
        }
               
        this._worker = null;
        this._evalCode = false;
        
        return this;
    };
};