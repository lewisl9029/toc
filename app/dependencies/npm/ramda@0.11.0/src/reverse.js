/* */ 
var _curry1 = require("./internal/_curry1");
var _slice = require("./internal/_slice");
module.exports = _curry1(function reverse(list) {
  return _slice(list).reverse();
});
