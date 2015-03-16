/* */ 
var _append = require("./internal/_append");
var _curry2 = require("./internal/_curry2");
var _reduce = require("./internal/_reduce");
module.exports = _curry2(function groupBy(fn, list) {
  return _reduce(function(acc, elt) {
    var key = fn(elt);
    acc[key] = _append(elt, acc[key] || (acc[key] = []));
    return acc;
  }, {}, list);
});
