/* */ 
var _slice = require("./internal/_slice");
var curry = require("./curry");
module.exports = curry(function call(fn) {
  return fn.apply(this, _slice(arguments, 1));
});
