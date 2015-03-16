/* */ 
var _curry2 = require("./internal/_curry2");
var filter = require("./filter");
var not = require("./not");
module.exports = _curry2(function reject(fn, list) {
  return filter(not(fn), list);
});
