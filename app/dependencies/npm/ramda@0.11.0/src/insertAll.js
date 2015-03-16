/* */ 
var _concat = require("./internal/_concat");
var _curry3 = require("./internal/_curry3");
var _slice = require("./internal/_slice");
module.exports = _curry3(function insertAll(idx, elts, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
});
