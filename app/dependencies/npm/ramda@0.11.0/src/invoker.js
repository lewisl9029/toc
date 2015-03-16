/* */ 
var _slice = require("./internal/_slice");
var curry = require("./curry");
var curryN = require("./curryN");
module.exports = curry(function invoker(arity, method) {
  var initialArgs = _slice(arguments, 2);
  var len = arity - initialArgs.length;
  return curryN(len + 1, function() {
    var target = arguments[len];
    var args = initialArgs.concat(_slice(arguments, 0, len));
    return target[method].apply(target, args);
  });
});
