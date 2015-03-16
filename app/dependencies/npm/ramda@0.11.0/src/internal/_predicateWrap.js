/* */ 
var _pluck = require("./_pluck");
var _slice = require("./_slice");
var arity = require("../arity");
var max = require("../max");
module.exports = function _predicateWrap(predPicker) {
  return function(preds) {
    var predIterator = function() {
      var args = arguments;
      return predPicker(function(predicate) {
        return predicate.apply(null, args);
      }, preds);
    };
    return arguments.length > 1 ? predIterator.apply(null, _slice(arguments, 1)) : arity(max(_pluck('length', preds)), predIterator);
  };
};
