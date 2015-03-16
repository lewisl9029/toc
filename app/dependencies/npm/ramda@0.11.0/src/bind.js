/* */ 
var _curry2 = require("./internal/_curry2");
var arity = require("./arity");
module.exports = _curry2(function bind(fn, thisObj) {
  return arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
