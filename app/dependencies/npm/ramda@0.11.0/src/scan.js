/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function scan(fn, acc, list) {
  var idx = 0,
      len = list.length + 1,
      result = [acc];
  while (++idx < len) {
    acc = fn(acc, list[idx - 1]);
    result[idx] = acc;
  }
  return result;
});
