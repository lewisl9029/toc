/* */ 
var _containsWith = require("./internal/_containsWith");
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function uniqWith(pred, list) {
  var idx = -1,
      len = list.length;
  var result = [],
      item;
  while (++idx < len) {
    item = list[idx];
    if (!_containsWith(pred, item, result)) {
      result[result.length] = item;
    }
  }
  return result;
});
