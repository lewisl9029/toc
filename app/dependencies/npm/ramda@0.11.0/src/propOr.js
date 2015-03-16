/* */ 
var _curry3 = require("./internal/_curry3");
var _has = require("./internal/_has");
module.exports = _curry3(function propOr(val, p, obj) {
  return _has(p, obj) ? obj[p] : val;
});
