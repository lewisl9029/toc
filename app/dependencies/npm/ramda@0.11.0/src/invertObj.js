/* */ 
var _curry1 = require("./internal/_curry1");
var keys = require("./keys");
module.exports = _curry1(function invertObj(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = -1;
  var out = {};
  while (++idx < len) {
    var key = props[idx];
    out[obj[key]] = key;
  }
  return out;
});
