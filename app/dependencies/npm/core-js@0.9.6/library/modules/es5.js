/* */ 
var $ = require("./$"),
    cel = require("./$.dom-create"),
    cof = require("./$.cof"),
    $def = require("./$.def"),
    invoke = require("./$.invoke"),
    arrayMethod = require("./$.array-methods"),
    IE_PROTO = require("./$.uid").safe('__proto__'),
    assert = require("./$.assert"),
    assertObject = assert.obj,
    ObjectProto = Object.prototype,
    A = [],
    slice = A.slice,
    indexOf = A.indexOf,
    classof = cof.classof,
    has = $.has,
    defineProperty = $.setDesc,
    getOwnDescriptor = $.getDesc,
    defineProperties = $.setDescs,
    isFunction = $.isFunction,
    toObject = $.toObject,
    toLength = $.toLength,
    IE8_DOM_DEFINE = false,
    $indexOf = require("./$.array-includes")(false),
    $forEach = arrayMethod(0),
    $map = arrayMethod(1),
    $filter = arrayMethod(2),
    $some = arrayMethod(3),
    $every = arrayMethod(4);
if (!$.DESC) {
  try {
    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x', {get: function() {
        return 8;
      }}).x == 8;
  } catch (e) {}
  $.setDesc = function(O, P, Attributes) {
    if (IE8_DOM_DEFINE)
      try {
        return defineProperty(O, P, Attributes);
      } catch (e) {}
    if ('get' in Attributes || 'set' in Attributes)
      throw TypeError('Accessors not supported!');
    if ('value' in Attributes)
      assertObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P) {
    if (IE8_DOM_DEFINE)
      try {
        return getOwnDescriptor(O, P);
      } catch (e) {}
    if (has(O, P))
      return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties) {
    assertObject(O);
    var keys = $.getKeys(Properties),
        length = keys.length,
        i = 0,
        P;
    while (length > i)
      $.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !$.DESC, 'Object', {
  getOwnPropertyDescriptor: $.getDesc,
  defineProperty: $.setDesc,
  defineProperties: defineProperties
});
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' + 'toLocaleString,toString,valueOf').split(','),
    keys2 = keys1.concat('length', 'prototype'),
    keysLen1 = keys1.length;
var createDict = function() {
  var iframe = cel('iframe'),
      i = keysLen1,
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  $.html.appendChild(iframe);
  iframe.src = 'javascript:';
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--)
    delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length) {
  return function(object) {
    var O = toObject(object),
        i = 0,
        result = [],
        key;
    for (key in O)
      if (key != IE_PROTO)
        has(O, key) && result.push(key);
    while (length > i)
      if (has(O, key = names[i++])) {
        ~indexOf.call(result, key) || result.push(key);
      }
    return result;
  };
}
function isPrimitive(it) {
  return !$.isObject(it);
}
function Empty() {}
$def($def.S, 'Object', {
  getPrototypeOf: $.getProto = $.getProto || function(O) {
    O = Object(assert.def(O));
    if (has(O, IE_PROTO))
      return O[IE_PROTO];
    if (isFunction(O.constructor) && O instanceof O.constructor) {
      return O.constructor.prototype;
    }
    return O instanceof Object ? ObjectProto : null;
  },
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  create: $.create = $.create || function(O, Properties) {
    var result;
    if (O !== null) {
      Empty.prototype = assertObject(O);
      result = new Empty();
      Empty.prototype = null;
      result[IE_PROTO] = O;
    } else
      result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  seal: $.it,
  freeze: $.it,
  preventExtensions: $.it,
  isSealed: isPrimitive,
  isFrozen: isPrimitive,
  isExtensible: $.isObject
});
$def($def.P, 'Function', {bind: function(that) {
    var fn = assert.fn(this),
        partArgs = slice.call(arguments, 1);
    function bound() {
      var args = partArgs.concat(slice.call(arguments));
      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
    }
    if (fn.prototype)
      bound.prototype = fn.prototype;
    return bound;
  }});
function arrayMethodFix(fn) {
  return function() {
    return fn.apply($.ES5Object(this), arguments);
  };
}
if (!(0 in Object('z') && 'z'[0] == 'z')) {
  $.ES5Object = function(it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}
$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  slice: arrayMethodFix(slice),
  join: arrayMethodFix(A.join)
});
$def($def.S, 'Array', {isArray: function(arg) {
    return cof(arg) == 'Array';
  }});
function createArrayReduce(isRight) {
  return function(callbackfn, memo) {
    assert.fn(callbackfn);
    var O = toObject(this),
        length = toLength(O.length),
        index = isRight ? length - 1 : 0,
        i = isRight ? -1 : 1;
    if (arguments.length < 2)
      for (; ; ) {
        if (index in O) {
          memo = O[index];
          index += i;
          break;
        }
        index += i;
        assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
      }
    for (; isRight ? index >= 0 : length > index; index += i)
      if (index in O) {
        memo = callbackfn(memo, O[index], index, this);
      }
    return memo;
  };
}
$def($def.P, 'Array', {
  forEach: $.each = $.each || function forEach(callbackfn) {
    return $forEach(this, callbackfn, arguments[1]);
  },
  map: function map(callbackfn) {
    return $map(this, callbackfn, arguments[1]);
  },
  filter: function filter(callbackfn) {
    return $filter(this, callbackfn, arguments[1]);
  },
  some: function some(callbackfn) {
    return $some(this, callbackfn, arguments[1]);
  },
  every: function every(callbackfn) {
    return $every(this, callbackfn, arguments[1]);
  },
  reduce: createArrayReduce(false),
  reduceRight: createArrayReduce(true),
  indexOf: indexOf = indexOf || function indexOf(el) {
    return $indexOf(this, el, arguments[1]);
  },
  lastIndexOf: function(el, fromIndex) {
    var O = toObject(this),
        length = toLength(O.length),
        index = length - 1;
    if (arguments.length > 1)
      index = Math.min(index, $.toInteger(fromIndex));
    if (index < 0)
      index = toLength(length + index);
    for (; index >= 0; index--)
      if (index in O)
        if (O[index] === el)
          return index;
    return -1;
  }
});
$def($def.P, 'String', {trim: require("./$.replacer")(/^\s*([\s\S]*\S)?\s*$/, '$1')});
$def($def.S, 'Date', {now: function() {
    return +new Date;
  }});
function lz(num) {
  return num > 9 ? num : '0' + num;
}
var date = new Date(-5e13 - 1),
    brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z' && require("./$.throws")(function() {
      new Date(NaN).toISOString();
    }));
$def($def.P + $def.F * brokenDate, 'Date', {toISOString: function() {
    if (!isFinite(this))
      throw RangeError('Invalid time value');
    var d = this,
        y = d.getUTCFullYear(),
        m = d.getUTCMilliseconds(),
        s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }});
if (classof(function() {
  return arguments;
}()) == 'Object')
  cof.classof = function(it) {
    var tag = classof(it);
    return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
  };
