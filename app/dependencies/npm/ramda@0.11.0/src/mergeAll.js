/* */ 
var _curry1 = require("./internal/_curry1");
var merge = require("./merge");
var reduce = require("./reduce");
module.exports = _curry1(function mergeAll(list) {
  return reduce(merge, {}, list);
});
