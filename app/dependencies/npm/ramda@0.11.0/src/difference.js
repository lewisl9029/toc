/* */ 
var _contains = require("./internal/_contains");
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function difference(first, second) {
  var out = [];
  var idx = -1;
  var firstLen = first.length;
  while (++idx < firstLen) {
    if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
      out[out.length] = first[idx];
    }
  }
  return out;
});
