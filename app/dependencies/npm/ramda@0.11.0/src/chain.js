/* */ 
var _checkForMethod = require("./internal/_checkForMethod");
var _curry2 = require("./internal/_curry2");
var _map = require("./internal/_map");
var unnest = require("./unnest");
module.exports = _curry2(_checkForMethod('chain', function chain(f, list) {
  return unnest(_map(f, list));
}));
