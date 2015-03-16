/* */ 
var _ap = require("./internal/_ap");
var _curry3 = require("./internal/_curry3");
var _map = require("./internal/_map");
var _reduce = require("./internal/_reduce");
var append = require("./append");
module.exports = _curry3(function commuteMap(fn, of, list) {
  function consF(acc, ftor) {
    return _ap(_map(append, fn(ftor)), acc);
  }
  return _reduce(consF, of([]), list);
});
