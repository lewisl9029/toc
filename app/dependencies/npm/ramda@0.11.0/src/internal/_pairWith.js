/* */ 
var _map = require("./_map");
module.exports = function _pairWith(fn) {
  return function(obj) {
    return _map(function(key) {
      return [key, obj[key]];
    }, fn(obj));
  };
};
