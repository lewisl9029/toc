/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function reduceRight(fn, acc, list) {
  var idx = list.length;
  while (idx--) {
    acc = fn(acc, list[idx]);
  }
  return acc;
});
