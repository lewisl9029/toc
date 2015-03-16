/* */ 
var _curry2 = require("./internal/_curry2");
var always = require("./always");
var times = require("./times");
module.exports = _curry2(function repeat(value, n) {
  return times(always(value), n);
});
