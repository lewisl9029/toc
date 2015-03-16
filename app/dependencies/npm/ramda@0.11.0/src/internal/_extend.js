/* */ 
var keys = require("../keys");
module.exports = function _extend(destination, other) {
  var props = keys(other),
      idx = -1,
      length = props.length;
  while (++idx < length) {
    destination[props[idx]] = other[props[idx]];
  }
  return destination;
};
