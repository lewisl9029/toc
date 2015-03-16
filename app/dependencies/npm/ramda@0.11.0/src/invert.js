/* */ 
var _curry1 = require("./internal/_curry1");
var _has = require("./internal/_has");
var keys = require("./keys");
module.exports = _curry1(function invert(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = -1;
  var out = {};
  while (++idx < len) {
    var key = props[idx];
    var val = obj[key];
    var list = _has(val, out) ? out[val] : (out[val] = []);
    list[list.length] = key;
  }
  return out;
});
