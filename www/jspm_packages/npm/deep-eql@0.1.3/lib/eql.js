/* */ 
(function(Buffer) {
  var type = require("type-detect");
  var Buffer;
  try {
    Buffer = require("buffer").Buffer;
  } catch (ex) {
    Buffer = {};
    Buffer.isBuffer = function() {
      return false;
    };
  }
  module.exports = deepEqual;
  function deepEqual(a, b, m) {
    if (sameValue(a, b)) {
      return true;
    } else if ('date' === type(a)) {
      return dateEqual(a, b);
    } else if ('regexp' === type(a)) {
      return regexpEqual(a, b);
    } else if (Buffer.isBuffer(a)) {
      return bufferEqual(a, b);
    } else if ('arguments' === type(a)) {
      return argumentsEqual(a, b, m);
    } else if (!typeEqual(a, b)) {
      return false;
    } else if (('object' !== type(a) && 'object' !== type(b)) && ('array' !== type(a) && 'array' !== type(b))) {
      return sameValue(a, b);
    } else {
      return objectEqual(a, b, m);
    }
  }
  function sameValue(a, b) {
    if (a === b)
      return a !== 0 || 1 / a === 1 / b;
    return a !== a && b !== b;
  }
  function typeEqual(a, b) {
    return type(a) === type(b);
  }
  function dateEqual(a, b) {
    if ('date' !== type(b))
      return false;
    return sameValue(a.getTime(), b.getTime());
  }
  function regexpEqual(a, b) {
    if ('regexp' !== type(b))
      return false;
    return sameValue(a.toString(), b.toString());
  }
  function argumentsEqual(a, b, m) {
    if ('arguments' !== type(b))
      return false;
    a = [].slice.call(a);
    b = [].slice.call(b);
    return deepEqual(a, b, m);
  }
  function enumerable(a) {
    var res = [];
    for (var key in a)
      res.push(key);
    return res;
  }
  function iterableEqual(a, b) {
    if (a.length !== b.length)
      return false;
    var i = 0;
    var match = true;
    for (; i < a.length; i++) {
      if (a[i] !== b[i]) {
        match = false;
        break;
      }
    }
    return match;
  }
  function bufferEqual(a, b) {
    if (!Buffer.isBuffer(b))
      return false;
    return iterableEqual(a, b);
  }
  function isValue(a) {
    return a !== null && a !== undefined;
  }
  function objectEqual(a, b, m) {
    if (!isValue(a) || !isValue(b)) {
      return false;
    }
    if (a.prototype !== b.prototype) {
      return false;
    }
    var i;
    if (m) {
      for (i = 0; i < m.length; i++) {
        if ((m[i][0] === a && m[i][1] === b) || (m[i][0] === b && m[i][1] === a)) {
          return true;
        }
      }
    } else {
      m = [];
    }
    try {
      var ka = enumerable(a);
      var kb = enumerable(b);
    } catch (ex) {
      return false;
    }
    ka.sort();
    kb.sort();
    if (!iterableEqual(ka, kb)) {
      return false;
    }
    m.push([a, b]);
    var key;
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!deepEqual(a[key], b[key], m)) {
        return false;
      }
    }
    return true;
  }
})(require("buffer").Buffer);
