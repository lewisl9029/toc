/* */ 
var _curry1 = require("./internal/_curry1");
var constructN = require("./constructN");
module.exports = _curry1(function construct(Fn) {
  return constructN(Fn.length, Fn);
});
