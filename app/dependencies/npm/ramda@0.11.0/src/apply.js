/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function apply(fn, args) {
  return fn.apply(this, args);
});
