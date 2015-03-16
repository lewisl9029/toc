/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function tap(fn, x) {
  fn(x);
  return x;
});
