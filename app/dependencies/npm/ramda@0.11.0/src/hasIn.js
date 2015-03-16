/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function(prop, obj) {
  return prop in obj;
});
