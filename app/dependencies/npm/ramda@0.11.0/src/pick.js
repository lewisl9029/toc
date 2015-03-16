/* */ 
var _curry2 = require("./internal/_curry2");
var _indexOf = require("./internal/_indexOf");
module.exports = _curry2(function pick(names, obj) {
  var result = {};
  for (var prop in obj) {
    if (_indexOf(names, prop) >= 0) {
      result[prop] = obj[prop];
    }
  }
  return result;
});
