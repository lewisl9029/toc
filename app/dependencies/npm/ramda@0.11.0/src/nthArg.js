/* */ 
var _curry1 = require("./internal/_curry1");
var _nth = require("./internal/_nth");
module.exports = _curry1(function nthArg(n) {
  return function() {
    return _nth(n, arguments);
  };
});
