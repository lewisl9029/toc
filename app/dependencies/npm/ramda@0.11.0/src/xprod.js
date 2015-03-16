/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function xprod(a, b) {
  var idx = -1;
  var ilen = a.length;
  var j;
  var jlen = b.length;
  var result = [];
  while (++idx < ilen) {
    j = -1;
    while (++j < jlen) {
      result[result.length] = [a[idx], b[j]];
    }
  }
  return result;
});
