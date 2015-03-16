/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function and(f, g) {
  return function _and() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  };
});
