/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function lensOn(get, set, obj) {
  var lns = function() {
    return get(obj);
  };
  lns.set = set;
  lns.map = function(fn) {
    return set(fn(get(obj)));
  };
  return lns;
});
