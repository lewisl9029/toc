/* */ 
var _concat = require("./internal/_concat");
var _curry3 = require("./internal/_curry3");
var _slice = require("./internal/_slice");
module.exports = _curry3(function remove(start, count, list) {
  return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
});
