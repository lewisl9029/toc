/* */ 
var isArrayLike = require("../isArrayLike");
module.exports = function _makeFlat(recursive) {
  return function flatt(list) {
    var value,
        result = [],
        idx = -1,
        j,
        ilen = list.length,
        jlen;
    while (++idx < ilen) {
      if (isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = -1;
        jlen = value.length;
        while (++j < jlen) {
          result[result.length] = value[j];
        }
      } else {
        result[result.length] = list[idx];
      }
    }
    return result;
  };
};
