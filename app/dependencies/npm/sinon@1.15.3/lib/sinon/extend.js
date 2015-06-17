/* */ 
"format cjs";
"use strict";
(function(sinon) {
  function makeApi(sinon) {
    var hasDontEnumBug = (function() {
      var obj = {
        constructor: function() {
          return "0";
        },
        toString: function() {
          return "1";
        },
        valueOf: function() {
          return "2";
        },
        toLocaleString: function() {
          return "3";
        },
        prototype: function() {
          return "4";
        },
        isPrototypeOf: function() {
          return "5";
        },
        propertyIsEnumerable: function() {
          return "6";
        },
        hasOwnProperty: function() {
          return "7";
        },
        length: function() {
          return "8";
        },
        unique: function() {
          return "9";
        }
      };
      var result = [];
      for (var prop in obj) {
        result.push(obj[prop]());
      }
      return result.join("") !== "0123456789";
    })();
    function extend(target) {
      var sources = Array.prototype.slice.call(arguments, 1),
          source,
          i,
          prop;
      for (i = 0; i < sources.length; i++) {
        source = sources[i];
        for (prop in source) {
          if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
          }
        }
        if (hasDontEnumBug && source.hasOwnProperty("toString") && source.toString !== target.toString) {
          target.toString = source.toString;
        }
      }
      return target;
    }
    ;
    sinon.extend = extend;
    return sinon.extend;
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
