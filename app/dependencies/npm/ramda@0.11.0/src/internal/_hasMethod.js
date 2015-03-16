/* */ 
var _isArray = require("./_isArray");
module.exports = function _hasMethod(methodName, obj) {
  return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
};
