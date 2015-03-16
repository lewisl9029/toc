/* */ 
var _curry1 = require("./internal/_curry1");
var liftN = require("./liftN");
module.exports = _curry1(function lift(fn) {
  return liftN(fn.length, fn);
});
