/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function zipWith(fn, a, b) {
  var rv = [],
      idx = -1,
      len = Math.min(a.length, b.length);
  while (++idx < len) {
    rv[idx] = fn(a[idx], b[idx]);
  }
  return rv;
});
