/* */ 
var _contains = require("./internal/_contains");
var _curry2 = require("./internal/_curry2");
var _filter = require("./internal/_filter");
var flip = require("./flip");
var uniq = require("./uniq");
module.exports = _curry2(function intersection(list1, list2) {
  return uniq(_filter(flip(_contains)(list1), list2));
});
