/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function findLastIndex(fn, list) {
  var idx = list.length;
  while (idx--) {
    if (fn(list[idx])) {
      return idx;
    }
  }
  return -1;
});
