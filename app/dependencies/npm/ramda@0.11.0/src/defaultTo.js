/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function defaultTo(d, v) {
  return v == null ? d : v;
});
