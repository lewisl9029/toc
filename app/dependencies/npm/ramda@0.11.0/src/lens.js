/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function lens(get, set) {
  var lns = function(a) {
    return get(a);
  };
  lns.set = _curry2(set);
  lns.map = _curry2(function(fn, a) {
    return set(fn(get(a)), a);
  });
  return lns;
});
