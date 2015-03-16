/* */ 
var _curry1 = require("./internal/_curry1");
module.exports = _curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
