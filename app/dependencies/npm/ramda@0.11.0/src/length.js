/* */ 
var _curry1 = require("./internal/_curry1");
var is = require("./is");
module.exports = _curry1(function length(list) {
  return list != null && is(Number, list.length) ? list.length : NaN;
});
