/* */ 
var $ = require("./$"),
    global = $.g,
    core = $.core,
    isFunction = $.isFunction;
function ctx(fn, that) {
  return function() {
    return fn.apply(that, arguments);
  };
}
global.core = core;
$def.F = 1;
$def.G = 2;
$def.S = 4;
$def.P = 8;
$def.B = 16;
$def.W = 32;
function $def(type, name, source) {
  var key,
      own,
      out,
      exp,
      isGlobal = type & $def.G,
      target = isGlobal ? global : type & $def.S ? global[name] : (global[name] || {}).prototype,
      exports = isGlobal ? core : core[name] || (core[name] = {});
  if (isGlobal)
    source = name;
  for (key in source) {
    own = !(type & $def.F) && target && key in target;
    out = (own ? target : source)[key];
    if (type & $def.B && own)
      exp = ctx(out, global);
    else
      exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
    if (target && !own) {
      if (isGlobal)
        target[key] = out;
      else
        delete target[key] && $.hide(target, key, out);
    }
    if (exports[key] != out)
      $.hide(exports, key, exp);
  }
}
module.exports = $def;
