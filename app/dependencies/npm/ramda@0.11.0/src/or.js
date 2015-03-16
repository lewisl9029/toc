/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function or(f, g) {
  return function _or() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  };
});
