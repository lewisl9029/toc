/* */ 
var _curry2 = require("./internal/_curry2");
var _eqDeep = require("./internal/_eqDeep");
module.exports = _curry2(function eqDeep(a, b) {
  return _eqDeep(a, b, [], []);
});
