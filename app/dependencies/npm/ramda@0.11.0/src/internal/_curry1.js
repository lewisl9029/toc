/* */ 
var __ = require("../__");
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0) {
      return f1;
    } else if (a === __) {
      return f1;
    } else {
      return fn(a);
    }
  };
};
