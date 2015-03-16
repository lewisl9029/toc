/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function findIndex(fn, list) {
  var idx = -1;
  var len = list.length;
  while (++idx < len) {
    if (fn(list[idx])) {
      return idx;
    }
  }
  return -1;
});
