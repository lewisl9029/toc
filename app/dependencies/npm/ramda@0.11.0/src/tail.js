/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _slice = require("./internal/_slice");
module.exports = _checkForMethod('tail', function(list) {
  return _slice(list, 1);
});
