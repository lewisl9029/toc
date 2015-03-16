/* */ 
var _curry2 = require("./internal/_curry2");
var _extend = require("./internal/_extend");
module.exports = _curry2(function merge(a, b) {
  return _extend(_extend({}, a), b);
});
