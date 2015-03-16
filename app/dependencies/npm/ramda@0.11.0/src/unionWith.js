/* */ 
var _concat = require("./internal/_concat");
var _curry3 = require("./internal/_curry3");
var uniqWith = require("./uniqWith");
module.exports = _curry3(function unionWith(pred, list1, list2) {
  return uniqWith(pred, _concat(list1, list2));
});
