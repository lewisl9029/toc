/* */ 
var __ = require("./__");
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
var arity = require("./arity");
module.exports = _curry2(function curryN(length, fn) {
  return arity(length, function() {
    var n = arguments.length;
    var shortfall = length - n;
    var idx = n;
    while (idx--) {
      if (arguments[idx] === __) {
        shortfall += 1;
      }
    }
    if (shortfall <= 0) {
      return fn.apply(this, arguments);
    } else {
      var initialArgs = _slice(arguments);
      return curryN(shortfall, function() {
        var currentArgs = _slice(arguments);
        var combinedArgs = [];
        var idx = -1;
        while (++idx < n) {
          var val = initialArgs[idx];
          combinedArgs[idx] = (val === __ ? currentArgs.shift() : val);
        }
        return fn.apply(this, combinedArgs.concat(currentArgs));
      });
    }
  });
});
