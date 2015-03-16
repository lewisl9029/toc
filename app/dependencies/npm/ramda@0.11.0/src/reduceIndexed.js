/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function reduceIndexed(fn, acc, list) {
  var idx = -1,
      len = list.length;
  while (++idx < len) {
    acc = fn(acc, list[idx], idx, list);
  }
  return acc;
});
