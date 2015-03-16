/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function forEachIndexed(fn, list) {
  var idx = -1,
      len = list.length;
  while (++idx < len) {
    fn(list[idx], idx, list);
  }
  return list;
});
