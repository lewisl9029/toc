/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function findLast(fn, list) {
  var idx = list.length;
  while (idx--) {
    if (fn(list[idx])) {
      return list[idx];
    }
  }
});
