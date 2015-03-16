/* */ 
var helpers = require("./helpers"),
    type = require("./type");
var COMMANDS = {};
['$set', '$push', '$unshift', '$apply', '$merge'].forEach(function(c) {
  COMMANDS[c] = true;
});
function makeError(path, message) {
  var e = new Error('baobab.update: ' + message + ' at path /' + path.toString());
  e.path = path;
  return e;
}
function update(target, spec, opts) {
  opts = opts || {};
  var log = {};
  (function mutator(o, spec, path) {
    path = path || [];
    var hash = path.join('λ'),
        fn,
        h,
        k,
        v;
    for (k in spec) {
      if (COMMANDS[k]) {
        v = spec[k];
        log[hash] = true;
        switch (k) {
          case '$push':
            if (!type.Array(o))
              throw makeError(path, 'using command $push to a non array');
            if (!type.Array(v))
              o.push(v);
            else
              o.push.apply(o, v);
            break;
          case '$unshift':
            if (!type.Array(o))
              throw makeError(path, 'using command $unshift to a non array');
            if (!type.Array(v))
              o.unshift(v);
            else
              o.unshift.apply(o, v);
            break;
        }
      } else {
        h = hash ? hash + 'λ' + k : k;
        if ('$unset' in (spec[k] || {})) {
          log[h] = true;
          delete o[k];
        } else if ('$set' in (spec[k] || {})) {
          v = spec[k].$set;
          log[h] = true;
          o[k] = v;
        } else if ('$apply' in (spec[k] || {})) {
          fn = spec[k].$apply;
          if (typeof fn !== 'function')
            throw makeError(path.concat(k), 'using command $apply with a non function');
          log[h] = true;
          o[k] = fn.call(null, o[k]);
        } else if ('$merge' in (spec[k] || {})) {
          v = spec[k].$merge;
          if (!type.Object(o[k]))
            throw makeError(path.concat(k), 'using command $merge on a non-object');
          log[h] = true;
          o[k] = helpers.shallowMerge(o[k], v);
        } else if (opts.shiftReferences && ('$push' in (spec[k] || {}) || '$unshift' in (spec[k] || {}))) {
          if ('$push' in (spec[k] || {})) {
            v = spec[k].$push;
            if (!type.Array(o[k]))
              throw makeError(path.concat(k), 'using command $push to a non array');
            o[k] = o[k].concat(v);
          }
          if ('$unshift' in (spec[k] || {})) {
            v = spec[k].$unshift;
            if (!type.Array(o[k]))
              throw makeError(path.concat(k), 'using command $unshift to a non array');
            o[k] = (v instanceof Array ? v : [v]).concat(o[k]);
          }
          log[h] = true;
        } else {
          if (typeof o[k] === 'undefined')
            o[k] = {};
          if (opts.shiftReferences)
            o[k] = helpers.shallowClone(o[k]);
          mutator(o[k], spec[k], path.concat(k));
        }
      }
    }
  })(target, spec);
  return Object.keys(log).map(function(hash) {
    return hash.split('λ');
  });
}
module.exports = update;
