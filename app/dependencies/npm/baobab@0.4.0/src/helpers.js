/* */ 
var type = require("./type");
function arrayOf(o) {
  return Array.prototype.slice.call(o);
}
function shallowMerge(o1, o2) {
  var o = {},
      k;
  for (k in o1)
    o[k] = o1[k];
  for (k in o2)
    o[k] = o2[k];
  return o;
}
function cloneRegexp(re) {
  var pattern = re.source,
      flags = '';
  if (re.global)
    flags += 'g';
  if (re.multiline)
    flags += 'm';
  if (re.ignoreCase)
    flags += 'i';
  if (re.sticky)
    flags += 'y';
  if (re.unicode)
    flags += 'u';
  return new RegExp(pattern, flags);
}
function clone(deep, item) {
  if (!item || typeof item !== 'object' || item instanceof Error || item instanceof ArrayBuffer)
    return item;
  if (type.Array(item)) {
    if (deep) {
      var i,
          l,
          a = [];
      for (i = 0, l = item.length; i < l; i++)
        a.push(deepClone(item[i]));
      return a;
    } else {
      return item.slice(0);
    }
  }
  if (type.Date(item))
    return new Date(item.getTime());
  if (item instanceof RegExp)
    return cloneRegexp(item);
  if (type.Object(item)) {
    var k,
        o = {};
    if (item.constructor && item.constructor !== Object)
      o = Object.create(item.constructor.prototype);
    for (k in item)
      if (item.hasOwnProperty(k))
        o[k] = deep ? deepClone(item[k]) : item[k];
    return o;
  }
  return item;
}
var shallowClone = clone.bind(null, false),
    deepClone = clone.bind(null, true);
function compose(fn1, fn2) {
  return function(arg) {
    return fn2(fn1(arg));
  };
}
function first(a, fn) {
  var i,
      l;
  for (i = 0, l = a.length; i < l; i++) {
    if (fn(a[i]))
      return a[i];
  }
  return ;
}
function index(a, fn) {
  var i,
      l;
  for (i = 0, l = a.length; i < l; i++) {
    if (fn(a[i]))
      return i;
  }
  return -1;
}
function compare(object, spec) {
  var ok = true,
      k;
  for (k in spec) {
    if (type.Object(spec[k])) {
      ok = ok && compare(object[k]);
    } else if (type.Array(spec[k])) {
      ok = ok && !!~spec[k].indexOf(object[k]);
    } else {
      if (object[k] !== spec[k])
        return false;
    }
  }
  return ok;
}
function firstByComparison(object, spec) {
  return first(object, function(e) {
    return compare(e, spec);
  });
}
function indexByComparison(object, spec) {
  return index(object, function(e) {
    return compare(e, spec);
  });
}
function getIn(object, path) {
  path = path || [];
  var c = object,
      i,
      l;
  for (i = 0, l = path.length; i < l; i++) {
    if (!c)
      return ;
    if (typeof path[i] === 'function') {
      if (!type.Array(c))
        return ;
      c = first(c, path[i]);
    } else if (typeof path[i] === 'object') {
      if (!type.Array(c))
        return ;
      c = firstByComparison(c, path[i]);
    } else {
      c = c[path[i]];
    }
  }
  return c;
}
function solvePath(object, path) {
  var solvedPath = [],
      c = object,
      idx,
      i,
      l;
  for (i = 0, l = path.length; i < l; i++) {
    if (!c)
      return null;
    if (typeof path[i] === 'function') {
      if (!type.Array(c))
        return ;
      idx = index(c, path[i]);
      solvedPath.push(idx);
      c = c[idx];
    } else if (typeof path[i] === 'object') {
      if (!type.Array(c))
        return ;
      idx = indexByComparison(c, path[i]);
      solvedPath.push(idx);
      c = c[idx];
    } else {
      solvedPath.push(path[i]);
      c = c[path[i]];
    }
  }
  return solvedPath;
}
function pathObject(path, spec) {
  var l = path.length,
      o = {},
      c = o,
      i;
  if (!l)
    o = spec;
  for (i = 0; i < l; i++) {
    c[path[i]] = (i + 1 === l) ? spec : {};
    c = c[path[i]];
  }
  return o;
}
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  var TempCtor = function() {};
  TempCtor.prototype = superCtor.prototype;
  ctor.prototype = new TempCtor();
  ctor.prototype.constructor = ctor;
}
module.exports = {
  arrayOf: arrayOf,
  deepClone: deepClone,
  shallowClone: shallowClone,
  shallowMerge: shallowMerge,
  compose: compose,
  getIn: getIn,
  inherits: inherits,
  pathObject: pathObject,
  solvePath: solvePath
};
