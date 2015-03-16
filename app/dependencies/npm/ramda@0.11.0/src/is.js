/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function is(Ctor, val) {
  return val != null && val.constructor === Ctor || val instanceof Ctor;
});
