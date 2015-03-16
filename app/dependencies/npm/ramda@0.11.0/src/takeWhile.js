/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
module.exports = _curry2(_checkForMethod('takeWhile', function(fn, list) {
  var idx = -1,
      len = list.length;
  while (++idx < len && fn(list[idx])) {}
  return _slice(list, 0, idx);
}));
