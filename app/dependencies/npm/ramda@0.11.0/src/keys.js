/* */ 
var _contains = require("./internal/_contains");
var _curry1 = require("./internal/_curry1");
var _has = require("./internal/_has");
module.exports = (function() {
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  return _curry1(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    var prop,
        ks = [],
        nIdx;
    for (prop in obj) {
      if (_has(prop, obj)) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length;
      while (nIdx--) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !_contains(prop, ks)) {
          ks[ks.length] = prop;
        }
      }
    }
    return ks;
  });
}());
