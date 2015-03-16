/* */ 
var _curry2 = require("./internal/_curry2");
var _reduce = require("./internal/_reduce");
var keys = require("./keys");
module.exports = _curry2(function mapObject(fn, obj) {
  return _reduce(function(acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {}, keys(obj));
});
