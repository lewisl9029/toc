/* */ 
var _slice = require("./internal/_slice");
var curry = require("./curry");
module.exports = curry(function func(funcName, obj) {
  return obj[funcName].apply(obj, _slice(arguments, 2));
});
