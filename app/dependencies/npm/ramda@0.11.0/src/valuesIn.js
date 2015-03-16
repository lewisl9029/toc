/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function valuesIn(obj) {
  var prop,
      vs = [];
  for (prop in obj) {
    vs[vs.length] = obj[prop];
  }
  return vs;
});
