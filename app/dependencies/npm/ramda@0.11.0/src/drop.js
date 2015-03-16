/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
module.exports = _curry2(_checkForMethod('drop', function drop(n, list) {
  return n < list.length ? _slice(list, n) : [];
}));
