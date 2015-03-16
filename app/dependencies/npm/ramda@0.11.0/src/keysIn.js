/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function keysIn(obj) {
  var prop,
      ks = [];
  for (prop in obj) {
    ks[ks.length] = prop;
  }
  return ks;
});
