/* */ 
var transferFlags = require("./transferFlags");
var flag = require("./flag");
var config = require("../config");
var hasProtoSupport = '__proto__' in Object;
var excludeNames = /^(?:length|name|arguments|caller)$/;
var call = Function.prototype.call,
    apply = Function.prototype.apply;
module.exports = function(ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function() {};
  }
  var chainableBehavior = {
    method: method,
    chainingBehavior: chainingBehavior
  };
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;
  Object.defineProperty(ctx, name, {
    get: function() {
      chainableBehavior.chainingBehavior.call(this);
      var assert = function assert() {
        var old_ssfi = flag(this, 'ssfi');
        if (old_ssfi && config.includeStack === false)
          flag(this, 'ssfi', assert);
        var result = chainableBehavior.method.apply(this, arguments);
        return result === undefined ? this : result;
      };
      if (hasProtoSupport) {
        var prototype = assert.__proto__ = Object.create(this);
        prototype.call = call;
        prototype.apply = apply;
      } else {
        var asserterNames = Object.getOwnPropertyNames(ctx);
        asserterNames.forEach(function(asserterName) {
          if (!excludeNames.test(asserterName)) {
            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
            Object.defineProperty(assert, asserterName, pd);
          }
        });
      }
      transferFlags(this, assert);
      return assert;
    },
    configurable: true
  });
};
