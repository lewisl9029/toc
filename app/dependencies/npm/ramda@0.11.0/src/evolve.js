/* */ 
var _curry2 = require("./internal/_curry2");
var _extend = require("./internal/_extend");
var mapObjIndexed = require("./mapObjIndexed");
module.exports = _curry2(function evolve(transformations, object) {
  return _extend(_extend({}, object), mapObjIndexed(function(fn, key) {
    return fn(object[key]);
  }, transformations));
});
