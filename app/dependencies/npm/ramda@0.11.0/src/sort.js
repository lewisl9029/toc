/* */ 
var _curry2 = require("./internal/_curry2");
var clone = require("./clone");
module.exports = _curry2(function sort(comparator, list) {
  return clone(list).sort(comparator);
});
