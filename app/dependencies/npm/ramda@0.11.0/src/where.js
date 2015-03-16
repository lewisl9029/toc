/* */ 
var _curry2 = require("./internal/_curry2");
var _satisfiesSpec = require("./internal/_satisfiesSpec");
var groupBy = require("./groupBy");
var keys = require("./keys");
module.exports = _curry2(function where(spec, testObj) {
  var parsedSpec = groupBy(function(key) {
    return typeof spec[key] === 'function' ? 'fn' : 'obj';
  }, keys(spec));
  return _satisfiesSpec(spec, parsedSpec, testObj);
});
