/* */ 
var _curry2 = require("./internal/_curry2");
var _reduce = require("./internal/_reduce");
module.exports = _curry2(function partition(pred, list) {
  return _reduce(function(acc, elt) {
    var xs = acc[pred(elt) ? 0 : 1];
    xs[xs.length] = elt;
    return acc;
  }, [[], []], list);
});
