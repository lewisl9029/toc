/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function always(val) {
  return function() {
    return val;
  };
});
