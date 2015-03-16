/* */ 
(function(process) {
  var _curry3 = require("./internal/_curry3");
  module.exports = _curry3(function ifElse(condition, onTrue, onFalse) {
    return function _ifElse() {
      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
    };
  });
})(require("process"));
