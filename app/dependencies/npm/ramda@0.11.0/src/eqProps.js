/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function eqProps(prop, obj1, obj2) {
  return obj1[prop] === obj2[prop];
});
