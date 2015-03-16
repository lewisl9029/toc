/* */ 
var _curry1 = require("./internal/_curry1");
var _has = require("./internal/_has");
var _map = require("./internal/_map");
module.exports = (function() {
  var repr = function(x) {
    return x + '::' + Object.prototype.toString.call(x);
  };
  var serialize = function(args) {
    return args.length + ':{' + _map(repr, args).join(',') + '}';
  };
  return _curry1(function memoize(fn) {
    var cache = {};
    return function() {
      var key = serialize(arguments);
      if (!_has(key, cache)) {
        cache[key] = fn.apply(this, arguments);
      }
      return cache[key];
    };
  });
}());
