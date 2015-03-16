/* */ 
var _curry1 = require("./internal/_curry1");
var keys = require("./keys");
module.exports = _curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = -1;
  while (++idx < len) {
    vals[idx] = obj[props[idx]];
  }
  return vals;
});
