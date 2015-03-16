/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function zip(a, b) {
  var rv = [];
  var idx = -1;
  var len = Math.min(a.length, b.length);
  while (++idx < len) {
    rv[idx] = [a[idx], b[idx]];
  }
  return rv;
});
