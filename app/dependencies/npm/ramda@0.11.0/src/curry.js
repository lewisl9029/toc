/* */ 
var _curry1 = require("./internal/_curry1");
var curryN = require("./curryN");
module.exports = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});
