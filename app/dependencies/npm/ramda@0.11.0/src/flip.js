/* */ 
var _curry1 = require("./internal/_curry1");
var _slice = require("./internal/_slice");
var curry = require("./curry");
module.exports = _curry1(function flip(fn) {
  return curry(function(a, b) {
    var args = _slice(arguments);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});
