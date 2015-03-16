/* */ 
var _filter = require("./_filter");
module.exports = function _functionsWith(fn) {
  return function(obj) {
    return _filter(function(key) {
      return typeof obj[key] === 'function';
    }, fn(obj));
  };
};
