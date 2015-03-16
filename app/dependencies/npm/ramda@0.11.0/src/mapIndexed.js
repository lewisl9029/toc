/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function mapIndexed(fn, list) {
  var idx = -1,
      len = list.length,
      result = [];
  while (++idx < len) {
    result[idx] = fn(list[idx], idx, list);
  }
  return result;
});
