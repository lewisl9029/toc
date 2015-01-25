/* */ 
"format cjs";
"use strict";
(function(sinon) {
  var realSetTimeout = setTimeout;
  function makeApi(sinon) {
    function log() {}
    function logError(label, err) {
      var msg = label + " threw exception: ";
      sinon.log(msg + "[" + err.name + "] " + err.message);
      if (err.stack) {
        sinon.log(err.stack);
      }
      logError.setTimeout(function() {
        err.message = msg + err.message;
        throw err;
      }, 0);
    }
    ;
    logError.setTimeout = function(func, timeout) {
      realSetTimeout(func, timeout);
    };
    var exports = {};
    exports.log = sinon.log = log;
    exports.logError = sinon.logError = logError;
    return exports;
  }
  function loadDependencies(require, exports, module) {
    var sinon = require("./util/core");
    module.exports = makeApi(sinon);
  }
  var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
  var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
  if (isAMD) {
    define(loadDependencies);
  } else if (isNode) {
    loadDependencies(require, module.exports, module);
  } else if (!sinon) {
    return;
  } else {
    makeApi(sinon);
  }
}(typeof sinon == "object" && sinon || null));
