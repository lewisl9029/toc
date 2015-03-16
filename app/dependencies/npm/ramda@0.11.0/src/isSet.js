/* */ 
var _curry1 = require("./internal/_curry1");
var _indexOf = require("./internal/_indexOf");
module.exports = _curry1(function isSet(list) {
  var len = list.length;
  var idx = -1;
  while (++idx < len) {
    if (_indexOf(list, list[idx], idx + 1) >= 0) {
      return false;
    }
  }
  return true;
});
