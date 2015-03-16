/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, xs) {
  return Array.prototype.slice.call(xs, fromIndex, toIndex);
}));
