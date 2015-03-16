/* */ 
(function(process) {
  var _concat = require("./internal/_concat");
  var _curry2 = require("./internal/_curry2");
  var curryN = require("./curryN");
  module.exports = _curry2(function wrap(fn, wrapper) {
    return curryN(fn.length, function() {
      return wrapper.apply(this, _concat([fn], arguments));
    });
  });
})(require("process"));
