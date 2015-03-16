/* */ 
var _curry3 = require("./internal/_curry3");
var containsWith = require("./containsWith");
module.exports = _curry3(function differenceWith(pred, first, second) {
  var out = [];
  var idx = -1;
  var firstLen = first.length;
  var containsPred = containsWith(pred);
  while (++idx < firstLen) {
    if (!containsPred(first[idx], second) && !containsPred(first[idx], out)) {
      out[idx] = first[idx];
    }
  }
  return out;
});
