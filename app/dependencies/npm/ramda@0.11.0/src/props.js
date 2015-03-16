/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function props(ps, obj) {
  var len = ps.length,
      out = [],
      idx = -1;
  while (++idx < len) {
    out[idx] = obj[ps[idx]];
  }
  return out;
});
