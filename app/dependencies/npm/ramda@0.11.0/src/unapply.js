/* */ 
var _curry1 = require("./internal/_curry1");
var _slice = require("./internal/_slice");
module.exports = _curry1(function unapply(fn) {
  return function() {
    return fn(_slice(arguments));
  };
});
