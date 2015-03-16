/* */ 
var _concat = require("./internal/_concat");
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
var _isArray = require("./internal/_isArray");
module.exports = _curry2(function(set1, set2) {
  if (_isArray(set2)) {
    return _concat(set1, set2);
  } else if (_hasMethod('concat', set1)) {
    return set1.concat(set2);
  } else {
    throw new TypeError("can't concat " + typeof set1);
  }
});
