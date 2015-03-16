/* */ 
var arity = require("../arity");
module.exports = function _createComposer(composeFunction) {
  return function() {
    var idx = arguments.length - 1;
    var fn = arguments[idx];
    var length = fn.length;
    while (idx--) {
      fn = composeFunction(arguments[idx], fn);
    }
    return arity(length, fn);
  };
};
