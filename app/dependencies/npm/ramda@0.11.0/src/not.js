/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function not(f) {
  return function() {
    return !f.apply(this, arguments);
  };
});
