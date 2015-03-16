/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function once(fn) {
  var called = false,
      result;
  return function() {
    if (called) {
      return result;
    }
    called = true;
    result = fn.apply(this, arguments);
    return result;
  };
});
