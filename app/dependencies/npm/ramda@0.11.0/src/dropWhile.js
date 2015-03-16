/* */ 
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
module.exports = _curry2(function dropWhile(pred, list) {
  var idx = -1,
      len = list.length;
  while (++idx < len && pred(list[idx])) {}
  return _slice(list, idx);
});
