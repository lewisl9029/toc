/* */ 
var _curry2 = require("./internal/_curry2");
var _isInteger = require("./internal/_isInteger");
module.exports = _curry2(function mathMod(m, p) {
  if (!_isInteger(m)) {
    return NaN;
  }
  if (!_isInteger(p) || p < 1) {
    return NaN;
  }
  return ((m % p) + p) % p;
});
