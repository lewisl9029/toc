/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
module.exports = _curry2(_checkForMethod('take', function(n, list) {
  return _slice(list, 0, Math.min(n, list.length));
}));
