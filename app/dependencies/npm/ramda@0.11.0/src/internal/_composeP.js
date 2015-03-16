/* */ 
var _isThenable = require("./_isThenable");
module.exports = function _composeP(f, g) {
  return function() {
    var context = this;
    var value = g.apply(this, arguments);
    if (_isThenable(value)) {
      return value.then(function(result) {
        return f.call(context, result);
      });
    } else {
      return f.call(this, value);
    }
  };
};
