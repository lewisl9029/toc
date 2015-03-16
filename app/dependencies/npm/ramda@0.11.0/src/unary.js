/* */ 
var _curry1 = require("./internal/_curry1");
var nAry = require("./nAry");
module.exports = _curry1(function unary(fn) {
  return nAry(1, fn);
});
