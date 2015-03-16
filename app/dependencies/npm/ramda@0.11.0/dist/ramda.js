/* */ 
"format cjs";
(function(process) {
  ;
  (function() {
    'use strict';
    var __ = {ramda: 'placeholder'};
    var _add = function _add(a, b) {
      return a + b;
    };
    var _all = function _all(fn, list) {
      var idx = -1;
      while (++idx < list.length) {
        if (!fn(list[idx])) {
          return false;
        }
      }
      return true;
    };
    var _any = function _any(fn, list) {
      var idx = -1;
      while (++idx < list.length) {
        if (fn(list[idx])) {
          return true;
        }
      }
      return false;
    };
    var _assoc = function _assoc(prop, val, obj) {
      var result = {};
      for (var p in obj) {
        result[p] = obj[p];
      }
      result[prop] = val;
      return result;
    };
    var _compose = function _compose(f, g) {
      return function() {
        return f.call(this, g.apply(this, arguments));
      };
    };
    var _concat = function _concat(set1, set2) {
      set1 = set1 || [];
      set2 = set2 || [];
      var idx;
      var len1 = set1.length;
      var len2 = set2.length;
      var result = [];
      idx = -1;
      while (++idx < len1) {
        result[result.length] = set1[idx];
      }
      idx = -1;
      while (++idx < len2) {
        result[result.length] = set2[idx];
      }
      return result;
    };
    var _containsWith = function _containsWith(pred, x, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len) {
        if (pred(x, list[idx])) {
          return true;
        }
      }
      return false;
    };
    var _createMaxMinBy = function _createMaxMinBy(comparator) {
      return function(valueComputer, list) {
        if (!(list && list.length > 0)) {
          return ;
        }
        var idx = 0,
            winner = list[idx],
            computedWinner = valueComputer(winner),
            computedCurrent;
        while (++idx < list.length) {
          computedCurrent = valueComputer(list[idx]);
          if (comparator(computedCurrent, computedWinner)) {
            computedWinner = computedCurrent;
            winner = list[idx];
          }
        }
        return winner;
      };
    };
    var _curry1 = function _curry1(fn) {
      return function f1(a) {
        if (arguments.length === 0) {
          return f1;
        } else if (a === __) {
          return f1;
        } else {
          return fn(a);
        }
      };
    };
    var _curry2 = function _curry2(fn) {
      return function f2(a, b) {
        var n = arguments.length;
        if (n === 0) {
          return f2;
        } else if (n === 1 && a === __) {
          return f2;
        } else if (n === 1) {
          return _curry1(function(b) {
            return fn(a, b);
          });
        } else if (n === 2 && a === __ && b === __) {
          return f2;
        } else if (n === 2 && a === __) {
          return _curry1(function(a) {
            return fn(a, b);
          });
        } else if (n === 2 && b === __) {
          return _curry1(function(b) {
            return fn(a, b);
          });
        } else {
          return fn(a, b);
        }
      };
    };
    var _curry3 = function _curry3(fn) {
      return function f3(a, b, c) {
        var n = arguments.length;
        if (n === 0) {
          return f3;
        } else if (n === 1 && a === __) {
          return f3;
        } else if (n === 1) {
          return _curry2(function(b, c) {
            return fn(a, b, c);
          });
        } else if (n === 2 && a === __ && b === __) {
          return f3;
        } else if (n === 2 && a === __) {
          return _curry2(function(a, c) {
            return fn(a, b, c);
          });
        } else if (n === 2 && b === __) {
          return _curry2(function(b, c) {
            return fn(a, b, c);
          });
        } else if (n === 2) {
          return _curry1(function(c) {
            return fn(a, b, c);
          });
        } else if (n === 3 && a === __ && b === __ && c === __) {
          return f3;
        } else if (n === 3 && a === __ && b === __) {
          return _curry2(function(a, b) {
            return fn(a, b, c);
          });
        } else if (n === 3 && a === __ && c === __) {
          return _curry2(function(a, c) {
            return fn(a, b, c);
          });
        } else if (n === 3 && b === __ && c === __) {
          return _curry2(function(b, c) {
            return fn(a, b, c);
          });
        } else if (n === 3 && a === __) {
          return _curry1(function(a) {
            return fn(a, b, c);
          });
        } else if (n === 3 && b === __) {
          return _curry1(function(b) {
            return fn(a, b, c);
          });
        } else if (n === 3 && c === __) {
          return _curry1(function(c) {
            return fn(a, b, c);
          });
        } else {
          return fn(a, b, c);
        }
      };
    };
    var _dissoc = function _dissoc(prop, obj) {
      var result = {};
      for (var p in obj) {
        if (p !== prop) {
          result[p] = obj[p];
        }
      }
      return result;
    };
    var _filter = function _filter(fn, list) {
      var idx = -1,
          len = list.length,
          result = [];
      while (++idx < len) {
        if (fn(list[idx])) {
          result[result.length] = list[idx];
        }
      }
      return result;
    };
    var _filterIndexed = function _filterIndexed(fn, list) {
      var idx = -1,
          len = list.length,
          result = [];
      while (++idx < len) {
        if (fn(list[idx], idx, list)) {
          result[result.length] = list[idx];
        }
      }
      return result;
    };
    var _forEach = function _forEach(fn, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len) {
        fn(list[idx]);
      }
      return list;
    };
    var _functionsWith = function _functionsWith(fn) {
      return function(obj) {
        return _filter(function(key) {
          return typeof obj[key] === 'function';
        }, fn(obj));
      };
    };
    var _gt = function _gt(a, b) {
      return a > b;
    };
    var _has = function _has(prop, obj) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
    var _indexOf = function _indexOf(list, item, from) {
      var idx = 0,
          len = list.length;
      if (typeof from == 'number') {
        idx = from < 0 ? Math.max(0, len + from) : from;
      }
      while (idx < len) {
        if (list[idx] === item) {
          return idx;
        }
        ++idx;
      }
      return -1;
    };
    var _isArray = Array.isArray || function _isArray(val) {
      return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };
    var _isInteger = Number.isInteger || function _isInteger(n) {
      return n << 0 === n;
    };
    var _isThenable = function _isThenable(value) {
      return value != null && value === Object(value) && typeof value.then === 'function';
    };
    var _lastIndexOf = function _lastIndexOf(list, item, from) {
      var idx = list.length;
      if (typeof from == 'number') {
        idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
      }
      while (--idx >= 0) {
        if (list[idx] === item) {
          return idx;
        }
      }
      return -1;
    };
    var _lt = function _lt(a, b) {
      return a < b;
    };
    var _map = function _map(fn, list) {
      var idx = -1,
          len = list.length,
          result = [];
      while (++idx < len) {
        result[idx] = fn(list[idx]);
      }
      return result;
    };
    var _multiply = function _multiply(a, b) {
      return a * b;
    };
    var _nth = function _nth(n, list) {
      return n < 0 ? list[list.length + n] : list[n];
    };
    var _pairWith = function _pairWith(fn) {
      return function(obj) {
        return _map(function(key) {
          return [key, obj[key]];
        }, fn(obj));
      };
    };
    var _path = function _path(paths, obj) {
      if (obj == null || paths.length === 0) {
        return ;
      } else {
        var val = obj;
        for (var idx = 0,
            len = paths.length; idx < len && val != null; idx += 1) {
          val = val[paths[idx]];
        }
        return val;
      }
    };
    var _pickAll = function _pickAll(names, obj) {
      var copy = {};
      _forEach(function(name) {
        copy[name] = obj[name];
      }, names);
      return copy;
    };
    var _prepend = function _prepend(el, list) {
      return _concat([el], list);
    };
    var _reduce = function _reduce(fn, acc, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len) {
        acc = fn(acc, list[idx]);
      }
      return acc;
    };
    var _satisfiesSpec = function _satisfiesSpec(spec, parsedSpec, testObj) {
      if (spec === testObj) {
        return true;
      }
      if (testObj == null) {
        return false;
      }
      parsedSpec.fn = parsedSpec.fn || [];
      parsedSpec.obj = parsedSpec.obj || [];
      var key,
          val,
          idx = -1,
          fnLen = parsedSpec.fn.length,
          j = -1,
          objLen = parsedSpec.obj.length;
      while (++idx < fnLen) {
        key = parsedSpec.fn[idx];
        val = spec[key];
        if (!(key in testObj)) {
          return false;
        }
        if (!val(testObj[key], testObj)) {
          return false;
        }
      }
      while (++j < objLen) {
        key = parsedSpec.obj[j];
        if (spec[key] !== testObj[key]) {
          return false;
        }
      }
      return true;
    };
    var _slice = function _slice(args, from, to) {
      switch (arguments.length) {
        case 1:
          return _slice(args, 0, args.length);
        case 2:
          return _slice(args, from, args.length);
        default:
          var length = Math.max(0, to - from),
              list = [],
              idx = -1;
          while (++idx < length) {
            list[idx] = args[from + idx];
          }
          return list;
      }
    };
    var add = _curry2(_add);
    var all = _curry2(_all);
    var always = _curry1(function always(val) {
      return function() {
        return val;
      };
    });
    var and = _curry2(function and(f, g) {
      return function _and() {
        return f.apply(this, arguments) && g.apply(this, arguments);
      };
    });
    var any = _curry2(_any);
    var apply = _curry2(function apply(fn, args) {
      return fn.apply(this, args);
    });
    var arity = _curry2(function(n, fn) {
      switch (n) {
        case 0:
          return function() {
            return fn.apply(this, arguments);
          };
        case 1:
          return function(a0) {
            void a0;
            return fn.apply(this, arguments);
          };
        case 2:
          return function(a0, a1) {
            void a1;
            return fn.apply(this, arguments);
          };
        case 3:
          return function(a0, a1, a2) {
            void a2;
            return fn.apply(this, arguments);
          };
        case 4:
          return function(a0, a1, a2, a3) {
            void a3;
            return fn.apply(this, arguments);
          };
        case 5:
          return function(a0, a1, a2, a3, a4) {
            void a4;
            return fn.apply(this, arguments);
          };
        case 6:
          return function(a0, a1, a2, a3, a4, a5) {
            void a5;
            return fn.apply(this, arguments);
          };
        case 7:
          return function(a0, a1, a2, a3, a4, a5, a6) {
            void a6;
            return fn.apply(this, arguments);
          };
        case 8:
          return function(a0, a1, a2, a3, a4, a5, a6, a7) {
            void a7;
            return fn.apply(this, arguments);
          };
        case 9:
          return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
            void a8;
            return fn.apply(this, arguments);
          };
        case 10:
          return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            void a9;
            return fn.apply(this, arguments);
          };
        default:
          throw new Error('First argument to arity must be a non-negative integer no greater than ten');
      }
    });
    var assoc = _curry3(_assoc);
    var bind = _curry2(function bind(fn, thisObj) {
      return arity(fn.length, function() {
        return fn.apply(thisObj, arguments);
      });
    });
    var comparator = _curry1(function comparator(pred) {
      return function(a, b) {
        return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
      };
    });
    var cond = function cond() {
      var pairs = arguments;
      return function() {
        var idx = -1;
        while (++idx < pairs.length) {
          if (pairs[idx][0].apply(this, arguments)) {
            return pairs[idx][1].apply(this, arguments);
          }
        }
      };
    };
    var containsWith = _curry3(_containsWith);
    var countBy = _curry2(function countBy(fn, list) {
      var counts = {};
      var len = list.length;
      var idx = -1;
      while (++idx < len) {
        var key = fn(list[idx]);
        counts[key] = (_has(key, counts) ? counts[key] : 0) + 1;
      }
      return counts;
    });
    var createMapEntry = _curry2(function(key, val) {
      var obj = {};
      obj[key] = val;
      return obj;
    });
    var curryN = _curry2(function curryN(length, fn) {
      return arity(length, function() {
        var n = arguments.length;
        var shortfall = length - n;
        var idx = n;
        while (idx--) {
          if (arguments[idx] === __) {
            shortfall += 1;
          }
        }
        if (shortfall <= 0) {
          return fn.apply(this, arguments);
        } else {
          var initialArgs = _slice(arguments);
          return curryN(shortfall, function() {
            var currentArgs = _slice(arguments);
            var combinedArgs = [];
            var idx = -1;
            while (++idx < n) {
              var val = initialArgs[idx];
              combinedArgs[idx] = val === __ ? currentArgs.shift() : val;
            }
            return fn.apply(this, combinedArgs.concat(currentArgs));
          });
        }
      });
    });
    var dec = add(-1);
    var defaultTo = _curry2(function defaultTo(d, v) {
      return v == null ? d : v;
    });
    var differenceWith = _curry3(function differenceWith(pred, first, second) {
      var out = [];
      var idx = -1;
      var firstLen = first.length;
      var containsPred = containsWith(pred);
      while (++idx < firstLen) {
        if (!containsPred(first[idx], second) && !containsPred(first[idx], out)) {
          out[idx] = first[idx];
        }
      }
      return out;
    });
    var dissoc = _curry2(_dissoc);
    var divide = _curry2(function divide(a, b) {
      return a / b;
    });
    var dropWhile = _curry2(function dropWhile(pred, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len && pred(list[idx])) {}
      return _slice(list, idx);
    });
    var eq = _curry2(function eq(a, b) {
      if (a === 0) {
        return 1 / a === 1 / b;
      } else {
        return a === b || a !== a && b !== b;
      }
    });
    var eqProps = _curry3(function eqProps(prop, obj1, obj2) {
      return obj1[prop] === obj2[prop];
    });
    var filterIndexed = _curry2(_filterIndexed);
    var find = _curry2(function find(fn, list) {
      var idx = -1;
      var len = list.length;
      while (++idx < len) {
        if (fn(list[idx])) {
          return list[idx];
        }
      }
    });
    var findIndex = _curry2(function findIndex(fn, list) {
      var idx = -1;
      var len = list.length;
      while (++idx < len) {
        if (fn(list[idx])) {
          return idx;
        }
      }
      return -1;
    });
    var findLast = _curry2(function findLast(fn, list) {
      var idx = list.length;
      while (idx--) {
        if (fn(list[idx])) {
          return list[idx];
        }
      }
    });
    var findLastIndex = _curry2(function findLastIndex(fn, list) {
      var idx = list.length;
      while (idx--) {
        if (fn(list[idx])) {
          return idx;
        }
      }
      return -1;
    });
    var forEach = _curry2(_forEach);
    var forEachIndexed = _curry2(function forEachIndexed(fn, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len) {
        fn(list[idx], idx, list);
      }
      return list;
    });
    var fromPairs = _curry1(function fromPairs(pairs) {
      var idx = -1,
          len = pairs.length,
          out = {};
      while (++idx < len) {
        if (_isArray(pairs[idx]) && pairs[idx].length) {
          out[pairs[idx][0]] = pairs[idx][1];
        }
      }
      return out;
    });
    var gt = _curry2(_gt);
    var gte = _curry2(function gte(a, b) {
      return a >= b;
    });
    var has = _curry2(_has);
    var hasIn = _curry2(function(prop, obj) {
      return prop in obj;
    });
    var identity = _curry1(function identity(x) {
      return x;
    });
    var ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
      return function _ifElse() {
        return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
      };
    });
    var inc = add(1);
    var indexOf = _curry2(function indexOf(target, list) {
      return _indexOf(list, target);
    });
    var insertAll = _curry3(function insertAll(idx, elts, list) {
      idx = idx < list.length && idx >= 0 ? idx : list.length;
      return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
    });
    var is = _curry2(function is(Ctor, val) {
      return val != null && val.constructor === Ctor || val instanceof Ctor;
    });
    var isArrayLike = _curry1(function isArrayLike(x) {
      if (_isArray(x)) {
        return true;
      }
      if (!x) {
        return false;
      }
      if (typeof x !== 'object') {
        return false;
      }
      if (x instanceof String) {
        return false;
      }
      if (x.nodeType === 1) {
        return !!x.length;
      }
      if (x.length === 0) {
        return true;
      }
      if (x.length > 0) {
        return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
      }
      return false;
    });
    var isEmpty = _curry1(function isEmpty(list) {
      return Object(list).length === 0;
    });
    var isNil = _curry1(function isNil(x) {
      return x == null;
    });
    var isSet = _curry1(function isSet(list) {
      var len = list.length;
      var idx = -1;
      while (++idx < len) {
        if (_indexOf(list, list[idx], idx + 1) >= 0) {
          return false;
        }
      }
      return true;
    });
    var keysIn = _curry1(function keysIn(obj) {
      var prop,
          ks = [];
      for (prop in obj) {
        ks[ks.length] = prop;
      }
      return ks;
    });
    var lastIndexOf = _curry2(function lastIndexOf(target, list) {
      return _lastIndexOf(list, target);
    });
    var length = _curry1(function length(list) {
      return list != null && is(Number, list.length) ? list.length : NaN;
    });
    var lens = _curry2(function lens(get, set) {
      var lns = function(a) {
        return get(a);
      };
      lns.set = _curry2(set);
      lns.map = _curry2(function(fn, a) {
        return set(fn(get(a)), a);
      });
      return lns;
    });
    var lensOn = _curry3(function lensOn(get, set, obj) {
      var lns = function() {
        return get(obj);
      };
      lns.set = set;
      lns.map = function(fn) {
        return set(fn(get(obj)));
      };
      return lns;
    });
    var lt = _curry2(_lt);
    var lte = _curry2(function lte(a, b) {
      return a <= b;
    });
    var mapAccum = _curry3(function mapAccum(fn, acc, list) {
      var idx = -1,
          len = list.length,
          result = [],
          tuple = [acc];
      while (++idx < len) {
        tuple = fn(tuple[0], list[idx]);
        result[idx] = tuple[1];
      }
      return [tuple[0], result];
    });
    var mapAccumRight = _curry3(function mapAccumRight(fn, acc, list) {
      var idx = list.length,
          result = [],
          tuple = [acc];
      while (idx--) {
        tuple = fn(tuple[0], list[idx]);
        result[idx] = tuple[1];
      }
      return [tuple[0], result];
    });
    var mapIndexed = _curry2(function mapIndexed(fn, list) {
      var idx = -1,
          len = list.length,
          result = [];
      while (++idx < len) {
        result[idx] = fn(list[idx], idx, list);
      }
      return result;
    });
    var mathMod = _curry2(function mathMod(m, p) {
      if (!_isInteger(m)) {
        return NaN;
      }
      if (!_isInteger(p) || p < 1) {
        return NaN;
      }
      return (m % p + p) % p;
    });
    var maxBy = _curry2(_createMaxMinBy(_gt));
    var memoize = function() {
      var repr = function(x) {
        return x + '::' + Object.prototype.toString.call(x);
      };
      var serialize = function(args) {
        return args.length + ':{' + _map(repr, args).join(',') + '}';
      };
      return _curry1(function memoize(fn) {
        var cache = {};
        return function() {
          var key = serialize(arguments);
          if (!_has(key, cache)) {
            cache[key] = fn.apply(this, arguments);
          }
          return cache[key];
        };
      });
    }();
    var minBy = _curry2(_createMaxMinBy(_lt));
    var modulo = _curry2(function modulo(a, b) {
      return a % b;
    });
    var multiply = _curry2(_multiply);
    var nAry = _curry2(function(n, fn) {
      switch (n) {
        case 0:
          return function() {
            return fn.call(this);
          };
        case 1:
          return function(a0) {
            return fn.call(this, a0);
          };
        case 2:
          return function(a0, a1) {
            return fn.call(this, a0, a1);
          };
        case 3:
          return function(a0, a1, a2) {
            return fn.call(this, a0, a1, a2);
          };
        case 4:
          return function(a0, a1, a2, a3) {
            return fn.call(this, a0, a1, a2, a3);
          };
        case 5:
          return function(a0, a1, a2, a3, a4) {
            return fn.call(this, a0, a1, a2, a3, a4);
          };
        case 6:
          return function(a0, a1, a2, a3, a4, a5) {
            return fn.call(this, a0, a1, a2, a3, a4, a5);
          };
        case 7:
          return function(a0, a1, a2, a3, a4, a5, a6) {
            return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
          };
        case 8:
          return function(a0, a1, a2, a3, a4, a5, a6, a7) {
            return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
          };
        case 9:
          return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
            return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
          };
        case 10:
          return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
          };
        default:
          throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
      }
    });
    var negate = _curry1(function negate(n) {
      return -n;
    });
    var not = _curry1(function not(f) {
      return function() {
        return !f.apply(this, arguments);
      };
    });
    var nth = _curry2(_nth);
    var nthArg = _curry1(function nthArg(n) {
      return function() {
        return _nth(n, arguments);
      };
    });
    var of = _curry1(function of(x) {
      return [x];
    });
    var omit = _curry2(function omit(names, obj) {
      var result = {};
      for (var prop in obj) {
        if (_indexOf(names, prop) < 0) {
          result[prop] = obj[prop];
        }
      }
      return result;
    });
    var once = _curry1(function once(fn) {
      var called = false,
          result;
      return function() {
        if (called) {
          return result;
        }
        called = true;
        result = fn.apply(this, arguments);
        return result;
      };
    });
    var or = _curry2(function or(f, g) {
      return function _or() {
        return f.apply(this, arguments) || g.apply(this, arguments);
      };
    });
    var partition = _curry2(function partition(pred, list) {
      return _reduce(function(acc, elt) {
        var xs = acc[pred(elt) ? 0 : 1];
        xs[xs.length] = elt;
        return acc;
      }, [[], []], list);
    });
    var path = _curry2(_path);
    var pathEq = _curry3(function pathEq(path, val, obj) {
      return _path(path, obj) === val;
    });
    var pick = _curry2(function pick(names, obj) {
      var result = {};
      for (var prop in obj) {
        if (_indexOf(names, prop) >= 0) {
          result[prop] = obj[prop];
        }
      }
      return result;
    });
    var pickAll = _curry2(_pickAll);
    var pickBy = _curry2(function pickBy(test, obj) {
      var result = {};
      for (var prop in obj) {
        if (test(obj[prop], prop, obj)) {
          result[prop] = obj[prop];
        }
      }
      return result;
    });
    var prepend = _curry2(_prepend);
    var prop = _curry2(function prop(p, obj) {
      return obj[p];
    });
    var propEq = _curry3(function propEq(name, val, obj) {
      return obj[name] === val;
    });
    var propOr = _curry3(function propOr(val, p, obj) {
      return _has(p, obj) ? obj[p] : val;
    });
    var props = _curry2(function props(ps, obj) {
      var len = ps.length,
          out = [],
          idx = -1;
      while (++idx < len) {
        out[idx] = obj[ps[idx]];
      }
      return out;
    });
    var range = _curry2(function range(from, to) {
      if (from >= to) {
        return [];
      }
      var idx = 0,
          result = [];
      while (from < to) {
        result[idx] = from++;
        idx += 1;
      }
      return result;
    });
    var reduce = _curry3(_reduce);
    var reduceIndexed = _curry3(function reduceIndexed(fn, acc, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len) {
        acc = fn(acc, list[idx], idx, list);
      }
      return acc;
    });
    var reduceRight = _curry3(function reduceRight(fn, acc, list) {
      var idx = list.length;
      while (idx--) {
        acc = fn(acc, list[idx]);
      }
      return acc;
    });
    var reduceRightIndexed = _curry3(function reduceRightIndexed(fn, acc, list) {
      var idx = list.length;
      while (idx--) {
        acc = fn(acc, list[idx], idx, list);
      }
      return acc;
    });
    var rejectIndexed = _curry2(function rejectIndexed(fn, list) {
      return _filterIndexed(not(fn), list);
    });
    var remove = _curry3(function remove(start, count, list) {
      return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
    });
    var replace = _curry3(function replace(regex, replacement, str) {
      return str.replace(regex, replacement);
    });
    var reverse = _curry1(function reverse(list) {
      return _slice(list).reverse();
    });
    var scan = _curry3(function scan(fn, acc, list) {
      var idx = 0,
          len = list.length + 1,
          result = [acc];
      while (++idx < len) {
        acc = fn(acc, list[idx - 1]);
        result[idx] = acc;
      }
      return result;
    });
    var sortBy = _curry2(function sortBy(fn, list) {
      return _slice(list).sort(function(a, b) {
        var aa = fn(a);
        var bb = fn(b);
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });
    });
    var strIndexOf = _curry2(function strIndexOf(c, str) {
      return str.indexOf(c);
    });
    var strLastIndexOf = _curry2(function(c, str) {
      return str.lastIndexOf(c);
    });
    var subtract = _curry2(function subtract(a, b) {
      return a - b;
    });
    var sum = reduce(_add, 0);
    var tap = _curry2(function tap(fn, x) {
      fn(x);
      return x;
    });
    var times = _curry2(function times(fn, n) {
      var len = Number(n);
      var list = new Array(len);
      var idx = 0;
      while (idx < len) {
        list[idx] = fn(idx);
        idx += 1;
      }
      return list;
    });
    var toPairsIn = _curry1(_pairWith(keysIn));
    var trim = function() {
      var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
      var zeroWidth = '\u200B';
      var hasProtoTrim = typeof String.prototype.trim === 'function';
      if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
        return _curry1(function trim(str) {
          var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
          var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
          return str.replace(beginRx, '').replace(endRx, '');
        });
      } else {
        return _curry1(function trim(str) {
          return str.trim();
        });
      }
    }();
    var type = _curry1(function type(val) {
      return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
    });
    var unapply = _curry1(function unapply(fn) {
      return function() {
        return fn(_slice(arguments));
      };
    });
    var unary = _curry1(function unary(fn) {
      return nAry(1, fn);
    });
    var unfold = _curry2(function unfold(fn, seed) {
      var pair = fn(seed);
      var result = [];
      while (pair && pair.length) {
        result[result.length] = pair[0];
        pair = fn(pair[1]);
      }
      return result;
    });
    var uniqWith = _curry2(function uniqWith(pred, list) {
      var idx = -1,
          len = list.length;
      var result = [],
          item;
      while (++idx < len) {
        item = list[idx];
        if (!_containsWith(pred, item, result)) {
          result[result.length] = item;
        }
      }
      return result;
    });
    var valuesIn = _curry1(function valuesIn(obj) {
      var prop,
          vs = [];
      for (prop in obj) {
        vs[vs.length] = obj[prop];
      }
      return vs;
    });
    var wrap = _curry2(function wrap(fn, wrapper) {
      return curryN(fn.length, function() {
        return wrapper.apply(this, _concat([fn], arguments));
      });
    });
    var xprod = _curry2(function xprod(a, b) {
      var idx = -1;
      var ilen = a.length;
      var j;
      var jlen = b.length;
      var result = [];
      while (++idx < ilen) {
        j = -1;
        while (++j < jlen) {
          result[result.length] = [a[idx], b[j]];
        }
      }
      return result;
    });
    var zip = _curry2(function zip(a, b) {
      var rv = [];
      var idx = -1;
      var len = Math.min(a.length, b.length);
      while (++idx < len) {
        rv[idx] = [a[idx], b[idx]];
      }
      return rv;
    });
    var zipObj = _curry2(function zipObj(keys, values) {
      var idx = -1,
          len = keys.length,
          out = {};
      while (++idx < len) {
        out[keys[idx]] = values[idx];
      }
      return out;
    });
    var zipWith = _curry3(function zipWith(fn, a, b) {
      var rv = [],
          idx = -1,
          len = Math.min(a.length, b.length);
      while (++idx < len) {
        rv[idx] = fn(a[idx], b[idx]);
      }
      return rv;
    });
    var F = always(false);
    var I = identity;
    var T = always(true);
    var _append = function _append(el, list) {
      return _concat(list, [el]);
    };
    var _assocPath = function _assocPath(path, val, obj) {
      switch (path.length) {
        case 0:
          return obj;
        case 1:
          return _assoc(path[0], val, obj);
        default:
          return _assoc(path[0], _assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
      }
    };
    var _baseCopy = function _baseCopy(value, refFrom, refTo) {
      var copy = function copy(copiedValue) {
        var len = refFrom.length;
        var idx = -1;
        while (++idx < len) {
          if (value === refFrom[idx]) {
            return refTo[idx];
          }
        }
        refFrom[idx + 1] = value;
        refTo[idx + 1] = copiedValue;
        for (var key in value) {
          copiedValue[key] = _baseCopy(value[key], refFrom, refTo);
        }
        return copiedValue;
      };
      switch (type(value)) {
        case 'Object':
          return copy({});
        case 'Array':
          return copy([]);
        case 'Date':
          return new Date(value);
        default:
          return value;
      }
    };
    var _checkForMethod = function _checkForMethod(methodname, fn) {
      return function() {
        var length = arguments.length;
        if (length === 0) {
          return fn();
        }
        var obj = arguments[length - 1];
        return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
      };
    };
    var _composeP = function _composeP(f, g) {
      return function() {
        var context = this;
        var value = g.apply(this, arguments);
        if (_isThenable(value)) {
          return value.then(function(result) {
            return f.call(context, result);
          });
        } else {
          return f.call(this, value);
        }
      };
    };
    var _contains = function _contains(a, list) {
      return _indexOf(list, a) >= 0;
    };
    var _createComposer = function _createComposer(composeFunction) {
      return function() {
        var idx = arguments.length - 1;
        var fn = arguments[idx];
        var length = fn.length;
        while (idx--) {
          fn = composeFunction(arguments[idx], fn);
        }
        return arity(length, fn);
      };
    };
    var _createMaxMin = function _createMaxMin(comparator, initialVal) {
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
    var _createPartialApplicator = function _createPartialApplicator(concat) {
      return function(fn) {
        var args = _slice(arguments, 1);
        return arity(Math.max(0, fn.length - args.length), function() {
          return fn.apply(this, concat(args, arguments));
        });
      };
    };
    var _dissocPath = function _dissocPath(path, obj) {
      switch (path.length) {
        case 0:
          return obj;
        case 1:
          return _dissoc(path[0], obj);
        default:
          var head = path[0];
          var tail = _slice(path, 1);
          return obj[head] == null ? obj : _assoc(head, _dissocPath(tail, obj[head]), obj);
      }
    };
    var _hasMethod = function _hasMethod(methodName, obj) {
      return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
    };
    var _makeFlat = function _makeFlat(recursive) {
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
    var _pluck = function _pluck(p, list) {
      return _map(prop(p), list);
    };
    var append = _curry2(_append);
    var assocPath = _curry3(_assocPath);
    var binary = _curry1(function binary(fn) {
      return nAry(2, fn);
    });
    var clone = _curry1(function clone(value) {
      return _baseCopy(value, [], []);
    });
    var compose = _createComposer(_compose);
    var composeP = _createComposer(_composeP);
    var concat = _curry2(function(set1, set2) {
      if (_isArray(set2)) {
        return _concat(set1, set2);
      } else if (_hasMethod('concat', set1)) {
        return set1.concat(set2);
      } else {
        throw new TypeError('can\'t concat ' + typeof set1);
      }
    });
    var contains = _curry2(_contains);
    var converge = curryN(3, function(after) {
      var fns = _slice(arguments, 1);
      return function() {
        var args = arguments;
        return after.apply(this, _map(function(fn) {
          return fn.apply(this, args);
        }, fns));
      };
    });
    var curry = _curry1(function curry(fn) {
      return curryN(fn.length, fn);
    });
    var difference = _curry2(function difference(first, second) {
      var out = [];
      var idx = -1;
      var firstLen = first.length;
      while (++idx < firstLen) {
        if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
          out[out.length] = first[idx];
        }
      }
      return out;
    });
    var dissocPath = _curry2(_dissocPath);
    var drop = _curry2(_checkForMethod('drop', function drop(n, list) {
      return n < list.length ? _slice(list, n) : [];
    }));
    var empty = _curry1(function empty(x) {
      return _hasMethod('empty', x) ? x.empty() : [];
    });
    var filter = _curry2(_checkForMethod('filter', _filter));
    var flatten = _curry1(_makeFlat(true));
    var flip = _curry1(function flip(fn) {
      return curry(function(a, b) {
        var args = _slice(arguments);
        args[0] = b;
        args[1] = a;
        return fn.apply(this, args);
      });
    });
    var func = curry(function func(funcName, obj) {
      return obj[funcName].apply(obj, _slice(arguments, 2));
    });
    var functionsIn = _curry1(_functionsWith(keysIn));
    var get = prop;
    var groupBy = _curry2(function groupBy(fn, list) {
      return _reduce(function(acc, elt) {
        var key = fn(elt);
        acc[key] = _append(elt, acc[key] || (acc[key] = []));
        return acc;
      }, {}, list);
    });
    var head = nth(0);
    var insert = _curry3(function insert(idx, elt, list) {
      idx = idx < list.length && idx >= 0 ? idx : list.length;
      return _concat(_append(elt, _slice(list, 0, idx)), _slice(list, idx));
    });
    var intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
      var results = [],
          idx = -1;
      while (++idx < list1.length) {
        if (_containsWith(pred, list1[idx], list2)) {
          results[results.length] = list1[idx];
        }
      }
      return uniqWith(pred, results);
    });
    var invoker = curry(function invoker(arity, method) {
      var initialArgs = _slice(arguments, 2);
      var len = arity - initialArgs.length;
      return curryN(len + 1, function() {
        var target = arguments[len];
        var args = initialArgs.concat(_slice(arguments, 0, len));
        return target[method].apply(target, args);
      });
    });
    var join = invoker(1, 'join');
    var keys = function() {
      var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
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
    }();
    var last = nth(-1);
    var map = _curry2(_checkForMethod('map', _map));
    var mapObj = _curry2(function mapObject(fn, obj) {
      return _reduce(function(acc, key) {
        acc[key] = fn(obj[key]);
        return acc;
      }, {}, keys(obj));
    });
    var mapObjIndexed = _curry2(function mapObjectIndexed(fn, obj) {
      return _reduce(function(acc, key) {
        acc[key] = fn(obj[key], key, obj);
        return acc;
      }, {}, keys(obj));
    });
    var match = invoker(1, 'match');
    var max = _createMaxMin(_gt, -Infinity);
    var min = _createMaxMin(_lt, Infinity);
    var partial = curry(_createPartialApplicator(_concat));
    var partialRight = curry(_createPartialApplicator(flip(_concat)));
    var pipe = function pipe() {
      return compose.apply(this, reverse(arguments));
    };
    var pipeP = function pipeP() {
      return composeP.apply(this, reverse(arguments));
    };
    var pluck = _curry2(_pluck);
    var prependTo = flip(_prepend);
    var product = reduce(_multiply, 1);
    var propOf = flip(prop);
    var reject = _curry2(function reject(fn, list) {
      return filter(not(fn), list);
    });
    var repeat = _curry2(function repeat(value, n) {
      return times(always(value), n);
    });
    var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, xs) {
      return Array.prototype.slice.call(xs, fromIndex, toIndex);
    }));
    var sort = _curry2(function sort(comparator, list) {
      return clone(list).sort(comparator);
    });
    var split = invoker(1, 'split');
    var substring = invoker(2, 'substring');
    var substringFrom = flip(substring)(void 0);
    var substringTo = substring(0);
    var tail = _checkForMethod('tail', function(list) {
      return _slice(list, 1);
    });
    var take = _curry2(_checkForMethod('take', function(n, list) {
      return _slice(list, 0, Math.min(n, list.length));
    }));
    var takeWhile = _curry2(_checkForMethod('takeWhile', function(fn, list) {
      var idx = -1,
          len = list.length;
      while (++idx < len && fn(list[idx])) {}
      return _slice(list, 0, idx);
    }));
    var toLower = invoker(0, 'toLowerCase');
    var toPairs = _curry1(_pairWith(keys));
    var toUpper = invoker(0, 'toUpperCase');
    var unionWith = _curry3(function unionWith(pred, list1, list2) {
      return uniqWith(pred, _concat(list1, list2));
    });
    var uniq = _curry1(function uniq(list) {
      var idx = -1,
          len = list.length;
      var result = [],
          item;
      while (++idx < len) {
        item = list[idx];
        if (!_contains(item, result)) {
          result[result.length] = item;
        }
      }
      return result;
    });
    var unnest = _curry1(_makeFlat(false));
    var useWith = curry(function useWith(fn) {
      var transformers = _slice(arguments, 1);
      var tlen = transformers.length;
      return curry(arity(tlen, function() {
        var args = [],
            idx = -1;
        while (++idx < tlen) {
          args[idx] = transformers[idx](arguments[idx]);
        }
        return fn.apply(this, args.concat(_slice(arguments, tlen)));
      }));
    });
    var values = _curry1(function values(obj) {
      var props = keys(obj);
      var len = props.length;
      var vals = [];
      var idx = -1;
      while (++idx < len) {
        vals[idx] = obj[props[idx]];
      }
      return vals;
    });
    var where = _curry2(function where(spec, testObj) {
      var parsedSpec = groupBy(function(key) {
        return typeof spec[key] === 'function' ? 'fn' : 'obj';
      }, keys(spec));
      return _satisfiesSpec(spec, parsedSpec, testObj);
    });
    var _ap = function _ap(fns, vs) {
      return _hasMethod('ap', fns) ? fns.ap(vs) : _reduce(function(acc, fn) {
        return _concat(acc, _map(fn, vs));
      }, [], fns);
    };
    var _eqDeep = function _eqDeep(a, b, stackA, stackB) {
      var typeA = type(a);
      if (typeA !== type(b)) {
        return false;
      }
      if (eq(a, b)) {
        return true;
      }
      if (typeA == 'RegExp') {
        return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode;
      }
      if (Object(a) === a) {
        if (typeA === 'Date' && a.getTime() != b.getTime()) {
          return false;
        }
        var keysA = keys(a);
        if (keysA.length !== keys(b).length) {
          return false;
        }
        var idx = stackA.length;
        while (idx--) {
          if (stackA[idx] === a) {
            return stackB[idx] === b;
          }
        }
        stackA[stackA.length] = a;
        stackB[stackB.length] = b;
        idx = keysA.length;
        while (idx--) {
          var key = keysA[idx];
          if (!_has(key, b) || !_eqDeep(b[key], a[key], stackA, stackB)) {
            return false;
          }
        }
        stackA.pop();
        stackB.pop();
        return true;
      }
      return false;
    };
    var _extend = function _extend(destination, other) {
      var props = keys(other),
          idx = -1,
          length = props.length;
      while (++idx < length) {
        destination[props[idx]] = other[props[idx]];
      }
      return destination;
    };
    var _predicateWrap = function _predicateWrap(predPicker) {
      return function(preds) {
        var predIterator = function() {
          var args = arguments;
          return predPicker(function(predicate) {
            return predicate.apply(null, args);
          }, preds);
        };
        return arguments.length > 1 ? predIterator.apply(null, _slice(arguments, 1)) : arity(max(_pluck('length', preds)), predIterator);
      };
    };
    var allPass = curry(_predicateWrap(_all));
    var anyPass = curry(_predicateWrap(_any));
    var ap = _curry2(_ap);
    var appendTo = flip(_append);
    var call = curry(function call(fn) {
      return fn.apply(this, _slice(arguments, 1));
    });
    var chain = _curry2(_checkForMethod('chain', function chain(f, list) {
      return unnest(_map(f, list));
    }));
    var charAt = invoker(1, 'charAt');
    var charCodeAt = invoker(1, 'charCodeAt');
    var commuteMap = _curry3(function commuteMap(fn, of, list) {
      function consF(acc, ftor) {
        return _ap(_map(append, fn(ftor)), acc);
      }
      return _reduce(consF, of([]), list);
    });
    var constructN = _curry2(function constructN(n, Fn) {
      if (n > 10) {
        throw new Error('Constructor with greater than ten arguments');
      }
      if (n === 0) {
        return function() {
          return new Fn();
        };
      }
      return curry(nAry(n, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
        switch (arguments.length) {
          case 1:
            return new Fn($0);
          case 2:
            return new Fn($0, $1);
          case 3:
            return new Fn($0, $1, $2);
          case 4:
            return new Fn($0, $1, $2, $3);
          case 5:
            return new Fn($0, $1, $2, $3, $4);
          case 6:
            return new Fn($0, $1, $2, $3, $4, $5);
          case 7:
            return new Fn($0, $1, $2, $3, $4, $5, $6);
          case 8:
            return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
          case 9:
            return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
          case 10:
            return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
        }
      }));
    });
    var eqDeep = _curry2(function eqDeep(a, b) {
      return _eqDeep(a, b, [], []);
    });
    var evolve = _curry2(function evolve(transformations, object) {
      return _extend(_extend({}, object), mapObjIndexed(function(fn, key) {
        return fn(object[key]);
      }, transformations));
    });
    var functions = _curry1(_functionsWith(keys));
    var init = slice(0, -1);
    var installTo = _curry1(function(obj) {
      return _extend(obj, R);
    });
    var intersection = _curry2(function intersection(list1, list2) {
      return uniq(_filter(flip(_contains)(list1), list2));
    });
    var invert = _curry1(function invert(obj) {
      var props = keys(obj);
      var len = props.length;
      var idx = -1;
      var out = {};
      while (++idx < len) {
        var key = props[idx];
        var val = obj[key];
        var list = _has(val, out) ? out[val] : out[val] = [];
        list[list.length] = key;
      }
      return out;
    });
    var invertObj = _curry1(function invertObj(obj) {
      var props = keys(obj);
      var len = props.length;
      var idx = -1;
      var out = {};
      while (++idx < len) {
        var key = props[idx];
        out[obj[key]] = key;
      }
      return out;
    });
    var liftN = _curry2(function liftN(arity, fn) {
      var lifted = curryN(arity, fn);
      return curryN(arity, function() {
        return _reduce(_ap, map(lifted, arguments[0]), _slice(arguments, 1));
      });
    });
    var merge = _curry2(function merge(a, b) {
      return _extend(_extend({}, a), b);
    });
    var mergeAll = _curry1(function mergeAll(list) {
      return reduce(merge, {}, list);
    });
    var project = useWith(_map, pickAll, identity);
    var union = _curry2(compose(uniq, _concat));
    var commute = commuteMap(map(identity));
    var construct = _curry1(function construct(Fn) {
      return constructN(Fn.length, Fn);
    });
    var lift = _curry1(function lift(fn) {
      return liftN(fn.length, fn);
    });
    var R = {
      F: F,
      I: I,
      T: T,
      __: __,
      add: add,
      all: all,
      allPass: allPass,
      always: always,
      and: and,
      any: any,
      anyPass: anyPass,
      ap: ap,
      append: append,
      appendTo: appendTo,
      apply: apply,
      arity: arity,
      assoc: assoc,
      assocPath: assocPath,
      binary: binary,
      bind: bind,
      call: call,
      chain: chain,
      charAt: charAt,
      charCodeAt: charCodeAt,
      clone: clone,
      commute: commute,
      commuteMap: commuteMap,
      comparator: comparator,
      compose: compose,
      composeP: composeP,
      concat: concat,
      cond: cond,
      construct: construct,
      constructN: constructN,
      contains: contains,
      containsWith: containsWith,
      converge: converge,
      countBy: countBy,
      createMapEntry: createMapEntry,
      curry: curry,
      curryN: curryN,
      dec: dec,
      defaultTo: defaultTo,
      difference: difference,
      differenceWith: differenceWith,
      dissoc: dissoc,
      dissocPath: dissocPath,
      divide: divide,
      drop: drop,
      dropWhile: dropWhile,
      empty: empty,
      eq: eq,
      eqDeep: eqDeep,
      eqProps: eqProps,
      evolve: evolve,
      filter: filter,
      filterIndexed: filterIndexed,
      find: find,
      findIndex: findIndex,
      findLast: findLast,
      findLastIndex: findLastIndex,
      flatten: flatten,
      flip: flip,
      forEach: forEach,
      forEachIndexed: forEachIndexed,
      fromPairs: fromPairs,
      func: func,
      functions: functions,
      functionsIn: functionsIn,
      get: get,
      groupBy: groupBy,
      gt: gt,
      gte: gte,
      has: has,
      hasIn: hasIn,
      head: head,
      identity: identity,
      ifElse: ifElse,
      inc: inc,
      indexOf: indexOf,
      init: init,
      insert: insert,
      insertAll: insertAll,
      installTo: installTo,
      intersection: intersection,
      intersectionWith: intersectionWith,
      invert: invert,
      invertObj: invertObj,
      invoker: invoker,
      is: is,
      isArrayLike: isArrayLike,
      isEmpty: isEmpty,
      isNil: isNil,
      isSet: isSet,
      join: join,
      keys: keys,
      keysIn: keysIn,
      last: last,
      lastIndexOf: lastIndexOf,
      length: length,
      lens: lens,
      lensOn: lensOn,
      lift: lift,
      liftN: liftN,
      lt: lt,
      lte: lte,
      map: map,
      mapAccum: mapAccum,
      mapAccumRight: mapAccumRight,
      mapIndexed: mapIndexed,
      mapObj: mapObj,
      mapObjIndexed: mapObjIndexed,
      match: match,
      mathMod: mathMod,
      max: max,
      maxBy: maxBy,
      memoize: memoize,
      merge: merge,
      mergeAll: mergeAll,
      min: min,
      minBy: minBy,
      modulo: modulo,
      multiply: multiply,
      nAry: nAry,
      negate: negate,
      not: not,
      nth: nth,
      nthArg: nthArg,
      of: of,
      omit: omit,
      once: once,
      or: or,
      partial: partial,
      partialRight: partialRight,
      partition: partition,
      path: path,
      pathEq: pathEq,
      pick: pick,
      pickAll: pickAll,
      pickBy: pickBy,
      pipe: pipe,
      pipeP: pipeP,
      pluck: pluck,
      prepend: prepend,
      prependTo: prependTo,
      product: product,
      project: project,
      prop: prop,
      propEq: propEq,
      propOf: propOf,
      propOr: propOr,
      props: props,
      range: range,
      reduce: reduce,
      reduceIndexed: reduceIndexed,
      reduceRight: reduceRight,
      reduceRightIndexed: reduceRightIndexed,
      reject: reject,
      rejectIndexed: rejectIndexed,
      remove: remove,
      repeat: repeat,
      replace: replace,
      reverse: reverse,
      scan: scan,
      slice: slice,
      sort: sort,
      sortBy: sortBy,
      split: split,
      strIndexOf: strIndexOf,
      strLastIndexOf: strLastIndexOf,
      substring: substring,
      substringFrom: substringFrom,
      substringTo: substringTo,
      subtract: subtract,
      sum: sum,
      tail: tail,
      take: take,
      takeWhile: takeWhile,
      tap: tap,
      times: times,
      toLower: toLower,
      toPairs: toPairs,
      toPairsIn: toPairsIn,
      toUpper: toUpper,
      trim: trim,
      type: type,
      unapply: unapply,
      unary: unary,
      unfold: unfold,
      union: union,
      unionWith: unionWith,
      uniq: uniq,
      uniqWith: uniqWith,
      unnest: unnest,
      useWith: useWith,
      values: values,
      valuesIn: valuesIn,
      where: where,
      wrap: wrap,
      xprod: xprod,
      zip: zip,
      zipObj: zipObj,
      zipWith: zipWith
    };
    if (typeof exports === 'object') {
      module.exports = R;
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return R;
      });
    } else {
      this.R = R;
    }
  }.call(this));
})(require("process"));
