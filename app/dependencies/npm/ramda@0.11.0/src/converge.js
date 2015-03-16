/* */ 
var _map = require("./internal/_map");
var _slice = require("./internal/_slice");
var curryN = require("./curryN");
module.exports = curryN(3, function(after) {
  var fns = _slice(arguments, 1);
  return function() {
    var args = arguments;
    return after.apply(this, _map(function(fn) {
      return fn.apply(this, args);
    }, fns));
  };
});
