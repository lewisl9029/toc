/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function zipObj(keys, values) {
  var idx = -1,
      len = keys.length,
      out = {};
  while (++idx < len) {
    out[keys[idx]] = values[idx];
  }
  return out;
});
