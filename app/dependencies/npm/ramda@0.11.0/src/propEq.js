/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function propEq(name, val, obj) {
  return obj[name] === val;
});
