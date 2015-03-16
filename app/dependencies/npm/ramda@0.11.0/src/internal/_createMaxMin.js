/* */ 
var _curry1 = require("./_curry1");
module.exports = function _createMaxMin(comparator, initialVal) {
  return _curry1(function(list) {
    var idx = -1,
        winner = initialVal,
        computed;
    while (++idx < list.length) {
      computed = +list[idx];
      if (comparator(computed, winner)) {
        winner = computed;
      }
    }
    return winner;
  });
};
