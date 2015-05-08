/* */ 
var helpers = require("./helpers"),
    type = require("./type");
function makeError(path, message) {
  var e = new Error('baobab.update: ' + message + ' at path /' + path.slice(1).join('/'));
  e.path = path;
  return e;
}
module.exports = function(data, spec, opts) {
  opts = opts || {};
  var log = {};
  data = {root: helpers.shallowClone(data)};
  var mutator = function(o, spec, path, parent) {
    path = path || ['root'];
    var hash = path.join('|λ|'),
        lastKey = path[path.length - 1],
        oldValue = o[lastKey],
        fn,
        k,
        v,
        i,
        l;
    if (type.Primitive(o[lastKey]))
      o[lastKey] = {};
    else
      o[lastKey] = helpers.shallowClone(o[lastKey]);
    var leafLevel = Object.keys(spec).some(function(k) {
      return k.charAt(0) === '$';
    });
    if (leafLevel) {
      log[hash] = true;
      for (k in spec) {
        if (k === '$unset') {
          var olderKey = path[path.length - 2];
          if (!type.Object(parent[olderKey]))
            throw makeError(path.slice(0, -1), 'using command $unset on a non-object');
          parent[olderKey] = helpers.shallowClone(o);
          delete parent[olderKey][lastKey];
          break;
        }
        if (k === '$set') {
          v = spec.$set;
          o[lastKey] = v;
        } else if (k === '$apply' || k === '$chain') {
          fn = spec.$apply || spec.$chain;
          if (typeof fn !== 'function')
            throw makeError(path, 'using command $apply with a non function');
          o[lastKey] = fn.call(null, oldValue);
        } else if (k === '$merge') {
          v = spec.$merge;
          if (!type.Object(o[lastKey]) || !type.Object(v))
            throw makeError(path, 'using command $merge with a non object');
          o[lastKey] = helpers.shallowMerge(o[lastKey], v);
        }
        if (k === '$splice') {
          v = spec.$splice;
          if (!type.Array(o[lastKey]))
            throw makeError(path, 'using command $push to a non array');
          for (i = 0, l = v.length; i < l; i++)
            o[lastKey] = helpers.splice.apply(null, [o[lastKey]].concat(v[i]));
        }
        if (k === '$push') {
          v = spec.$push;
          if (!type.Array(o[lastKey]))
            throw makeError(path, 'using command $push to a non array');
          o[lastKey] = o[lastKey].concat(v);
        }
        if (k === '$unshift') {
          v = spec.$unshift;
          if (!type.Array(o[lastKey]))
            throw makeError(path, 'using command $unshift to a non array');
          o[lastKey] = [].concat(v).concat(o[lastKey]);
        }
      }
    } else {
      for (k in spec) {
        mutator(o[lastKey], spec[k], path.concat(k), o);
      }
    }
  };
  mutator(data, spec);
  return {
    data: data.root,
    log: Object.keys(log).map(function(hash) {
      return hash.split('|λ|').slice(1);
    })
  };
};
