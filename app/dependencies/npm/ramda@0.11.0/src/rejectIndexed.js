/* */ 
var _curry2 = require("./internal/_curry2");
var _filterIndexed = require("./internal/_filterIndexed");
var not = require("./not");
module.exports = _curry2(function rejectIndexed(fn, list) {
  return _filterIndexed(not(fn), list);
});
