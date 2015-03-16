/* */ 
var _curry1 = require("./internal/_curry1");
var _hasMethod = require("./internal/_hasMethod");
module.exports = _curry1(function empty(x) {
  return _hasMethod('empty', x) ? x.empty() : [];
});
