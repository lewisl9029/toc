/* */ 
var _contains = require("./internal/_contains");
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function uniq(list) {
  var idx = -1,
      len = list.length;
  var result = [],
      item;
  while (++idx < len) {
    item = list[idx];
    if (!_contains(item, result)) {
      result[result.length] = item;
    }
  }
  return result;
});
