/* */ 
var _curry2 = require("./internal/_curry2");
var _has = require("./internal/_has");
module.exports = _curry2(function countBy(fn, list) {
  var counts = {};
  var len = list.length;
  var idx = -1;
  while (++idx < len) {
    var key = fn(list[idx]);
    counts[key] = (_has(key, counts) ? counts[key] : 0) + 1;
  }
  return counts;
});
