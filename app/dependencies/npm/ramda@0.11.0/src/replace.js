/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});
