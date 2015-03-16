/* */ 
var _baseCopy = require("./internal/_baseCopy");
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function clone(value) {
  return _baseCopy(value, [], []);
});
