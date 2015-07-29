/* */ 
(function(process) {
  (function(window, document, undefined) {
    'use strict';
    function minErr(module, ErrorConstructor) {
      ErrorConstructor = ErrorConstructor || Error;
      return function() {
        var code = arguments[0],
            prefix = '[' + (module ? module + ':' : '') + code + '] ',
            template = arguments[1],
            templateArgs = arguments,
            message,
            i;
        message = prefix + template.replace(/\{\d+\}/g, function(match) {
          var index = +match.slice(1, -1),
              arg;
          if (index + 2 < templateArgs.length) {
            return toDebugString(templateArgs[index + 2]);
          }
          return match;
        });
        message = message + '\nhttp://errors.angularjs.org/1.3.6/' + (module ? module + '/' : '') + code;
        for (i = 2; i < arguments.length; i++) {
          message = message + (i == 2 ? '?' : '&') + 'p' + (i - 2) + '=' + encodeURIComponent(toDebugString(arguments[i]));
        }
        return new ErrorConstructor(message);
      };
    }
    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;
    var VALIDITY_STATE_PROPERTY = 'validity';
    var lowercase = function(string) {
      return isString(string) ? string.toLowerCase() : string;
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var uppercase = function(string) {
      return isString(string) ? string.toUpperCase() : string;
    };
    var manualLowercase = function(s) {
      return isString(s) ? s.replace(/[A-Z]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) | 32);
      }) : s;
    };
    var manualUppercase = function(s) {
      return isString(s) ? s.replace(/[a-z]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) & ~32);
      }) : s;
    };
    if ('i' !== 'I'.toLowerCase()) {
      lowercase = manualLowercase;
      uppercase = manualUppercase;
    }
    var msie,
        jqLite,
        jQuery,
        slice = [].slice,
        splice = [].splice,
        push = [].push,
        toString = Object.prototype.toString,
        ngMinErr = minErr('ng'),
        angular = window.angular || (window.angular = {}),
        angularModule,
        uid = 0;
    msie = document.documentMode;
    function isArrayLike(obj) {
      if (obj == null || isWindow(obj)) {
        return false;
      }
      var length = obj.length;
      if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
        return true;
      }
      return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
    function forEach(obj, iterator, context) {
      var key,
          length;
      if (obj) {
        if (isFunction(obj)) {
          for (key in obj) {
            if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else if (isArray(obj) || isArrayLike(obj)) {
          var isPrimitive = typeof obj !== 'object';
          for (key = 0, length = obj.length; key < length; key++) {
            if (isPrimitive || key in obj) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context, obj);
        } else {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        }
      }
      return obj;
    }
    function sortedKeys(obj) {
      return Object.keys(obj).sort();
    }
    function forEachSorted(obj, iterator, context) {
      var keys = sortedKeys(obj);
      for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
      }
      return keys;
    }
    function reverseParams(iteratorFn) {
      return function(value, key) {
        iteratorFn(key, value);
      };
    }
    function nextUid() {
      return ++uid;
    }
    function setHashKey(obj, h) {
      if (h) {
        obj.$$hashKey = h;
      } else {
        delete obj.$$hashKey;
      }
    }
    function extend(dst) {
      var h = dst.$$hashKey;
      for (var i = 1,
          ii = arguments.length; i < ii; i++) {
        var obj = arguments[i];
        if (obj) {
          var keys = Object.keys(obj);
          for (var j = 0,
              jj = keys.length; j < jj; j++) {
            var key = keys[j];
            dst[key] = obj[key];
          }
        }
      }
      setHashKey(dst, h);
      return dst;
    }
    function int(str) {
      return parseInt(str, 10);
    }
    function inherit(parent, extra) {
      return extend(Object.create(parent), extra);
    }
    function noop() {}
    noop.$inject = [];
    function identity($) {
      return $;
    }
    identity.$inject = [];
    function valueFn(value) {
      return function() {
        return value;
      };
    }
    function isUndefined(value) {
      return typeof value === 'undefined';
    }
    function isDefined(value) {
      return typeof value !== 'undefined';
    }
    function isObject(value) {
      return value !== null && typeof value === 'object';
    }
    function isString(value) {
      return typeof value === 'string';
    }
    function isNumber(value) {
      return typeof value === 'number';
    }
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    var isArray = Array.isArray;
    function isFunction(value) {
      return typeof value === 'function';
    }
    function isRegExp(value) {
      return toString.call(value) === '[object RegExp]';
    }
    function isWindow(obj) {
      return obj && obj.window === obj;
    }
    function isScope(obj) {
      return obj && obj.$evalAsync && obj.$watch;
    }
    function isFile(obj) {
      return toString.call(obj) === '[object File]';
    }
    function isBlob(obj) {
      return toString.call(obj) === '[object Blob]';
    }
    function isBoolean(value) {
      return typeof value === 'boolean';
    }
    function isPromiseLike(obj) {
      return obj && isFunction(obj.then);
    }
    var trim = function(value) {
      return isString(value) ? value.trim() : value;
    };
    var escapeForRegexp = function(s) {
      return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
    };
    function isElement(node) {
      return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
    }
    function makeMap(str) {
      var obj = {},
          items = str.split(","),
          i;
      for (i = 0; i < items.length; i++)
        obj[items[i]] = true;
      return obj;
    }
    function nodeName_(element) {
      return lowercase(element.nodeName || (element[0] && element[0].nodeName));
    }
    function includes(array, obj) {
      return Array.prototype.indexOf.call(array, obj) != -1;
    }
    function arrayRemove(array, value) {
      var index = array.indexOf(value);
      if (index >= 0)
        array.splice(index, 1);
      return value;
    }
    function copy(source, destination, stackSource, stackDest) {
      if (isWindow(source) || isScope(source)) {
        throw ngMinErr('cpws', "Can't copy! Making copies of Window or Scope instances is not supported.");
      }
      if (!destination) {
        destination = source;
        if (source) {
          if (isArray(source)) {
            destination = copy(source, [], stackSource, stackDest);
          } else if (isDate(source)) {
            destination = new Date(source.getTime());
          } else if (isRegExp(source)) {
            destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
            destination.lastIndex = source.lastIndex;
          } else if (isObject(source)) {
            var emptyObject = Object.create(Object.getPrototypeOf(source));
            destination = copy(source, emptyObject, stackSource, stackDest);
          }
        }
      } else {
        if (source === destination)
          throw ngMinErr('cpi', "Can't copy! Source and destination are identical.");
        stackSource = stackSource || [];
        stackDest = stackDest || [];
        if (isObject(source)) {
          var index = stackSource.indexOf(source);
          if (index !== -1)
            return stackDest[index];
          stackSource.push(source);
          stackDest.push(destination);
        }
        var result;
        if (isArray(source)) {
          destination.length = 0;
          for (var i = 0; i < source.length; i++) {
            result = copy(source[i], null, stackSource, stackDest);
            if (isObject(source[i])) {
              stackSource.push(source[i]);
              stackDest.push(result);
            }
            destination.push(result);
          }
        } else {
          var h = destination.$$hashKey;
          if (isArray(destination)) {
            destination.length = 0;
          } else {
            forEach(destination, function(value, key) {
              delete destination[key];
            });
          }
          for (var key in source) {
            if (source.hasOwnProperty(key)) {
              result = copy(source[key], null, stackSource, stackDest);
              if (isObject(source[key])) {
                stackSource.push(source[key]);
                stackDest.push(result);
              }
              destination[key] = result;
            }
          }
          setHashKey(destination, h);
        }
      }
      return destination;
    }
    function shallowCopy(src, dst) {
      if (isArray(src)) {
        dst = dst || [];
        for (var i = 0,
            ii = src.length; i < ii; i++) {
          dst[i] = src[i];
        }
      } else if (isObject(src)) {
        dst = dst || {};
        for (var key in src) {
          if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
            dst[key] = src[key];
          }
        }
      }
      return dst || src;
    }
    function equals(o1, o2) {
      if (o1 === o2)
        return true;
      if (o1 === null || o2 === null)
        return false;
      if (o1 !== o1 && o2 !== o2)
        return true;
      var t1 = typeof o1,
          t2 = typeof o2,
          length,
          key,
          keySet;
      if (t1 == t2) {
        if (t1 == 'object') {
          if (isArray(o1)) {
            if (!isArray(o2))
              return false;
            if ((length = o1.length) == o2.length) {
              for (key = 0; key < length; key++) {
                if (!equals(o1[key], o2[key]))
                  return false;
              }
              return true;
            }
          } else if (isDate(o1)) {
            if (!isDate(o2))
              return false;
            return equals(o1.getTime(), o2.getTime());
          } else if (isRegExp(o1) && isRegExp(o2)) {
            return o1.toString() == o2.toString();
          } else {
            if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2))
              return false;
            keySet = {};
            for (key in o1) {
              if (key.charAt(0) === '$' || isFunction(o1[key]))
                continue;
              if (!equals(o1[key], o2[key]))
                return false;
              keySet[key] = true;
            }
            for (key in o2) {
              if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
                return false;
            }
            return true;
          }
        }
      }
      return false;
    }
    var csp = function() {
      if (isDefined(csp.isActive_))
        return csp.isActive_;
      var active = !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
      if (!active) {
        try {
          new Function('');
        } catch (e) {
          active = true;
        }
      }
      return (csp.isActive_ = active);
    };
    function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
      return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
      var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
      if (isFunction(fn) && !(fn instanceof RegExp)) {
        return curryArgs.length ? function() {
          return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs);
        } : function() {
          return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
      } else {
        return fn;
      }
    }
    function toJsonReplacer(key, value) {
      var val = value;
      if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
        val = undefined;
      } else if (isWindow(value)) {
        val = '$WINDOW';
      } else if (value && document === value) {
        val = '$DOCUMENT';
      } else if (isScope(value)) {
        val = '$SCOPE';
      }
      return val;
    }
    function toJson(obj, pretty) {
      if (typeof obj === 'undefined')
        return undefined;
      if (!isNumber(pretty)) {
        pretty = pretty ? 2 : null;
      }
      return JSON.stringify(obj, toJsonReplacer, pretty);
    }
    function fromJson(json) {
      return isString(json) ? JSON.parse(json) : json;
    }
    function startingTag(element) {
      element = jqLite(element).clone();
      try {
        element.empty();
      } catch (e) {}
      var elemHtml = jqLite('<div>').append(element).html();
      try {
        return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
          return '<' + lowercase(nodeName);
        });
      } catch (e) {
        return lowercase(elemHtml);
      }
    }
    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {}
    }
    function parseKeyValue(keyValue) {
      var obj = {},
          key_value,
          key;
      forEach((keyValue || "").split('&'), function(keyValue) {
        if (keyValue) {
          key_value = keyValue.replace(/\+/g, '%20').split('=');
          key = tryDecodeURIComponent(key_value[0]);
          if (isDefined(key)) {
            var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
            if (!hasOwnProperty.call(obj, key)) {
              obj[key] = val;
            } else if (isArray(obj[key])) {
              obj[key].push(val);
            } else {
              obj[key] = [obj[key], val];
            }
          }
        }
      });
      return obj;
    }
    function toKeyValue(obj) {
      var parts = [];
      forEach(obj, function(value, key) {
        if (isArray(value)) {
          forEach(value, function(arrayValue) {
            parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
          });
        } else {
          parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
        }
      });
      return parts.length ? parts.join('&') : '';
    }
    function encodeUriSegment(val) {
      return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }
    var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];
    function getNgAttribute(element, ngAttr) {
      var attr,
          i,
          ii = ngAttrPrefixes.length;
      element = jqLite(element);
      for (i = 0; i < ii; ++i) {
        attr = ngAttrPrefixes[i] + ngAttr;
        if (isString(attr = element.attr(attr))) {
          return attr;
        }
      }
      return null;
    }
    function angularInit(element, bootstrap) {
      var appElement,
          module,
          config = {};
      forEach(ngAttrPrefixes, function(prefix) {
        var name = prefix + 'app';
        if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
          appElement = element;
          module = element.getAttribute(name);
        }
      });
      forEach(ngAttrPrefixes, function(prefix) {
        var name = prefix + 'app';
        var candidate;
        if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
          appElement = candidate;
          module = candidate.getAttribute(name);
        }
      });
      if (appElement) {
        config.strictDi = getNgAttribute(appElement, "strict-di") !== null;
        bootstrap(appElement, module ? [module] : [], config);
      }
    }
    function bootstrap(element, modules, config) {
      if (!isObject(config))
        config = {};
      var defaultConfig = {strictDi: false};
      config = extend(defaultConfig, config);
      var doBootstrap = function() {
        element = jqLite(element);
        if (element.injector()) {
          var tag = (element[0] === document) ? 'document' : startingTag(element);
          throw ngMinErr('btstrpd', "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, '&lt;').replace(/>/, '&gt;'));
        }
        modules = modules || [];
        modules.unshift(['$provide', function($provide) {
          $provide.value('$rootElement', element);
        }]);
        if (config.debugInfoEnabled) {
          modules.push(['$compileProvider', function($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
          }]);
        }
        modules.unshift('ng');
        var injector = createInjector(modules, config.strictDi);
        injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector', function bootstrapApply(scope, element, compile, injector) {
          scope.$apply(function() {
            element.data('$injector', injector);
            compile(element)(scope);
          });
        }]);
        return injector;
      };
      var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
      var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
      if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
        config.debugInfoEnabled = true;
        window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
      }
      if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
        return doBootstrap();
      }
      window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
      angular.resumeBootstrap = function(extraModules) {
        forEach(extraModules, function(module) {
          modules.push(module);
        });
        doBootstrap();
      };
    }
    function reloadWithDebugInfo() {
      window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
      window.location.reload();
    }
    function getTestability(rootElement) {
      return angular.element(rootElement).injector().get('$$testability');
    }
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
      separator = separator || '_';
      return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
      });
    }
    var bindJQueryFired = false;
    var skipDestroyOnNextJQueryCleanData;
    function bindJQuery() {
      var originalCleanData;
      if (bindJQueryFired) {
        return;
      }
      jQuery = window.jQuery;
      if (jQuery && jQuery.fn.on) {
        jqLite = jQuery;
        extend(jQuery.fn, {
          scope: JQLitePrototype.scope,
          isolateScope: JQLitePrototype.isolateScope,
          controller: JQLitePrototype.controller,
          injector: JQLitePrototype.injector,
          inheritedData: JQLitePrototype.inheritedData
        });
        originalCleanData = jQuery.cleanData;
        jQuery.cleanData = function(elems) {
          var events;
          if (!skipDestroyOnNextJQueryCleanData) {
            for (var i = 0,
                elem; (elem = elems[i]) != null; i++) {
              events = jQuery._data(elem, "events");
              if (events && events.$destroy) {
                jQuery(elem).triggerHandler('$destroy');
              }
            }
          } else {
            skipDestroyOnNextJQueryCleanData = false;
          }
          originalCleanData(elems);
        };
      } else {
        jqLite = JQLite;
      }
      angular.element = jqLite;
      bindJQueryFired = true;
    }
    function assertArg(arg, name, reason) {
      if (!arg) {
        throw ngMinErr('areq', "Argument '{0}' is {1}", (name || '?'), (reason || "required"));
      }
      return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
      if (acceptArrayAnnotation && isArray(arg)) {
        arg = arg[arg.length - 1];
      }
      assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
      return arg;
    }
    function assertNotHasOwnProperty(name, context) {
      if (name === 'hasOwnProperty') {
        throw ngMinErr('badname', "hasOwnProperty is not a valid {0} name", context);
      }
    }
    function getter(obj, path, bindFnToScope) {
      if (!path)
        return obj;
      var keys = path.split('.');
      var key;
      var lastInstance = obj;
      var len = keys.length;
      for (var i = 0; i < len; i++) {
        key = keys[i];
        if (obj) {
          obj = (lastInstance = obj)[key];
        }
      }
      if (!bindFnToScope && isFunction(obj)) {
        return bind(lastInstance, obj);
      }
      return obj;
    }
    function getBlockNodes(nodes) {
      var node = nodes[0];
      var endNode = nodes[nodes.length - 1];
      var blockNodes = [node];
      do {
        node = node.nextSibling;
        if (!node)
          break;
        blockNodes.push(node);
      } while (node !== endNode);
      return jqLite(blockNodes);
    }
    function createMap() {
      return Object.create(null);
    }
    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_TEXT = 3;
    var NODE_TYPE_COMMENT = 8;
    var NODE_TYPE_DOCUMENT = 9;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
    function setupModuleLoader(window) {
      var $injectorMinErr = minErr('$injector');
      var ngMinErr = minErr('ng');
      function ensure(obj, name, factory) {
        return obj[name] || (obj[name] = factory());
      }
      var angular = ensure(window, 'angular', Object);
      angular.$$minErr = angular.$$minErr || minErr;
      return ensure(angular, 'module', function() {
        var modules = {};
        return function module(name, requires, configFn) {
          var assertNotHasOwnProperty = function(name, context) {
            if (name === 'hasOwnProperty') {
              throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
            }
          };
          assertNotHasOwnProperty(name, 'module');
          if (requires && modules.hasOwnProperty(name)) {
            modules[name] = null;
          }
          return ensure(modules, name, function() {
            if (!requires) {
              throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " + "the module name or forgot to load it. If registering a module ensure that you " + "specify the dependencies as the second argument.", name);
            }
            var invokeQueue = [];
            var configBlocks = [];
            var runBlocks = [];
            var config = invokeLater('$injector', 'invoke', 'push', configBlocks);
            var moduleInstance = {
              _invokeQueue: invokeQueue,
              _configBlocks: configBlocks,
              _runBlocks: runBlocks,
              requires: requires,
              name: name,
              provider: invokeLater('$provide', 'provider'),
              factory: invokeLater('$provide', 'factory'),
              service: invokeLater('$provide', 'service'),
              value: invokeLater('$provide', 'value'),
              constant: invokeLater('$provide', 'constant', 'unshift'),
              animation: invokeLater('$animateProvider', 'register'),
              filter: invokeLater('$filterProvider', 'register'),
              controller: invokeLater('$controllerProvider', 'register'),
              directive: invokeLater('$compileProvider', 'directive'),
              config: config,
              run: function(block) {
                runBlocks.push(block);
                return this;
              }
            };
            if (configFn) {
              config(configFn);
            }
            return moduleInstance;
            function invokeLater(provider, method, insertMethod, queue) {
              if (!queue)
                queue = invokeQueue;
              return function() {
                queue[insertMethod || 'push']([provider, method, arguments]);
                return moduleInstance;
              };
            }
          });
        };
      });
    }
    function serializeObject(obj) {
      var seen = [];
      return JSON.stringify(obj, function(key, val) {
        val = toJsonReplacer(key, val);
        if (isObject(val)) {
          if (seen.indexOf(val) >= 0)
            return '<<already seen>>';
          seen.push(val);
        }
        return val;
      });
    }
    function toDebugString(obj) {
      if (typeof obj === 'function') {
        return obj.toString().replace(/ \{[\s\S]*$/, '');
      } else if (typeof obj === 'undefined') {
        return 'undefined';
      } else if (typeof obj !== 'string') {
        return serializeObject(obj);
      }
      return obj;
    }
    var version = {
      full: '1.3.6',
      major: 1,
      minor: 3,
      dot: 6,
      codeName: 'robofunky-danceblaster'
    };
    function publishExternalAPI(angular) {
      extend(angular, {
        'bootstrap': bootstrap,
        'copy': copy,
        'extend': extend,
        'equals': equals,
        'element': jqLite,
        'forEach': forEach,
        'injector': createInjector,
        'noop': noop,
        'bind': bind,
        'toJson': toJson,
        'fromJson': fromJson,
        'identity': identity,
        'isUndefined': isUndefined,
        'isDefined': isDefined,
        'isString': isString,
        'isFunction': isFunction,
        'isObject': isObject,
        'isNumber': isNumber,
        'isElement': isElement,
        'isArray': isArray,
        'version': version,
        'isDate': isDate,
        'lowercase': lowercase,
        'uppercase': uppercase,
        'callbacks': {counter: 0},
        'getTestability': getTestability,
        '$$minErr': minErr,
        '$$csp': csp,
        'reloadWithDebugInfo': reloadWithDebugInfo
      });
      angularModule = setupModuleLoader(window);
      try {
        angularModule('ngLocale');
      } catch (e) {
        angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
      }
      angularModule('ng', ['ngLocale'], ['$provide', function ngModule($provide) {
        $provide.provider({$$sanitizeUri: $$SanitizeUriProvider});
        $provide.provider('$compile', $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          style: styleDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          pattern: patternDirective,
          ngPattern: patternDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          minlength: minlengthDirective,
          ngMinlength: minlengthDirective,
          maxlength: maxlengthDirective,
          ngMaxlength: maxlengthDirective,
          ngValue: ngValueDirective,
          ngModelOptions: ngModelOptionsDirective
        }).directive({ngInclude: ngIncludeFillContentDirective}).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $http: $HttpProvider,
          $httpBackend: $HttpBackendProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $$q: $$QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $templateCache: $TemplateCacheProvider,
          $templateRequest: $TemplateRequestProvider,
          $$testability: $$TestabilityProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider,
          $$rAF: $$RAFProvider,
          $$asyncCallback: $$AsyncCallbackProvider,
          $$jqLite: $$jqLiteProvider
        });
      }]);
    }
    JQLite.expando = 'ng339';
    var jqCache = JQLite.cache = {},
        jqId = 1,
        addEventListenerFn = function(element, type, fn) {
          element.addEventListener(type, fn, false);
        },
        removeEventListenerFn = function(element, type, fn) {
          element.removeEventListener(type, fn, false);
        };
    JQLite._data = function(node) {
      return this.cache[node[this.expando]] || {};
    };
    function jqNextId() {
      return ++jqId;
    }
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    var MOUSE_EVENT_MAP = {
      mouseleave: "mouseout",
      mouseenter: "mouseover"
    };
    var jqLiteMinErr = minErr('jqLite');
    function camelCase(name) {
      return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    }
    var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var HTML_REGEXP = /<|&#?\w+;/;
    var TAG_NAME_REGEXP = /<([\w:]+)/;
    var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
    var wrapMap = {
      'option': [1, '<select multiple="multiple">', '</select>'],
      'thead': [1, '<table>', '</table>'],
      'col': [2, '<table><colgroup>', '</colgroup></table>'],
      'tr': [2, '<table><tbody>', '</tbody></table>'],
      'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      '_default': [0, "", ""]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function jqLiteIsTextNode(html) {
      return !HTML_REGEXP.test(html);
    }
    function jqLiteAcceptsData(node) {
      var nodeType = node.nodeType;
      return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
    }
    function jqLiteBuildFragment(html, context) {
      var tmp,
          tag,
          wrap,
          fragment = context.createDocumentFragment(),
          nodes = [],
          i;
      if (jqLiteIsTextNode(html)) {
        nodes.push(context.createTextNode(html));
      } else {
        tmp = tmp || fragment.appendChild(context.createElement("div"));
        tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
        wrap = wrapMap[tag] || wrapMap._default;
        tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2];
        i = wrap[0];
        while (i--) {
          tmp = tmp.lastChild;
        }
        nodes = concat(nodes, tmp.childNodes);
        tmp = fragment.firstChild;
        tmp.textContent = "";
      }
      fragment.textContent = "";
      fragment.innerHTML = "";
      forEach(nodes, function(node) {
        fragment.appendChild(node);
      });
      return fragment;
    }
    function jqLiteParseHTML(html, context) {
      context = context || document;
      var parsed;
      if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
        return [context.createElement(parsed[1])];
      }
      if ((parsed = jqLiteBuildFragment(html, context))) {
        return parsed.childNodes;
      }
      return [];
    }
    function JQLite(element) {
      if (element instanceof JQLite) {
        return element;
      }
      var argIsString;
      if (isString(element)) {
        element = trim(element);
        argIsString = true;
      }
      if (!(this instanceof JQLite)) {
        if (argIsString && element.charAt(0) != '<') {
          throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
        }
        return new JQLite(element);
      }
      if (argIsString) {
        jqLiteAddNodes(this, jqLiteParseHTML(element));
      } else {
        jqLiteAddNodes(this, element);
      }
    }
    function jqLiteClone(element) {
      return element.cloneNode(true);
    }
    function jqLiteDealoc(element, onlyDescendants) {
      if (!onlyDescendants)
        jqLiteRemoveData(element);
      if (element.querySelectorAll) {
        var descendants = element.querySelectorAll('*');
        for (var i = 0,
            l = descendants.length; i < l; i++) {
          jqLiteRemoveData(descendants[i]);
        }
      }
    }
    function jqLiteOff(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
      var expandoStore = jqLiteExpandoStore(element);
      var events = expandoStore && expandoStore.events;
      var handle = expandoStore && expandoStore.handle;
      if (!handle)
        return;
      if (!type) {
        for (type in events) {
          if (type !== '$destroy') {
            removeEventListenerFn(element, type, handle);
          }
          delete events[type];
        }
      } else {
        forEach(type.split(' '), function(type) {
          if (isDefined(fn)) {
            var listenerFns = events[type];
            arrayRemove(listenerFns || [], fn);
            if (listenerFns && listenerFns.length > 0) {
              return;
            }
          }
          removeEventListenerFn(element, type, handle);
          delete events[type];
        });
      }
    }
    function jqLiteRemoveData(element, name) {
      var expandoId = element.ng339;
      var expandoStore = expandoId && jqCache[expandoId];
      if (expandoStore) {
        if (name) {
          delete expandoStore.data[name];
          return;
        }
        if (expandoStore.handle) {
          if (expandoStore.events.$destroy) {
            expandoStore.handle({}, '$destroy');
          }
          jqLiteOff(element);
        }
        delete jqCache[expandoId];
        element.ng339 = undefined;
      }
    }
    function jqLiteExpandoStore(element, createIfNecessary) {
      var expandoId = element.ng339,
          expandoStore = expandoId && jqCache[expandoId];
      if (createIfNecessary && !expandoStore) {
        element.ng339 = expandoId = jqNextId();
        expandoStore = jqCache[expandoId] = {
          events: {},
          data: {},
          handle: undefined
        };
      }
      return expandoStore;
    }
    function jqLiteData(element, key, value) {
      if (jqLiteAcceptsData(element)) {
        var isSimpleSetter = isDefined(value);
        var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
        var massGetter = !key;
        var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
        var data = expandoStore && expandoStore.data;
        if (isSimpleSetter) {
          data[key] = value;
        } else {
          if (massGetter) {
            return data;
          } else {
            if (isSimpleGetter) {
              return data && data[key];
            } else {
              extend(data, key);
            }
          }
        }
      }
    }
    function jqLiteHasClass(element, selector) {
      if (!element.getAttribute)
        return false;
      return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1);
    }
    function jqLiteRemoveClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        forEach(cssClasses.split(' '), function(cssClass) {
          element.setAttribute('class', trim((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")));
        });
      }
    }
    function jqLiteAddClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, " ");
        forEach(cssClasses.split(' '), function(cssClass) {
          cssClass = trim(cssClass);
          if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
            existingClasses += cssClass + ' ';
          }
        });
        element.setAttribute('class', trim(existingClasses));
      }
    }
    function jqLiteAddNodes(root, elements) {
      if (elements) {
        if (elements.nodeType) {
          root[root.length++] = elements;
        } else {
          var length = elements.length;
          if (typeof length === 'number' && elements.window !== elements) {
            if (length) {
              for (var i = 0; i < length; i++) {
                root[root.length++] = elements[i];
              }
            }
          } else {
            root[root.length++] = elements;
          }
        }
      }
    }
    function jqLiteController(element, name) {
      return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
    }
    function jqLiteInheritedData(element, name, value) {
      if (element.nodeType == NODE_TYPE_DOCUMENT) {
        element = element.documentElement;
      }
      var names = isArray(name) ? name : [name];
      while (element) {
        for (var i = 0,
            ii = names.length; i < ii; i++) {
          if ((value = jqLite.data(element, names[i])) !== undefined)
            return value;
        }
        element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
      }
    }
    function jqLiteEmpty(element) {
      jqLiteDealoc(element, true);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
    function jqLiteRemove(element, keepData) {
      if (!keepData)
        jqLiteDealoc(element);
      var parent = element.parentNode;
      if (parent)
        parent.removeChild(element);
    }
    function jqLiteDocumentLoaded(action, win) {
      win = win || window;
      if (win.document.readyState === 'complete') {
        win.setTimeout(action);
      } else {
        jqLite(win).on('load', action);
      }
    }
    var JQLitePrototype = JQLite.prototype = {
      ready: function(fn) {
        var fired = false;
        function trigger() {
          if (fired)
            return;
          fired = true;
          fn();
        }
        if (document.readyState === 'complete') {
          setTimeout(trigger);
        } else {
          this.on('DOMContentLoaded', trigger);
          JQLite(window).on('load', trigger);
        }
      },
      toString: function() {
        var value = [];
        forEach(this, function(e) {
          value.push('' + e);
        });
        return '[' + value.join(', ') + ']';
      },
      eq: function(index) {
        return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
      },
      length: 0,
      push: push,
      sort: [].sort,
      splice: [].splice
    };
    var BOOLEAN_ATTR = {};
    forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
      BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
      BOOLEAN_ELEMENTS[value] = true;
    });
    var ALIASED_ATTR = {
      'ngMinlength': 'minlength',
      'ngMaxlength': 'maxlength',
      'ngMin': 'min',
      'ngMax': 'max',
      'ngPattern': 'pattern'
    };
    function getBooleanAttrName(element, name) {
      var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
      return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
    }
    function getAliasedAttrName(element, name) {
      var nodeName = element.nodeName;
      return (nodeName === 'INPUT' || nodeName === 'TEXTAREA') && ALIASED_ATTR[name];
    }
    forEach({
      data: jqLiteData,
      removeData: jqLiteRemoveData
    }, function(fn, name) {
      JQLite[name] = fn;
    });
    forEach({
      data: jqLiteData,
      inheritedData: jqLiteInheritedData,
      scope: function(element) {
        return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
      },
      isolateScope: function(element) {
        return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
      },
      controller: jqLiteController,
      injector: function(element) {
        return jqLiteInheritedData(element, '$injector');
      },
      removeAttr: function(element, name) {
        element.removeAttribute(name);
      },
      hasClass: jqLiteHasClass,
      css: function(element, name, value) {
        name = camelCase(name);
        if (isDefined(value)) {
          element.style[name] = value;
        } else {
          return element.style[name];
        }
      },
      attr: function(element, name, value) {
        var lowercasedName = lowercase(name);
        if (BOOLEAN_ATTR[lowercasedName]) {
          if (isDefined(value)) {
            if (!!value) {
              element[name] = true;
              element.setAttribute(name, lowercasedName);
            } else {
              element[name] = false;
              element.removeAttribute(lowercasedName);
            }
          } else {
            return (element[name] || (element.attributes.getNamedItem(name) || noop).specified) ? lowercasedName : undefined;
          }
        } else if (isDefined(value)) {
          element.setAttribute(name, value);
        } else if (element.getAttribute) {
          var ret = element.getAttribute(name, 2);
          return ret === null ? undefined : ret;
        }
      },
      prop: function(element, name, value) {
        if (isDefined(value)) {
          element[name] = value;
        } else {
          return element[name];
        }
      },
      text: (function() {
        getText.$dv = '';
        return getText;
        function getText(element, value) {
          if (isUndefined(value)) {
            var nodeType = element.nodeType;
            return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
          }
          element.textContent = value;
        }
      })(),
      val: function(element, value) {
        if (isUndefined(value)) {
          if (element.multiple && nodeName_(element) === 'select') {
            var result = [];
            forEach(element.options, function(option) {
              if (option.selected) {
                result.push(option.value || option.text);
              }
            });
            return result.length === 0 ? null : result;
          }
          return element.value;
        }
        element.value = value;
      },
      html: function(element, value) {
        if (isUndefined(value)) {
          return element.innerHTML;
        }
        jqLiteDealoc(element, true);
        element.innerHTML = value;
      },
      empty: jqLiteEmpty
    }, function(fn, name) {
      JQLite.prototype[name] = function(arg1, arg2) {
        var i,
            key;
        var nodeCount = this.length;
        if (fn !== jqLiteEmpty && (((fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2) === undefined)) {
          if (isObject(arg1)) {
            for (i = 0; i < nodeCount; i++) {
              if (fn === jqLiteData) {
                fn(this[i], arg1);
              } else {
                for (key in arg1) {
                  fn(this[i], key, arg1[key]);
                }
              }
            }
            return this;
          } else {
            var value = fn.$dv;
            var jj = (value === undefined) ? Math.min(nodeCount, 1) : nodeCount;
            for (var j = 0; j < jj; j++) {
              var nodeValue = fn(this[j], arg1, arg2);
              value = value ? value + nodeValue : nodeValue;
            }
            return value;
          }
        } else {
          for (i = 0; i < nodeCount; i++) {
            fn(this[i], arg1, arg2);
          }
          return this;
        }
      };
    });
    function createEventHandler(element, events) {
      var eventHandler = function(event, type) {
        event.isDefaultPrevented = function() {
          return event.defaultPrevented;
        };
        var eventFns = events[type || event.type];
        var eventFnsLength = eventFns ? eventFns.length : 0;
        if (!eventFnsLength)
          return;
        if (isUndefined(event.immediatePropagationStopped)) {
          var originalStopImmediatePropagation = event.stopImmediatePropagation;
          event.stopImmediatePropagation = function() {
            event.immediatePropagationStopped = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            if (originalStopImmediatePropagation) {
              originalStopImmediatePropagation.call(event);
            }
          };
        }
        event.isImmediatePropagationStopped = function() {
          return event.immediatePropagationStopped === true;
        };
        if ((eventFnsLength > 1)) {
          eventFns = shallowCopy(eventFns);
        }
        for (var i = 0; i < eventFnsLength; i++) {
          if (!event.isImmediatePropagationStopped()) {
            eventFns[i].call(element, event);
          }
        }
      };
      eventHandler.elem = element;
      return eventHandler;
    }
    forEach({
      removeData: jqLiteRemoveData,
      on: function jqLiteOn(element, type, fn, unsupported) {
        if (isDefined(unsupported))
          throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
        if (!jqLiteAcceptsData(element)) {
          return;
        }
        var expandoStore = jqLiteExpandoStore(element, true);
        var events = expandoStore.events;
        var handle = expandoStore.handle;
        if (!handle) {
          handle = expandoStore.handle = createEventHandler(element, events);
        }
        var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
        var i = types.length;
        while (i--) {
          type = types[i];
          var eventFns = events[type];
          if (!eventFns) {
            events[type] = [];
            if (type === 'mouseenter' || type === 'mouseleave') {
              jqLiteOn(element, MOUSE_EVENT_MAP[type], function(event) {
                var target = this,
                    related = event.relatedTarget;
                if (!related || (related !== target && !target.contains(related))) {
                  handle(event, type);
                }
              });
            } else {
              if (type !== '$destroy') {
                addEventListenerFn(element, type, handle);
              }
            }
            eventFns = events[type];
          }
          eventFns.push(fn);
        }
      },
      off: jqLiteOff,
      one: function(element, type, fn) {
        element = jqLite(element);
        element.on(type, function onFn() {
          element.off(type, fn);
          element.off(type, onFn);
        });
        element.on(type, fn);
      },
      replaceWith: function(element, replaceNode) {
        var index,
            parent = element.parentNode;
        jqLiteDealoc(element);
        forEach(new JQLite(replaceNode), function(node) {
          if (index) {
            parent.insertBefore(node, index.nextSibling);
          } else {
            parent.replaceChild(node, element);
          }
          index = node;
        });
      },
      children: function(element) {
        var children = [];
        forEach(element.childNodes, function(element) {
          if (element.nodeType === NODE_TYPE_ELEMENT)
            children.push(element);
        });
        return children;
      },
      contents: function(element) {
        return element.contentDocument || element.childNodes || [];
      },
      append: function(element, node) {
        var nodeType = element.nodeType;
        if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT)
          return;
        node = new JQLite(node);
        for (var i = 0,
            ii = node.length; i < ii; i++) {
          var child = node[i];
          element.appendChild(child);
        }
      },
      prepend: function(element, node) {
        if (element.nodeType === NODE_TYPE_ELEMENT) {
          var index = element.firstChild;
          forEach(new JQLite(node), function(child) {
            element.insertBefore(child, index);
          });
        }
      },
      wrap: function(element, wrapNode) {
        wrapNode = jqLite(wrapNode).eq(0).clone()[0];
        var parent = element.parentNode;
        if (parent) {
          parent.replaceChild(wrapNode, element);
        }
        wrapNode.appendChild(element);
      },
      remove: jqLiteRemove,
      detach: function(element) {
        jqLiteRemove(element, true);
      },
      after: function(element, newElement) {
        var index = element,
            parent = element.parentNode;
        newElement = new JQLite(newElement);
        for (var i = 0,
            ii = newElement.length; i < ii; i++) {
          var node = newElement[i];
          parent.insertBefore(node, index.nextSibling);
          index = node;
        }
      },
      addClass: jqLiteAddClass,
      removeClass: jqLiteRemoveClass,
      toggleClass: function(element, selector, condition) {
        if (selector) {
          forEach(selector.split(' '), function(className) {
            var classCondition = condition;
            if (isUndefined(classCondition)) {
              classCondition = !jqLiteHasClass(element, className);
            }
            (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
          });
        }
      },
      parent: function(element) {
        var parent = element.parentNode;
        return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
      },
      next: function(element) {
        return element.nextElementSibling;
      },
      find: function(element, selector) {
        if (element.getElementsByTagName) {
          return element.getElementsByTagName(selector);
        } else {
          return [];
        }
      },
      clone: jqLiteClone,
      triggerHandler: function(element, event, extraParameters) {
        var dummyEvent,
            eventFnsCopy,
            handlerArgs;
        var eventName = event.type || event;
        var expandoStore = jqLiteExpandoStore(element);
        var events = expandoStore && expandoStore.events;
        var eventFns = events && events[eventName];
        if (eventFns) {
          dummyEvent = {
            preventDefault: function() {
              this.defaultPrevented = true;
            },
            isDefaultPrevented: function() {
              return this.defaultPrevented === true;
            },
            stopImmediatePropagation: function() {
              this.immediatePropagationStopped = true;
            },
            isImmediatePropagationStopped: function() {
              return this.immediatePropagationStopped === true;
            },
            stopPropagation: noop,
            type: eventName,
            target: element
          };
          if (event.type) {
            dummyEvent = extend(dummyEvent, event);
          }
          eventFnsCopy = shallowCopy(eventFns);
          handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];
          forEach(eventFnsCopy, function(fn) {
            if (!dummyEvent.isImmediatePropagationStopped()) {
              fn.apply(element, handlerArgs);
            }
          });
        }
      }
    }, function(fn, name) {
      JQLite.prototype[name] = function(arg1, arg2, arg3) {
        var value;
        for (var i = 0,
            ii = this.length; i < ii; i++) {
          if (isUndefined(value)) {
            value = fn(this[i], arg1, arg2, arg3);
            if (isDefined(value)) {
              value = jqLite(value);
            }
          } else {
            jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
          }
        }
        return isDefined(value) ? value : this;
      };
      JQLite.prototype.bind = JQLite.prototype.on;
      JQLite.prototype.unbind = JQLite.prototype.off;
    });
    function $$jqLiteProvider() {
      this.$get = function $$jqLite() {
        return extend(JQLite, {
          hasClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteHasClass(node, classes);
          },
          addClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteAddClass(node, classes);
          },
          removeClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteRemoveClass(node, classes);
          }
        });
      };
    }
    function hashKey(obj, nextUidFn) {
      var key = obj && obj.$$hashKey;
      if (key) {
        if (typeof key === 'function') {
          key = obj.$$hashKey();
        }
        return key;
      }
      var objType = typeof obj;
      if (objType == 'function' || (objType == 'object' && obj !== null)) {
        key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
      } else {
        key = objType + ':' + obj;
      }
      return key;
    }
    function HashMap(array, isolatedUid) {
      if (isolatedUid) {
        var uid = 0;
        this.nextUid = function() {
          return ++uid;
        };
      }
      forEach(array, this.put, this);
    }
    HashMap.prototype = {
      put: function(key, value) {
        this[hashKey(key, this.nextUid)] = value;
      },
      get: function(key) {
        return this[hashKey(key, this.nextUid)];
      },
      remove: function(key) {
        var value = this[key = hashKey(key, this.nextUid)];
        delete this[key];
        return value;
      }
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var $injectorMinErr = minErr('$injector');
    function anonFn(fn) {
      var fnText = fn.toString().replace(STRIP_COMMENTS, ''),
          args = fnText.match(FN_ARGS);
      if (args) {
        return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
      }
      return 'fn';
    }
    function annotate(fn, strictDi, name) {
      var $inject,
          fnText,
          argDecl,
          last;
      if (typeof fn === 'function') {
        if (!($inject = fn.$inject)) {
          $inject = [];
          if (fn.length) {
            if (strictDi) {
              if (!isString(name) || !name) {
                name = fn.name || anonFn(fn);
              }
              throw $injectorMinErr('strictdi', '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
            }
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
              arg.replace(FN_ARG, function(all, underscore, name) {
                $inject.push(name);
              });
            });
          }
          fn.$inject = $inject;
        }
      } else if (isArray(fn)) {
        last = fn.length - 1;
        assertArgFn(fn[last], 'fn');
        $inject = fn.slice(0, last);
      } else {
        assertArgFn(fn, 'fn', true);
      }
      return $inject;
    }
    function createInjector(modulesToLoad, strictDi) {
      strictDi = (strictDi === true);
      var INSTANTIATING = {},
          providerSuffix = 'Provider',
          path = [],
          loadedModules = new HashMap([], true),
          providerCache = {$provide: {
              provider: supportObject(provider),
              factory: supportObject(factory),
              service: supportObject(service),
              value: supportObject(value),
              constant: supportObject(constant),
              decorator: decorator
            }},
          providerInjector = (providerCache.$injector = createInternalInjector(providerCache, function(serviceName, caller) {
            if (angular.isString(caller)) {
              path.push(caller);
            }
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
          })),
          instanceCache = {},
          instanceInjector = (instanceCache.$injector = createInternalInjector(instanceCache, function(serviceName, caller) {
            var provider = providerInjector.get(serviceName + providerSuffix, caller);
            return instanceInjector.invoke(provider.$get, provider, undefined, serviceName);
          }));
      forEach(loadModules(modulesToLoad), function(fn) {
        instanceInjector.invoke(fn || noop);
      });
      return instanceInjector;
      function supportObject(delegate) {
        return function(key, value) {
          if (isObject(key)) {
            forEach(key, reverseParams(delegate));
          } else {
            return delegate(key, value);
          }
        };
      }
      function provider(name, provider_) {
        assertNotHasOwnProperty(name, 'service');
        if (isFunction(provider_) || isArray(provider_)) {
          provider_ = providerInjector.instantiate(provider_);
        }
        if (!provider_.$get) {
          throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
        }
        return providerCache[name + providerSuffix] = provider_;
      }
      function enforceReturnValue(name, factory) {
        return function enforcedReturnValue() {
          var result = instanceInjector.invoke(factory, this);
          if (isUndefined(result)) {
            throw $injectorMinErr('undef', "Provider '{0}' must return a value from $get factory method.", name);
          }
          return result;
        };
      }
      function factory(name, factoryFn, enforce) {
        return provider(name, {$get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn});
      }
      function service(name, constructor) {
        return factory(name, ['$injector', function($injector) {
          return $injector.instantiate(constructor);
        }]);
      }
      function value(name, val) {
        return factory(name, valueFn(val), false);
      }
      function constant(name, value) {
        assertNotHasOwnProperty(name, 'constant');
        providerCache[name] = value;
        instanceCache[name] = value;
      }
      function decorator(serviceName, decorFn) {
        var origProvider = providerInjector.get(serviceName + providerSuffix),
            orig$get = origProvider.$get;
        origProvider.$get = function() {
          var origInstance = instanceInjector.invoke(orig$get, origProvider);
          return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
        };
      }
      function loadModules(modulesToLoad) {
        var runBlocks = [],
            moduleFn;
        forEach(modulesToLoad, function(module) {
          if (loadedModules.get(module))
            return;
          loadedModules.put(module, true);
          function runInvokeQueue(queue) {
            var i,
                ii;
            for (i = 0, ii = queue.length; i < ii; i++) {
              var invokeArgs = queue[i],
                  provider = providerInjector.get(invokeArgs[0]);
              provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }
          }
          try {
            if (isString(module)) {
              moduleFn = angularModule(module);
              runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
              runInvokeQueue(moduleFn._invokeQueue);
              runInvokeQueue(moduleFn._configBlocks);
            } else if (isFunction(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else if (isArray(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else {
              assertArgFn(module, 'module');
            }
          } catch (e) {
            if (isArray(module)) {
              module = module[module.length - 1];
            }
            if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
              e = e.message + '\n' + e.stack;
            }
            throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
          }
        });
        return runBlocks;
      }
      function createInternalInjector(cache, factory) {
        function getService(serviceName, caller) {
          if (cache.hasOwnProperty(serviceName)) {
            if (cache[serviceName] === INSTANTIATING) {
              throw $injectorMinErr('cdep', 'Circular dependency found: {0}', serviceName + ' <- ' + path.join(' <- '));
            }
            return cache[serviceName];
          } else {
            try {
              path.unshift(serviceName);
              cache[serviceName] = INSTANTIATING;
              return cache[serviceName] = factory(serviceName, caller);
            } catch (err) {
              if (cache[serviceName] === INSTANTIATING) {
                delete cache[serviceName];
              }
              throw err;
            } finally {
              path.shift();
            }
          }
        }
        function invoke(fn, self, locals, serviceName) {
          if (typeof locals === 'string') {
            serviceName = locals;
            locals = null;
          }
          var args = [],
              $inject = annotate(fn, strictDi, serviceName),
              length,
              i,
              key;
          for (i = 0, length = $inject.length; i < length; i++) {
            key = $inject[i];
            if (typeof key !== 'string') {
              throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
            }
            args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key, serviceName));
          }
          if (isArray(fn)) {
            fn = fn[length];
          }
          return fn.apply(self, args);
        }
        function instantiate(Type, locals, serviceName) {
          var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype);
          var returnedValue = invoke(Type, instance, locals, serviceName);
          return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
        }
        return {
          invoke: invoke,
          instantiate: instantiate,
          get: getService,
          annotate: annotate,
          has: function(name) {
            return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
          }
        };
      }
    }
    createInjector.$$annotate = annotate;
    function $AnchorScrollProvider() {
      var autoScrollingEnabled = true;
      this.disableAutoScrolling = function() {
        autoScrollingEnabled = false;
      };
      this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
        var document = $window.document;
        function getFirstAnchor(list) {
          var result = null;
          Array.prototype.some.call(list, function(element) {
            if (nodeName_(element) === 'a') {
              result = element;
              return true;
            }
          });
          return result;
        }
        function getYOffset() {
          var offset = scroll.yOffset;
          if (isFunction(offset)) {
            offset = offset();
          } else if (isElement(offset)) {
            var elem = offset[0];
            var style = $window.getComputedStyle(elem);
            if (style.position !== 'fixed') {
              offset = 0;
            } else {
              offset = elem.getBoundingClientRect().bottom;
            }
          } else if (!isNumber(offset)) {
            offset = 0;
          }
          return offset;
        }
        function scrollTo(elem) {
          if (elem) {
            elem.scrollIntoView();
            var offset = getYOffset();
            if (offset) {
              var elemTop = elem.getBoundingClientRect().top;
              $window.scrollBy(0, elemTop - offset);
            }
          } else {
            $window.scrollTo(0, 0);
          }
        }
        function scroll() {
          var hash = $location.hash(),
              elm;
          if (!hash)
            scrollTo(null);
          else if ((elm = document.getElementById(hash)))
            scrollTo(elm);
          else if ((elm = getFirstAnchor(document.getElementsByName(hash))))
            scrollTo(elm);
          else if (hash === 'top')
            scrollTo(null);
        }
        if (autoScrollingEnabled) {
          $rootScope.$watch(function autoScrollWatch() {
            return $location.hash();
          }, function autoScrollWatchAction(newVal, oldVal) {
            if (newVal === oldVal && newVal === '')
              return;
            jqLiteDocumentLoaded(function() {
              $rootScope.$evalAsync(scroll);
            });
          });
        }
        return scroll;
      }];
    }
    var $animateMinErr = minErr('$animate');
    var $AnimateProvider = ['$provide', function($provide) {
      this.$$selectors = {};
      this.register = function(name, factory) {
        var key = name + '-animation';
        if (name && name.charAt(0) != '.')
          throw $animateMinErr('notcsel', "Expecting class selector starting with '.' got '{0}'.", name);
        this.$$selectors[name.substr(1)] = key;
        $provide.factory(key, factory);
      };
      this.classNameFilter = function(expression) {
        if (arguments.length === 1) {
          this.$$classNameFilter = (expression instanceof RegExp) ? expression : null;
        }
        return this.$$classNameFilter;
      };
      this.$get = ['$$q', '$$asyncCallback', '$rootScope', function($$q, $$asyncCallback, $rootScope) {
        var currentDefer;
        function runAnimationPostDigest(fn) {
          var cancelFn,
              defer = $$q.defer();
          defer.promise.$$cancelFn = function ngAnimateMaybeCancel() {
            cancelFn && cancelFn();
          };
          $rootScope.$$postDigest(function ngAnimatePostDigest() {
            cancelFn = fn(function ngAnimateNotifyComplete() {
              defer.resolve();
            });
          });
          return defer.promise;
        }
        function resolveElementClasses(element, classes) {
          var toAdd = [],
              toRemove = [];
          var hasClasses = createMap();
          forEach((element.attr('class') || '').split(/\s+/), function(className) {
            hasClasses[className] = true;
          });
          forEach(classes, function(status, className) {
            var hasClass = hasClasses[className];
            if (status === false && hasClass) {
              toRemove.push(className);
            } else if (status === true && !hasClass) {
              toAdd.push(className);
            }
          });
          return (toAdd.length + toRemove.length) > 0 && [toAdd.length ? toAdd : null, toRemove.length ? toRemove : null];
        }
        function cachedClassManipulation(cache, classes, op) {
          for (var i = 0,
              ii = classes.length; i < ii; ++i) {
            var className = classes[i];
            cache[className] = op;
          }
        }
        function asyncPromise() {
          if (!currentDefer) {
            currentDefer = $$q.defer();
            $$asyncCallback(function() {
              currentDefer.resolve();
              currentDefer = null;
            });
          }
          return currentDefer.promise;
        }
        function applyStyles(element, options) {
          if (angular.isObject(options)) {
            var styles = extend(options.from || {}, options.to || {});
            element.css(styles);
          }
        }
        return {
          animate: function(element, from, to) {
            applyStyles(element, {
              from: from,
              to: to
            });
            return asyncPromise();
          },
          enter: function(element, parent, after, options) {
            applyStyles(element, options);
            after ? after.after(element) : parent.prepend(element);
            return asyncPromise();
          },
          leave: function(element, options) {
            element.remove();
            return asyncPromise();
          },
          move: function(element, parent, after, options) {
            return this.enter(element, parent, after, options);
          },
          addClass: function(element, className, options) {
            return this.setClass(element, className, [], options);
          },
          $$addClassImmediately: function(element, className, options) {
            element = jqLite(element);
            className = !isString(className) ? (isArray(className) ? className.join(' ') : '') : className;
            forEach(element, function(element) {
              jqLiteAddClass(element, className);
            });
            applyStyles(element, options);
            return asyncPromise();
          },
          removeClass: function(element, className, options) {
            return this.setClass(element, [], className, options);
          },
          $$removeClassImmediately: function(element, className, options) {
            element = jqLite(element);
            className = !isString(className) ? (isArray(className) ? className.join(' ') : '') : className;
            forEach(element, function(element) {
              jqLiteRemoveClass(element, className);
            });
            applyStyles(element, options);
            return asyncPromise();
          },
          setClass: function(element, add, remove, options) {
            var self = this;
            var STORAGE_KEY = '$$animateClasses';
            var createdCache = false;
            element = jqLite(element);
            var cache = element.data(STORAGE_KEY);
            if (!cache) {
              cache = {
                classes: {},
                options: options
              };
              createdCache = true;
            } else if (options && cache.options) {
              cache.options = angular.extend(cache.options || {}, options);
            }
            var classes = cache.classes;
            add = isArray(add) ? add : add.split(' ');
            remove = isArray(remove) ? remove : remove.split(' ');
            cachedClassManipulation(classes, add, true);
            cachedClassManipulation(classes, remove, false);
            if (createdCache) {
              cache.promise = runAnimationPostDigest(function(done) {
                var cache = element.data(STORAGE_KEY);
                element.removeData(STORAGE_KEY);
                if (cache) {
                  var classes = resolveElementClasses(element, cache.classes);
                  if (classes) {
                    self.$$setClassImmediately(element, classes[0], classes[1], cache.options);
                  }
                }
                done();
              });
              element.data(STORAGE_KEY, cache);
            }
            return cache.promise;
          },
          $$setClassImmediately: function(element, add, remove, options) {
            add && this.$$addClassImmediately(element, add);
            remove && this.$$removeClassImmediately(element, remove);
            applyStyles(element, options);
            return asyncPromise();
          },
          enabled: noop,
          cancel: noop
        };
      }];
    }];
    function $$AsyncCallbackProvider() {
      this.$get = ['$$rAF', '$timeout', function($$rAF, $timeout) {
        return $$rAF.supported ? function(fn) {
          return $$rAF(fn);
        } : function(fn) {
          return $timeout(fn, 0, false);
        };
      }];
    }
    function Browser(window, document, $log, $sniffer) {
      var self = this,
          rawDocument = document[0],
          location = window.location,
          history = window.history,
          setTimeout = window.setTimeout,
          clearTimeout = window.clearTimeout,
          pendingDeferIds = {};
      self.isMock = false;
      var outstandingRequestCount = 0;
      var outstandingRequestCallbacks = [];
      self.$$completeOutstandingRequest = completeOutstandingRequest;
      self.$$incOutstandingRequestCount = function() {
        outstandingRequestCount++;
      };
      function completeOutstandingRequest(fn) {
        try {
          fn.apply(null, sliceArgs(arguments, 1));
        } finally {
          outstandingRequestCount--;
          if (outstandingRequestCount === 0) {
            while (outstandingRequestCallbacks.length) {
              try {
                outstandingRequestCallbacks.pop()();
              } catch (e) {
                $log.error(e);
              }
            }
          }
        }
      }
      function getHash(url) {
        var index = url.indexOf('#');
        return index === -1 ? '' : url.substr(index + 1);
      }
      self.notifyWhenNoOutstandingRequests = function(callback) {
        forEach(pollFns, function(pollFn) {
          pollFn();
        });
        if (outstandingRequestCount === 0) {
          callback();
        } else {
          outstandingRequestCallbacks.push(callback);
        }
      };
      var pollFns = [],
          pollTimeout;
      self.addPollFn = function(fn) {
        if (isUndefined(pollTimeout))
          startPoller(100, setTimeout);
        pollFns.push(fn);
        return fn;
      };
      function startPoller(interval, setTimeout) {
        (function check() {
          forEach(pollFns, function(pollFn) {
            pollFn();
          });
          pollTimeout = setTimeout(check, interval);
        })();
      }
      var cachedState,
          lastHistoryState,
          lastBrowserUrl = location.href,
          baseElement = document.find('base'),
          reloadLocation = null;
      cacheState();
      lastHistoryState = cachedState;
      self.url = function(url, replace, state) {
        if (isUndefined(state)) {
          state = null;
        }
        if (location !== window.location)
          location = window.location;
        if (history !== window.history)
          history = window.history;
        if (url) {
          var sameState = lastHistoryState === state;
          if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
            return self;
          }
          var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
          lastBrowserUrl = url;
          lastHistoryState = state;
          if ($sniffer.history && (!sameBase || !sameState)) {
            history[replace ? 'replaceState' : 'pushState'](state, '', url);
            cacheState();
            lastHistoryState = cachedState;
          } else {
            if (!sameBase) {
              reloadLocation = url;
            }
            if (replace) {
              location.replace(url);
            } else if (!sameBase) {
              location.href = url;
            } else {
              location.hash = getHash(url);
            }
          }
          return self;
        } else {
          return reloadLocation || location.href.replace(/%27/g, "'");
        }
      };
      self.state = function() {
        return cachedState;
      };
      var urlChangeListeners = [],
          urlChangeInit = false;
      function cacheStateAndFireUrlChange() {
        cacheState();
        fireUrlChange();
      }
      var lastCachedState = null;
      function cacheState() {
        cachedState = window.history.state;
        cachedState = isUndefined(cachedState) ? null : cachedState;
        if (equals(cachedState, lastCachedState)) {
          cachedState = lastCachedState;
        }
        lastCachedState = cachedState;
      }
      function fireUrlChange() {
        if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
          return;
        }
        lastBrowserUrl = self.url();
        lastHistoryState = cachedState;
        forEach(urlChangeListeners, function(listener) {
          listener(self.url(), cachedState);
        });
      }
      self.onUrlChange = function(callback) {
        if (!urlChangeInit) {
          if ($sniffer.history)
            jqLite(window).on('popstate', cacheStateAndFireUrlChange);
          jqLite(window).on('hashchange', cacheStateAndFireUrlChange);
          urlChangeInit = true;
        }
        urlChangeListeners.push(callback);
        return callback;
      };
      self.$$checkUrlChange = fireUrlChange;
      self.baseHref = function() {
        var href = baseElement.attr('href');
        return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
      };
      var lastCookies = {};
      var lastCookieString = '';
      var cookiePath = self.baseHref();
      function safeDecodeURIComponent(str) {
        try {
          return decodeURIComponent(str);
        } catch (e) {
          return str;
        }
      }
      self.cookies = function(name, value) {
        var cookieLength,
            cookieArray,
            cookie,
            i,
            index;
        if (name) {
          if (value === undefined) {
            rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
          } else {
            if (isString(value)) {
              cookieLength = (rawDocument.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';path=' + cookiePath).length + 1;
              if (cookieLength > 4096) {
                $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!");
              }
            }
          }
        } else {
          if (rawDocument.cookie !== lastCookieString) {
            lastCookieString = rawDocument.cookie;
            cookieArray = lastCookieString.split("; ");
            lastCookies = {};
            for (i = 0; i < cookieArray.length; i++) {
              cookie = cookieArray[i];
              index = cookie.indexOf('=');
              if (index > 0) {
                name = safeDecodeURIComponent(cookie.substring(0, index));
                if (lastCookies[name] === undefined) {
                  lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
                }
              }
            }
          }
          return lastCookies;
        }
      };
      self.defer = function(fn, delay) {
        var timeoutId;
        outstandingRequestCount++;
        timeoutId = setTimeout(function() {
          delete pendingDeferIds[timeoutId];
          completeOutstandingRequest(fn);
        }, delay || 0);
        pendingDeferIds[timeoutId] = true;
        return timeoutId;
      };
      self.defer.cancel = function(deferId) {
        if (pendingDeferIds[deferId]) {
          delete pendingDeferIds[deferId];
          clearTimeout(deferId);
          completeOutstandingRequest(noop);
          return true;
        }
        return false;
      };
    }
    function $BrowserProvider() {
      this.$get = ['$window', '$log', '$sniffer', '$document', function($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }];
    }
    function $CacheFactoryProvider() {
      this.$get = function() {
        var caches = {};
        function cacheFactory(cacheId, options) {
          if (cacheId in caches) {
            throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
          }
          var size = 0,
              stats = extend({}, options, {id: cacheId}),
              data = {},
              capacity = (options && options.capacity) || Number.MAX_VALUE,
              lruHash = {},
              freshEnd = null,
              staleEnd = null;
          return caches[cacheId] = {
            put: function(key, value) {
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key] || (lruHash[key] = {key: key});
                refresh(lruEntry);
              }
              if (isUndefined(value))
                return;
              if (!(key in data))
                size++;
              data[key] = value;
              if (size > capacity) {
                this.remove(staleEnd.key);
              }
              return value;
            },
            get: function(key) {
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry)
                  return;
                refresh(lruEntry);
              }
              return data[key];
            },
            remove: function(key) {
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry)
                  return;
                if (lruEntry == freshEnd)
                  freshEnd = lruEntry.p;
                if (lruEntry == staleEnd)
                  staleEnd = lruEntry.n;
                link(lruEntry.n, lruEntry.p);
                delete lruHash[key];
              }
              delete data[key];
              size--;
            },
            removeAll: function() {
              data = {};
              size = 0;
              lruHash = {};
              freshEnd = staleEnd = null;
            },
            destroy: function() {
              data = null;
              stats = null;
              lruHash = null;
              delete caches[cacheId];
            },
            info: function() {
              return extend({}, stats, {size: size});
            }
          };
          function refresh(entry) {
            if (entry != freshEnd) {
              if (!staleEnd) {
                staleEnd = entry;
              } else if (staleEnd == entry) {
                staleEnd = entry.n;
              }
              link(entry.n, entry.p);
              link(entry, freshEnd);
              freshEnd = entry;
              freshEnd.n = null;
            }
          }
          function link(nextEntry, prevEntry) {
            if (nextEntry != prevEntry) {
              if (nextEntry)
                nextEntry.p = prevEntry;
              if (prevEntry)
                prevEntry.n = nextEntry;
            }
          }
        }
        cacheFactory.info = function() {
          var info = {};
          forEach(caches, function(cache, cacheId) {
            info[cacheId] = cache.info();
          });
          return info;
        };
        cacheFactory.get = function(cacheId) {
          return caches[cacheId];
        };
        return cacheFactory;
      };
    }
    function $TemplateCacheProvider() {
      this.$get = ['$cacheFactory', function($cacheFactory) {
        return $cacheFactory('templates');
      }];
    }
    var $compileMinErr = minErr('$compile');
    $CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];
    function $CompileProvider($provide, $$sanitizeUriProvider) {
      var hasDirectives = {},
          Suffix = 'Directive',
          COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
          CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/,
          ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'),
          REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;
      var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
      function parseIsolateBindings(scope, directiveName) {
        var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/;
        var bindings = {};
        forEach(scope, function(definition, scopeName) {
          var match = definition.match(LOCAL_REGEXP);
          if (!match) {
            throw $compileMinErr('iscp', "Invalid isolate scope definition for directive '{0}'." + " Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition);
          }
          bindings[scopeName] = {
            mode: match[1][0],
            collection: match[2] === '*',
            optional: match[3] === '?',
            attrName: match[4] || scopeName
          };
        });
        return bindings;
      }
      this.directive = function registerDirective(name, directiveFactory) {
        assertNotHasOwnProperty(name, 'directive');
        if (isString(name)) {
          assertArg(directiveFactory, 'directiveFactory');
          if (!hasDirectives.hasOwnProperty(name)) {
            hasDirectives[name] = [];
            $provide.factory(name + Suffix, ['$injector', '$exceptionHandler', function($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function(directiveFactory, index) {
                try {
                  var directive = $injector.invoke(directiveFactory);
                  if (isFunction(directive)) {
                    directive = {compile: valueFn(directive)};
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = directive.require || (directive.controller && directive.name);
                  directive.restrict = directive.restrict || 'EA';
                  if (isObject(directive.scope)) {
                    directive.$$isolateBindings = parseIsolateBindings(directive.scope, directive.name);
                  }
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }]);
          }
          hasDirectives[name].push(directiveFactory);
        } else {
          forEach(name, reverseParams(registerDirective));
        }
        return this;
      };
      this.aHrefSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }
      };
      this.imgSrcSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }
      };
      var debugInfoEnabled = true;
      this.debugInfoEnabled = function(enabled) {
        if (isDefined(enabled)) {
          debugInfoEnabled = enabled;
          return this;
        }
        return debugInfoEnabled;
      };
      this.$get = ['$injector', '$interpolate', '$exceptionHandler', '$templateRequest', '$parse', '$controller', '$rootScope', '$document', '$sce', '$animate', '$$sanitizeUri', function($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
        var Attributes = function(element, attributesToCopy) {
          if (attributesToCopy) {
            var keys = Object.keys(attributesToCopy);
            var i,
                l,
                key;
            for (i = 0, l = keys.length; i < l; i++) {
              key = keys[i];
              this[key] = attributesToCopy[key];
            }
          } else {
            this.$attr = {};
          }
          this.$$element = element;
        };
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function(newClasses, oldClasses) {
            var toAdd = tokenDifference(newClasses, oldClasses);
            if (toAdd && toAdd.length) {
              $animate.addClass(this.$$element, toAdd);
            }
            var toRemove = tokenDifference(oldClasses, newClasses);
            if (toRemove && toRemove.length) {
              $animate.removeClass(this.$$element, toRemove);
            }
          },
          $set: function(key, value, writeAttr, attrName) {
            var node = this.$$element[0],
                booleanKey = getBooleanAttrName(node, key),
                aliasedKey = getAliasedAttrName(node, key),
                observer = key,
                nodeName;
            if (booleanKey) {
              this.$$element.prop(key, value);
              attrName = booleanKey;
            } else if (aliasedKey) {
              this[aliasedKey] = value;
              observer = aliasedKey;
            }
            this[key] = value;
            if (attrName) {
              this.$attr[key] = attrName;
            } else {
              attrName = this.$attr[key];
              if (!attrName) {
                this.$attr[key] = attrName = snake_case(key, '-');
              }
            }
            nodeName = nodeName_(this.$$element);
            if ((nodeName === 'a' && key === 'href') || (nodeName === 'img' && key === 'src')) {
              this[key] = value = $$sanitizeUri(value, key === 'src');
            } else if (nodeName === 'img' && key === 'srcset') {
              var result = "";
              var trimmedSrcset = trim(value);
              var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
              var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
              var rawUris = trimmedSrcset.split(pattern);
              var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
              for (var i = 0; i < nbrUrisWith2parts; i++) {
                var innerIdx = i * 2;
                result += $$sanitizeUri(trim(rawUris[innerIdx]), true);
                result += (" " + trim(rawUris[innerIdx + 1]));
              }
              var lastTuple = trim(rawUris[i * 2]).split(/\s/);
              result += $$sanitizeUri(trim(lastTuple[0]), true);
              if (lastTuple.length === 2) {
                result += (" " + trim(lastTuple[1]));
              }
              this[key] = value = result;
            }
            if (writeAttr !== false) {
              if (value === null || value === undefined) {
                this.$$element.removeAttr(attrName);
              } else {
                this.$$element.attr(attrName, value);
              }
            }
            var $$observers = this.$$observers;
            $$observers && forEach($$observers[observer], function(fn) {
              try {
                fn(value);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          },
          $observe: function(key, fn) {
            var attrs = this,
                $$observers = (attrs.$$observers || (attrs.$$observers = createMap())),
                listeners = ($$observers[key] || ($$observers[key] = []));
            listeners.push(fn);
            $rootScope.$evalAsync(function() {
              if (!listeners.$$inter && attrs.hasOwnProperty(key)) {
                fn(attrs[key]);
              }
            });
            return function() {
              arrayRemove(listeners, fn);
            };
          }
        };
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {}
        }
        var startSymbol = $interpolate.startSymbol(),
            endSymbol = $interpolate.endSymbol(),
            denormalizeTemplate = (startSymbol == '{{' || endSymbol == '}}') ? identity : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
            },
            NG_ATTR_BINDING = /^ngAttr[A-Z]/;
        compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
          var bindings = $element.data('$binding') || [];
          if (isArray(binding)) {
            bindings = bindings.concat(binding);
          } else {
            bindings.push(binding);
          }
          $element.data('$binding', bindings);
        } : noop;
        compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
          safeAddClass($element, 'ng-binding');
        } : noop;
        compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
          var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
          $element.data(dataName, scope);
        } : noop;
        compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
          safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
        } : noop;
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          forEach($compileNodes, function(node, index) {
            if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/)) {
              $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];
            }
          });
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          compile.$$addScopeClass($compileNodes);
          var namespace = null;
          return function publicLinkFn(scope, cloneConnectFn, options) {
            assertArg(scope, 'scope');
            options = options || {};
            var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
                transcludeControllers = options.transcludeControllers,
                futureParentElement = options.futureParentElement;
            if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
              parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
            }
            if (!namespace) {
              namespace = detectNamespaceForChildElements(futureParentElement);
            }
            var $linkNode;
            if (namespace !== 'html') {
              $linkNode = jqLite(wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html()));
            } else if (cloneConnectFn) {
              $linkNode = JQLitePrototype.clone.call($compileNodes);
            } else {
              $linkNode = $compileNodes;
            }
            if (transcludeControllers) {
              for (var controllerName in transcludeControllers) {
                $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
              }
            }
            compile.$$addScopeInfo($linkNode, scope);
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
            return $linkNode;
          };
        }
        function detectNamespaceForChildElements(parentElement) {
          var node = parentElement && parentElement[0];
          if (!node) {
            return 'html';
          } else {
            return nodeName_(node) !== 'foreignobject' && node.toString().match(/SVG/) ? 'svg' : 'html';
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [],
              attrs,
              directives,
              nodeLinkFn,
              childNodes,
              childLinkFn,
              linkFnFound,
              nodeLinkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
            nodeLinkFn = (directives.length) ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              compile.$$addScopeClass(attrs.$$element);
            }
            childLinkFn = (nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length) ? null : compileNodes(childNodes, nodeLinkFn ? ((nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude) : transcludeFn);
            if (nodeLinkFn || childLinkFn) {
              linkFns.push(i, nodeLinkFn, childLinkFn);
              linkFnFound = true;
              nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
            }
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
            var nodeLinkFn,
                childLinkFn,
                node,
                childScope,
                i,
                ii,
                idx,
                childBoundTranscludeFn;
            var stableNodeList;
            if (nodeLinkFnFound) {
              var nodeListLength = nodeList.length;
              stableNodeList = new Array(nodeListLength);
              for (i = 0; i < linkFns.length; i += 3) {
                idx = linkFns[i];
                stableNodeList[idx] = nodeList[idx];
              }
            } else {
              stableNodeList = nodeList;
            }
            for (i = 0, ii = linkFns.length; i < ii; ) {
              node = stableNodeList[linkFns[i++]];
              nodeLinkFn = linkFns[i++];
              childLinkFn = linkFns[i++];
              if (nodeLinkFn) {
                if (nodeLinkFn.scope) {
                  childScope = scope.$new();
                  compile.$$addScopeInfo(jqLite(node), childScope);
                } else {
                  childScope = scope;
                }
                if (nodeLinkFn.transcludeOnThisElement) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn, nodeLinkFn.elementTranscludeOnThisElement);
                } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
                  childBoundTranscludeFn = parentBoundTranscludeFn;
                } else if (!parentBoundTranscludeFn && transcludeFn) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);
                } else {
                  childBoundTranscludeFn = null;
                }
                nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn);
              } else if (childLinkFn) {
                childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
              }
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn, elementTransclusion) {
          var boundTranscludeFn = function(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
            if (!transcludedScope) {
              transcludedScope = scope.$new(false, containingScope);
              transcludedScope.$$transcluded = true;
            }
            return transcludeFn(transcludedScope, cloneFn, {
              parentBoundTranscludeFn: previousBoundTranscludeFn,
              transcludeControllers: controllers,
              futureParentElement: futureParentElement
            });
          };
          return boundTranscludeFn;
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType,
              attrsMap = attrs.$attr,
              match,
              className;
          switch (nodeType) {
            case NODE_TYPE_ELEMENT:
              addDirective(directives, directiveNormalize(nodeName_(node)), 'E', maxPriority, ignoreDirective);
              for (var attr,
                  name,
                  nName,
                  ngAttrName,
                  value,
                  isNgAttr,
                  nAttrs = node.attributes,
                  j = 0,
                  jj = nAttrs && nAttrs.length; j < jj; j++) {
                var attrStartName = false;
                var attrEndName = false;
                attr = nAttrs[j];
                name = attr.name;
                value = trim(attr.value);
                ngAttrName = directiveNormalize(name);
                if (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) {
                  name = snake_case(ngAttrName.substr(6), '-');
                }
                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                if (directiveIsMultiElement(directiveNName)) {
                  if (ngAttrName === directiveNName + 'Start') {
                    attrStartName = name;
                    attrEndName = name.substr(0, name.length - 5) + 'end';
                    name = name.substr(0, name.length - 6);
                  }
                }
                nName = directiveNormalize(name.toLowerCase());
                attrsMap[nName] = name;
                if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                  attrs[nName] = value;
                  if (getBooleanAttrName(node, nName)) {
                    attrs[nName] = true;
                  }
                }
                addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
              }
              className = node.className;
              if (isString(className) && className !== '') {
                while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                  nName = directiveNormalize(match[2]);
                  if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[3]);
                  }
                  className = className.substr(match.index + match[0].length);
                }
              }
              break;
            case NODE_TYPE_TEXT:
              addTextInterpolateDirective(directives, node.nodeValue);
              break;
            case NODE_TYPE_COMMENT:
              try {
                match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
                if (match) {
                  nName = directiveNormalize(match[1]);
                  if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[2]);
                  }
                }
              } catch (e) {}
              break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            do {
              if (!node) {
                throw $compileMinErr('uterdir', "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
              }
              if (node.nodeType == NODE_TYPE_ELEMENT) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function(scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE,
              newScopeDirective,
              controllerDirectives = previousCompileContext.controllerDirectives,
              controllers,
              newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
              templateDirective = previousCompileContext.templateDirective,
              nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
              hasTranscludeDirective = false,
              hasTemplate = false,
              hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
              $compileNode = templateAttrs.$$element = jqLite(compileNode),
              directive,
              directiveName,
              $template,
              replaceDirective = originalReplaceDirective,
              childTranscludeFn = transcludeFn,
              linkFn,
              directiveValue;
          for (var i = 0,
              ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = undefined;
            if (terminalPriority > directive.priority) {
              break;
            }
            if (directiveValue = directive.scope) {
              if (!directive.templateUrl) {
                if (isObject(directiveValue)) {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective, directive, $compileNode);
                  newIsolateScopeDirective = directive;
                } else {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                }
              }
              newScopeDirective = newScopeDirective || directive;
            }
            directiveName = directive.name;
            if (!directive.templateUrl && directive.controller) {
              directiveValue = directive.controller;
              controllerDirectives = controllerDirectives || {};
              assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            if (directiveValue = directive.transclude) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue == 'element') {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = $compileNode;
                $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, sliceArgs($template), compileNode);
                childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {nonTlbTranscludeDirective: nonTlbTranscludeDirective});
              } else {
                $template = jqLite(jqLiteClone(compileNode)).contents();
                $compileNode.empty();
                childTranscludeFn = compile($template, transcludeFn);
              }
            }
            if (directive.template) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = (isFunction(directive.template)) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                if (jqLiteIsTextNode(directiveValue)) {
                  $template = [];
                } else {
                  $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
                }
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                  throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}", directiveName, '');
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = {$attr: {}};
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                if (isFunction(linkFn)) {
                  addLinkFns(null, linkFn, attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
          nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective;
          nodeLinkFn.templateOnThisElement = hasTemplate;
          nodeLinkFn.transclude = childTranscludeFn;
          previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart, attrEnd) {
            if (pre) {
              if (attrStart)
                pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
              pre.require = directive.require;
              pre.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, {isolateScope: true});
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart)
                post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
              post.require = directive.require;
              post.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, {isolateScope: true});
              }
              postLinkFns.push(post);
            }
          }
          function getControllers(directiveName, require, $element, elementControllers) {
            var value,
                retrievalMethod = 'data',
                optional = false;
            var $searchElement = $element;
            var match;
            if (isString(require)) {
              match = require.match(REQUIRE_PREFIX_REGEXP);
              require = require.substring(match[0].length);
              if (match[3]) {
                if (match[1])
                  match[3] = null;
                else
                  match[1] = match[3];
              }
              if (match[1] === '^') {
                retrievalMethod = 'inheritedData';
              } else if (match[1] === '^^') {
                retrievalMethod = 'inheritedData';
                $searchElement = $element.parent();
              }
              if (match[2] === '?') {
                optional = true;
              }
              value = null;
              if (elementControllers && retrievalMethod === 'data') {
                if (value = elementControllers[require]) {
                  value = value.instance;
                }
              }
              value = value || $searchElement[retrievalMethod]('$' + require + 'Controller');
              if (!value && !optional) {
                throw $compileMinErr('ctreq', "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
              }
              return value || null;
            } else if (isArray(require)) {
              value = [];
              forEach(require, function(require) {
                value.push(getControllers(directiveName, require, $element, elementControllers));
              });
            }
            return value;
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
            var i,
                ii,
                linkFn,
                controller,
                isolateScope,
                elementControllers,
                transcludeFn,
                $element,
                attrs;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
              $element = templateAttrs.$$element;
            } else {
              $element = jqLite(linkNode);
              attrs = new Attributes($element, templateAttrs);
            }
            if (newIsolateScopeDirective) {
              isolateScope = scope.$new(true);
            }
            if (boundTranscludeFn) {
              transcludeFn = controllersBoundTransclude;
              transcludeFn.$$boundTransclude = boundTranscludeFn;
            }
            if (controllerDirectives) {
              controllers = {};
              elementControllers = {};
              forEach(controllerDirectives, function(directive) {
                var locals = {
                  $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                  $element: $element,
                  $attrs: attrs,
                  $transclude: transcludeFn
                },
                    controllerInstance;
                controller = directive.controller;
                if (controller == '@') {
                  controller = attrs[directive.name];
                }
                controllerInstance = $controller(controller, locals, true, directive.controllerAs);
                elementControllers[directive.name] = controllerInstance;
                if (!hasElementTranscludeDirective) {
                  $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
                }
                controllers[directive.name] = controllerInstance;
              });
            }
            if (newIsolateScopeDirective) {
              compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective)));
              compile.$$addScopeClass($element, true);
              var isolateScopeController = controllers && controllers[newIsolateScopeDirective.name];
              var isolateBindingContext = isolateScope;
              if (isolateScopeController && isolateScopeController.identifier && newIsolateScopeDirective.bindToController === true) {
                isolateBindingContext = isolateScopeController.instance;
              }
              forEach(isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings, function(definition, scopeName) {
                var attrName = definition.attrName,
                    optional = definition.optional,
                    mode = definition.mode,
                    lastValue,
                    parentGet,
                    parentSet,
                    compare;
                switch (mode) {
                  case '@':
                    attrs.$observe(attrName, function(value) {
                      isolateBindingContext[scopeName] = value;
                    });
                    attrs.$$observers[attrName].$$scope = scope;
                    if (attrs[attrName]) {
                      isolateBindingContext[scopeName] = $interpolate(attrs[attrName])(scope);
                    }
                    break;
                  case '=':
                    if (optional && !attrs[attrName]) {
                      return;
                    }
                    parentGet = $parse(attrs[attrName]);
                    if (parentGet.literal) {
                      compare = equals;
                    } else {
                      compare = function(a, b) {
                        return a === b || (a !== a && b !== b);
                      };
                    }
                    parentSet = parentGet.assign || function() {
                      lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                      throw $compileMinErr('nonassign', "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name);
                    };
                    lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                    var parentValueWatch = function parentValueWatch(parentValue) {
                      if (!compare(parentValue, isolateBindingContext[scopeName])) {
                        if (!compare(parentValue, lastValue)) {
                          isolateBindingContext[scopeName] = parentValue;
                        } else {
                          parentSet(scope, parentValue = isolateBindingContext[scopeName]);
                        }
                      }
                      return lastValue = parentValue;
                    };
                    parentValueWatch.$stateful = true;
                    var unwatch;
                    if (definition.collection) {
                      unwatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
                    } else {
                      unwatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
                    }
                    isolateScope.$on('$destroy', unwatch);
                    break;
                  case '&':
                    parentGet = $parse(attrs[attrName]);
                    isolateBindingContext[scopeName] = function(locals) {
                      return parentGet(scope, locals);
                    };
                    break;
                }
              });
            }
            if (controllers) {
              forEach(controllers, function(controller) {
                controller();
              });
              controllers = null;
            }
            for (i = 0, ii = preLinkFns.length; i < ii; i++) {
              linkFn = preLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
            for (i = postLinkFns.length - 1; i >= 0; i--) {
              linkFn = postLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
              var transcludeControllers;
              if (!isScope(scope)) {
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope;
                scope = undefined;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              if (!futureParentElement) {
                futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
              }
              return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
            }
          }
        }
        function markDirectivesAsIsolate(directives) {
          for (var j = 0,
              jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], {$$isolateScope: true});
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive,
                directives = $injector.get(name + Suffix),
                i = 0,
                ii = directives.length; i < ii; i++) {
              try {
                directive = directives[i];
                if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                  if (startAttrName) {
                    directive = inherit(directive, {
                      $$start: startAttrName,
                      $$end: endAttrName
                    });
                  }
                  tDirectives.push(directive);
                  match = directive;
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }
          return match;
        }
        function directiveIsMultiElement(name) {
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive,
                directives = $injector.get(name + Suffix),
                i = 0,
                ii = directives.length; i < ii; i++) {
              directive = directives[i];
              if (directive.multiElement) {
                return true;
              }
            }
          }
          return false;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr,
              dstAttr = dst.$attr,
              $element = dst.$$element;
          forEach(dst, function(value, key) {
            if (key.charAt(0) != '$') {
              if (src[key] && src[key] !== value) {
                value += (key === 'style' ? ';' : ' ') + src[key];
              }
              dst.$set(key, value, true, srcAttr[key]);
            }
          });
          forEach(src, function(value, key) {
            if (key == 'class') {
              safeAddClass($element, value);
              dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
            } else if (key == 'style') {
              $element.attr('style', $element.attr('style') + ';' + value);
              dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
            } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
              dst[key] = value;
              dstAttr[key] = srcAttr[key];
            }
          });
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [],
              afterTemplateNodeLinkFn,
              afterTemplateChildLinkFn,
              beforeTemplateCompileNode = $compileNode[0],
              origAsyncDirective = directives.shift(),
              derivedSyncDirective = extend({}, origAsyncDirective, {
                templateUrl: null,
                transclude: null,
                replace: null,
                $$originalDirective: origAsyncDirective
              }),
              templateUrl = (isFunction(origAsyncDirective.templateUrl)) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl,
              templateNamespace = origAsyncDirective.templateNamespace;
          $compileNode.empty();
          $templateRequest($sce.getTrustedResourceUrl(templateUrl)).then(function(content) {
            var compileNode,
                tempTemplateAttrs,
                $template,
                childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              if (jqLiteIsTextNode(content)) {
                $template = [];
              } else {
                $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
              }
              compileNode = $template[0];
              if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = {$attr: {}};
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectivesAsIsolate(templateDirectives);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function(node, i) {
              if (node == compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(),
                  beforeTemplateLinkNode = linkQueue.shift(),
                  linkRootElement = linkQueue.shift(),
                  boundTranscludeFn = linkQueue.shift(),
                  linkNode = $compileNode[0];
              if (scope.$$destroyed)
                continue;
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                var oldClasses = beforeTemplateLinkNode.className;
                if (!(previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace)) {
                  linkNode = jqLiteClone(compileNode);
                }
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                safeAddClass(jqLite(linkNode), oldClasses);
              }
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
            }
            linkQueue = null;
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            var childBoundTranscludeFn = boundTranscludeFn;
            if (scope.$$destroyed)
              return;
            if (linkQueue) {
              linkQueue.push(scope, node, rootElement, childBoundTranscludeFn);
            } else {
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return (a.name < b.name) ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          if (previousDirective) {
            throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', previousDirective.name, directive.name, what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: function textInterpolateCompileFn(templateNode) {
                var templateNodeParent = templateNode.parent(),
                    hasCompileParent = !!templateNodeParent.length;
                if (hasCompileParent)
                  compile.$$addBindingClass(templateNodeParent);
                return function textInterpolateLinkFn(scope, node) {
                  var parent = node.parent();
                  if (!hasCompileParent)
                    compile.$$addBindingClass(parent);
                  compile.$$addBindingInfo(parent, interpolateFn.expressions);
                  scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                    node[0].nodeValue = value;
                  });
                };
              }
            });
          }
        }
        function wrapTemplate(type, template) {
          type = lowercase(type || 'html');
          switch (type) {
            case 'svg':
            case 'math':
              var wrapper = document.createElement('div');
              wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
              return wrapper.childNodes[0].childNodes;
            default:
              return template;
          }
        }
        function getTrustedContext(node, attrNormalizedName) {
          if (attrNormalizedName == "srcdoc") {
            return $sce.HTML;
          }
          var tag = nodeName_(node);
          if (attrNormalizedName == "xlinkHref" || (tag == "form" && attrNormalizedName == "action") || (tag != "img" && (attrNormalizedName == "src" || attrNormalizedName == "ngSrc"))) {
            return $sce.RESOURCE_URL;
          }
        }
        function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
          var interpolateFn = $interpolate(value, true);
          if (!interpolateFn)
            return;
          if (name === "multiple" && nodeName_(node) === "select") {
            throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
          }
          directives.push({
            priority: 100,
            compile: function() {
              return {pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = (attr.$$observers || (attr.$$observers = {}));
                  if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                    throw $compileMinErr('nodomevents', "Interpolations for HTML DOM event attributes are disallowed.  Please use the " + "ng- versions (such as ng-click instead of onclick) instead.");
                  }
                  if (!attr[name]) {
                    return;
                  }
                  interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name), ALL_OR_NOTHING_ATTRS[name] || allOrNothing);
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    if (name === 'class' && newValue != oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
                }};
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0],
              removeCount = elementsToRemove.length,
              parent = firstElementToRemove.parentNode,
              i,
              ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] == firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i,
                    j2 = j + removeCount - 1,
                    jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                if ($rootElement.context === firstElementToRemove) {
                  $rootElement.context = newNode;
                }
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = document.createDocumentFragment();
          fragment.appendChild(firstElementToRemove);
          jqLite(newNode).data(jqLite(firstElementToRemove).data());
          if (!jQuery) {
            delete jqLite.cache[firstElementToRemove[jqLite.expando]];
          } else {
            skipDestroyOnNextJQueryCleanData = true;
            jQuery.cleanData([firstElementToRemove]);
          }
          for (var k = 1,
              kk = elementsToRemove.length; k < kk; k++) {
            var element = elementsToRemove[k];
            jqLite(element).remove();
            fragment.appendChild(element);
            delete elementsToRemove[k];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function() {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
        function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
          try {
            linkFn(scope, $element, attrs, controllers, transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }
      }];
    }
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    function directiveNormalize(name) {
      return camelCase(name.replace(PREFIX_REGEXP, ''));
    }
    function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {}
    function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {}
    function tokenDifference(str1, str2) {
      var values = '',
          tokens1 = str1.split(/\s+/),
          tokens2 = str2.split(/\s+/);
      outer: for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token == tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? ' ' : '') + token;
      }
      return values;
    }
    function removeComments(jqNodes) {
      jqNodes = jqLite(jqNodes);
      var i = jqNodes.length;
      if (i <= 1) {
        return jqNodes;
      }
      while (i--) {
        var node = jqNodes[i];
        if (node.nodeType === NODE_TYPE_COMMENT) {
          splice.call(jqNodes, i, 1);
        }
      }
      return jqNodes;
    }
    function $ControllerProvider() {
      var controllers = {},
          globals = false,
          CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
      this.register = function(name, constructor) {
        assertNotHasOwnProperty(name, 'controller');
        if (isObject(name)) {
          extend(controllers, name);
        } else {
          controllers[name] = constructor;
        }
      };
      this.allowGlobals = function() {
        globals = true;
      };
      this.$get = ['$injector', '$window', function($injector, $window) {
        return function(expression, locals, later, ident) {
          var instance,
              match,
              constructor,
              identifier;
          later = later === true;
          if (ident && isString(ident)) {
            identifier = ident;
          }
          if (isString(expression)) {
            match = expression.match(CNTRL_REG), constructor = match[1], identifier = identifier || match[3];
            expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || (globals ? getter($window, constructor, true) : undefined);
            assertArgFn(expression, constructor, true);
          }
          if (later) {
            var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
            instance = Object.create(controllerPrototype);
            if (identifier) {
              addIdentifier(locals, identifier, instance, constructor || expression.name);
            }
            return extend(function() {
              $injector.invoke(expression, instance, locals, constructor);
              return instance;
            }, {
              instance: instance,
              identifier: identifier
            });
          }
          instance = $injector.instantiate(expression, locals, constructor);
          if (identifier) {
            addIdentifier(locals, identifier, instance, constructor || expression.name);
          }
          return instance;
        };
        function addIdentifier(locals, identifier, instance, name) {
          if (!(locals && isObject(locals.$scope))) {
            throw minErr('$controller')('noscp', "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
          }
          locals.$scope[identifier] = instance;
        }
      }];
    }
    function $DocumentProvider() {
      this.$get = ['$window', function(window) {
        return jqLite(window.document);
      }];
    }
    function $ExceptionHandlerProvider() {
      this.$get = ['$log', function($log) {
        return function(exception, cause) {
          $log.error.apply($log, arguments);
        };
      }];
    }
    var APPLICATION_JSON = 'application/json';
    var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
    var JSON_START = /^\s*(\[|\{[^\{])/;
    var JSON_END = /[\}\]]\s*$/;
    var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
    function defaultHttpResponseTransform(data, headers) {
      if (isString(data)) {
        data = data.replace(JSON_PROTECTION_PREFIX, '');
        var contentType = headers('Content-Type');
        if ((contentType && contentType.indexOf(APPLICATION_JSON) === 0 && data.trim()) || (JSON_START.test(data) && JSON_END.test(data))) {
          data = fromJson(data);
        }
      }
      return data;
    }
    function parseHeaders(headers) {
      var parsed = createMap(),
          key,
          val,
          i;
      if (!headers)
        return parsed;
      forEach(headers.split('\n'), function(line) {
        i = line.indexOf(':');
        key = lowercase(trim(line.substr(0, i)));
        val = trim(line.substr(i + 1));
        if (key) {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      });
      return parsed;
    }
    function headersGetter(headers) {
      var headersObj = isObject(headers) ? headers : undefined;
      return function(name) {
        if (!headersObj)
          headersObj = parseHeaders(headers);
        if (name) {
          var value = headersObj[lowercase(name)];
          if (value === void 0) {
            value = null;
          }
          return value;
        }
        return headersObj;
      };
    }
    function transformData(data, headers, fns) {
      if (isFunction(fns))
        return fns(data, headers);
      forEach(fns, function(fn) {
        data = fn(data, headers);
      });
      return data;
    }
    function isSuccess(status) {
      return 200 <= status && status < 300;
    }
    function $HttpProvider() {
      var defaults = this.defaults = {
        transformResponse: [defaultHttpResponseTransform],
        transformRequest: [function(d) {
          return isObject(d) && !isFile(d) && !isBlob(d) ? toJson(d) : d;
        }],
        headers: {
          common: {'Accept': 'application/json, text/plain, */*'},
          post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
      };
      var useApplyAsync = false;
      this.useApplyAsync = function(value) {
        if (isDefined(value)) {
          useApplyAsync = !!value;
          return this;
        }
        return useApplyAsync;
      };
      var interceptorFactories = this.interceptors = [];
      this.$get = ['$httpBackend', '$browser', '$cacheFactory', '$rootScope', '$q', '$injector', function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
        var defaultCache = $cacheFactory('$http');
        var reversedInterceptors = [];
        forEach(interceptorFactories, function(interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        function $http(requestConfig) {
          var config = {
            method: 'get',
            transformRequest: defaults.transformRequest,
            transformResponse: defaults.transformResponse
          };
          var headers = mergeHeaders(requestConfig);
          if (!angular.isObject(requestConfig)) {
            throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
          }
          extend(config, requestConfig);
          config.headers = headers;
          config.method = uppercase(config.method);
          var serverRequest = function(config) {
            headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
            if (isUndefined(reqData)) {
              forEach(headers, function(value, header) {
                if (lowercase(header) === 'content-type') {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
              config.withCredentials = defaults.withCredentials;
            }
            return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
          };
          var chain = [serverRequest, undefined];
          var promise = $q.when(config);
          forEach(reversedInterceptors, function(interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push(interceptor.response, interceptor.responseError);
            }
          });
          while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();
            promise = promise.then(thenFn, rejectFn);
          }
          promise.success = function(fn) {
            promise.then(function(response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          promise.error = function(fn) {
            promise.then(null, function(response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          return promise;
          function transformResponse(response) {
            var resp = extend({}, response);
            if (!response.data) {
              resp.data = response.data;
            } else {
              resp.data = transformData(response.data, response.headers, config.transformResponse);
            }
            return (isSuccess(response.status)) ? resp : $q.reject(resp);
          }
          function mergeHeaders(config) {
            var defHeaders = defaults.headers,
                reqHeaders = extend({}, config.headers),
                defHeaderName,
                lowercaseDefHeaderName,
                reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
            defaultHeadersIteration: for (defHeaderName in defHeaders) {
              lowercaseDefHeaderName = lowercase(defHeaderName);
              for (reqHeaderName in reqHeaders) {
                if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                  continue defaultHeadersIteration;
                }
              }
              reqHeaders[defHeaderName] = defHeaders[defHeaderName];
            }
            execHeaders(reqHeaders);
            return reqHeaders;
            function execHeaders(headers) {
              var headerContent;
              forEach(headers, function(headerFn, header) {
                if (isFunction(headerFn)) {
                  headerContent = headerFn();
                  if (headerContent != null) {
                    headers[header] = headerContent;
                  } else {
                    delete headers[header];
                  }
                }
              });
            }
          }
        }
        $http.pendingRequests = [];
        createShortMethods('get', 'delete', 'head', 'jsonp');
        createShortMethodsWithData('post', 'put', 'patch');
        $http.defaults = defaults;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function(name) {
            $http[name] = function(url, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function(name) {
            $http[name] = function(url, data, config) {
              return $http(extend(config || {}, {
                method: name,
                url: url,
                data: data
              }));
            };
          });
        }
        function sendReq(config, reqData, reqHeaders) {
          var deferred = $q.defer(),
              promise = deferred.promise,
              cache,
              cachedResp,
              url = buildUrl(config.url, config.params);
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults.cache) && config.cache !== false && (config.method === 'GET' || config.method === 'JSONP')) {
            cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (isPromiseLike(cachedResp)) {
                cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
                } else {
                  resolvePromise(cachedResp, 200, {}, 'OK');
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
            if (xsrfValue) {
              reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
            }
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
          }
          return promise;
          function done(status, response, headersString, statusText) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [status, response, parseHeaders(headersString), statusText]);
              } else {
                cache.remove(url);
              }
            }
            function resolveHttpPromise() {
              resolvePromise(response, status, headersString, statusText);
            }
            if (useApplyAsync) {
              $rootScope.$applyAsync(resolveHttpPromise);
            } else {
              resolveHttpPromise();
              if (!$rootScope.$$phase)
                $rootScope.$apply();
            }
          }
          function resolvePromise(response, status, headers, statusText) {
            status = Math.max(status, 0);
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status: status,
              headers: headersGetter(headers),
              config: config,
              statusText: statusText
            });
          }
          function resolvePromiseWithResult(result) {
            resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
          }
          function removePendingReq() {
            var idx = $http.pendingRequests.indexOf(config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, params) {
          if (!params)
            return url;
          var parts = [];
          forEachSorted(params, function(value, key) {
            if (value === null || isUndefined(value))
              return;
            if (!isArray(value))
              value = [value];
            forEach(value, function(v) {
              if (isObject(v)) {
                if (isDate(v)) {
                  v = v.toISOString();
                } else {
                  v = toJson(v);
                }
              }
              parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
            });
          });
          if (parts.length > 0) {
            url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
          }
          return url;
        }
      }];
    }
    function createXhr() {
      return new window.XMLHttpRequest();
    }
    function $HttpBackendProvider() {
      this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
      }];
    }
    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
      return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
        $browser.$$incOutstandingRequestCount();
        url = url || $browser.url();
        if (lowercase(method) == 'jsonp') {
          var callbackId = '_' + (callbacks.counter++).toString(36);
          callbacks[callbackId] = function(data) {
            callbacks[callbackId].data = data;
            callbacks[callbackId].called = true;
          };
          var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), callbackId, function(status, text) {
            completeRequest(callback, status, callbacks[callbackId].data, "", text);
            callbacks[callbackId] = noop;
          });
        } else {
          var xhr = createXhr();
          xhr.open(method, url, true);
          forEach(headers, function(value, key) {
            if (isDefined(value)) {
              xhr.setRequestHeader(key, value);
            }
          });
          xhr.onload = function requestLoaded() {
            var statusText = xhr.statusText || '';
            var response = ('response' in xhr) ? xhr.response : xhr.responseText;
            var status = xhr.status === 1223 ? 204 : xhr.status;
            if (status === 0) {
              status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
            }
            completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
          };
          var requestError = function() {
            completeRequest(callback, -1, null, null, '');
          };
          xhr.onerror = requestError;
          xhr.onabort = requestError;
          if (withCredentials) {
            xhr.withCredentials = true;
          }
          if (responseType) {
            try {
              xhr.responseType = responseType;
            } catch (e) {
              if (responseType !== 'json') {
                throw e;
              }
            }
          }
          xhr.send(post || null);
        }
        if (timeout > 0) {
          var timeoutId = $browserDefer(timeoutRequest, timeout);
        } else if (isPromiseLike(timeout)) {
          timeout.then(timeoutRequest);
        }
        function timeoutRequest() {
          jsonpDone && jsonpDone();
          xhr && xhr.abort();
        }
        function completeRequest(callback, status, response, headersString, statusText) {
          if (timeoutId !== undefined) {
            $browserDefer.cancel(timeoutId);
          }
          jsonpDone = xhr = null;
          callback(status, response, headersString, statusText);
          $browser.$$completeOutstandingRequest(noop);
        }
      };
      function jsonpReq(url, callbackId, done) {
        var script = rawDocument.createElement('script'),
            callback = null;
        script.type = "text/javascript";
        script.src = url;
        script.async = true;
        callback = function(event) {
          removeEventListenerFn(script, "load", callback);
          removeEventListenerFn(script, "error", callback);
          rawDocument.body.removeChild(script);
          script = null;
          var status = -1;
          var text = "unknown";
          if (event) {
            if (event.type === "load" && !callbacks[callbackId].called) {
              event = {type: "error"};
            }
            text = event.type;
            status = event.type === "error" ? 404 : 200;
          }
          if (done) {
            done(status, text);
          }
        };
        addEventListenerFn(script, "load", callback);
        addEventListenerFn(script, "error", callback);
        rawDocument.body.appendChild(script);
        return callback;
      }
    }
    var $interpolateMinErr = minErr('$interpolate');
    function $InterpolateProvider() {
      var startSymbol = '{{';
      var endSymbol = '}}';
      this.startSymbol = function(value) {
        if (value) {
          startSymbol = value;
          return this;
        } else {
          return startSymbol;
        }
      };
      this.endSymbol = function(value) {
        if (value) {
          endSymbol = value;
          return this;
        } else {
          return endSymbol;
        }
      };
      this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length,
            endSymbolLength = endSymbol.length,
            escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
            escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');
        function escape(ch) {
          return '\\\\\\' + ch;
        }
        function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
          allOrNothing = !!allOrNothing;
          var startIndex,
              endIndex,
              index = 0,
              expressions = [],
              parseFns = [],
              textLength = text.length,
              exp,
              concat = [],
              expressionPositions = [];
          while (index < textLength) {
            if (((startIndex = text.indexOf(startSymbol, index)) != -1) && ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1)) {
              if (index !== startIndex) {
                concat.push(unescapeText(text.substring(index, startIndex)));
              }
              exp = text.substring(startIndex + startSymbolLength, endIndex);
              expressions.push(exp);
              parseFns.push($parse(exp, parseStringifyInterceptor));
              index = endIndex + endSymbolLength;
              expressionPositions.push(concat.length);
              concat.push('');
            } else {
              if (index !== textLength) {
                concat.push(unescapeText(text.substring(index)));
              }
              break;
            }
          }
          if (trustedContext && concat.length > 1) {
            throw $interpolateMinErr('noconcat', "Error while interpolating: {0}\nStrict Contextual Escaping disallows " + "interpolations that concatenate multiple expressions when a trusted value is " + "required.  See http://docs.angularjs.org/api/ng.$sce", text);
          }
          if (!mustHaveExpression || expressions.length) {
            var compute = function(values) {
              for (var i = 0,
                  ii = expressions.length; i < ii; i++) {
                if (allOrNothing && isUndefined(values[i]))
                  return;
                concat[expressionPositions[i]] = values[i];
              }
              return concat.join('');
            };
            var getValue = function(value) {
              return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value);
            };
            var stringify = function(value) {
              if (value == null) {
                return '';
              }
              switch (typeof value) {
                case 'string':
                  break;
                case 'number':
                  value = '' + value;
                  break;
                default:
                  value = toJson(value);
              }
              return value;
            };
            return extend(function interpolationFn(context) {
              var i = 0;
              var ii = expressions.length;
              var values = new Array(ii);
              try {
                for (; i < ii; i++) {
                  values[i] = parseFns[i](context);
                }
                return compute(values);
              } catch (err) {
                var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text, err.toString());
                $exceptionHandler(newErr);
              }
            }, {
              exp: text,
              expressions: expressions,
              $$watchDelegate: function(scope, listener, objectEquality) {
                var lastValue;
                return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
                  var currValue = compute(values);
                  if (isFunction(listener)) {
                    listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
                  }
                  lastValue = currValue;
                }, objectEquality);
              }
            });
          }
          function unescapeText(text) {
            return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
          }
          function parseStringifyInterceptor(value) {
            try {
              value = getValue(value);
              return allOrNothing && !isDefined(value) ? value : stringify(value);
            } catch (err) {
              var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text, err.toString());
              $exceptionHandler(newErr);
            }
          }
        }
        $interpolate.startSymbol = function() {
          return startSymbol;
        };
        $interpolate.endSymbol = function() {
          return endSymbol;
        };
        return $interpolate;
      }];
    }
    function $IntervalProvider() {
      this.$get = ['$rootScope', '$window', '$q', '$$q', function($rootScope, $window, $q, $$q) {
        var intervals = {};
        function interval(fn, delay, count, invokeApply) {
          var setInterval = $window.setInterval,
              clearInterval = $window.clearInterval,
              iteration = 0,
              skipApply = (isDefined(invokeApply) && !invokeApply),
              deferred = (skipApply ? $$q : $q).defer(),
              promise = deferred.promise;
          count = isDefined(count) ? count : 0;
          promise.then(null, null, fn);
          promise.$$intervalId = setInterval(function tick() {
            deferred.notify(iteration++);
            if (count > 0 && iteration >= count) {
              deferred.resolve(iteration);
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          intervals[promise.$$intervalId] = deferred;
          return promise;
        }
        interval.cancel = function(promise) {
          if (promise && promise.$$intervalId in intervals) {
            intervals[promise.$$intervalId].reject('canceled');
            $window.clearInterval(promise.$$intervalId);
            delete intervals[promise.$$intervalId];
            return true;
          }
          return false;
        };
        return interval;
      }];
    }
    function $LocaleProvider() {
      this.$get = function() {
        return {
          id: 'en-us',
          NUMBER_FORMATS: {
            DECIMAL_SEP: '.',
            GROUP_SEP: ',',
            PATTERNS: [{
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            }, {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\u00A4',
              posSuf: '',
              negPre: '(\u00A4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }],
            CURRENCY_SYM: '$'
          },
          DATETIME_FORMATS: {
            MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
            SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
            DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
            SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
            AMPMS: ['AM', 'PM'],
            medium: 'MMM d, y h:mm:ss a',
            'short': 'M/d/yy h:mm a',
            fullDate: 'EEEE, MMMM d, y',
            longDate: 'MMMM d, y',
            mediumDate: 'MMM d, y',
            shortDate: 'M/d/yy',
            mediumTime: 'h:mm:ss a',
            shortTime: 'h:mm a'
          },
          pluralCat: function(num) {
            if (num === 1) {
              return 'one';
            }
            return 'other';
          }
        };
      };
    }
    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        DEFAULT_PORTS = {
          'http': 80,
          'https': 443,
          'ftp': 21
        };
    var $locationMinErr = minErr('$location');
    function encodePath(path) {
      var segments = path.split('/'),
          i = segments.length;
      while (i--) {
        segments[i] = encodeUriSegment(segments[i]);
      }
      return segments.join('/');
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj) {
      var parsedUrl = urlResolve(absoluteUrl);
      locationObj.$$protocol = parsedUrl.protocol;
      locationObj.$$host = parsedUrl.hostname;
      locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj) {
      var prefixed = (relativeUrl.charAt(0) !== '/');
      if (prefixed) {
        relativeUrl = '/' + relativeUrl;
      }
      var match = urlResolve(relativeUrl);
      locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
      locationObj.$$search = parseKeyValue(match.search);
      locationObj.$$hash = decodeURIComponent(match.hash);
      if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
        locationObj.$$path = '/' + locationObj.$$path;
      }
    }
    function beginsWith(begin, whole) {
      if (whole.indexOf(begin) === 0) {
        return whole.substr(begin.length);
      }
    }
    function stripHash(url) {
      var index = url.indexOf('#');
      return index == -1 ? url : url.substr(0, index);
    }
    function trimEmptyHash(url) {
      return url.replace(/(#.+)|#$/, '$1');
    }
    function stripFile(url) {
      return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
    }
    function serverBase(url) {
      return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
    }
    function LocationHtml5Url(appBase, basePrefix) {
      this.$$html5 = true;
      basePrefix = basePrefix || '';
      var appBaseNoFile = stripFile(appBase);
      parseAbsoluteUrl(appBase, this);
      this.$$parse = function(url) {
        var pathUrl = beginsWith(appBaseNoFile, url);
        if (!isString(pathUrl)) {
          throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
        }
        parseAppUrl(pathUrl, this);
        if (!this.$$path) {
          this.$$path = '/';
        }
        this.$$compose();
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
      };
      this.$$parseLinkUrl = function(url, relHref) {
        if (relHref && relHref[0] === '#') {
          this.hash(relHref.slice(1));
          return true;
        }
        var appUrl,
            prevAppUrl;
        var rewrittenUrl;
        if ((appUrl = beginsWith(appBase, url)) !== undefined) {
          prevAppUrl = appUrl;
          if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
            rewrittenUrl = appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
          } else {
            rewrittenUrl = appBase + prevAppUrl;
          }
        } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
          rewrittenUrl = appBaseNoFile + appUrl;
        } else if (appBaseNoFile == url + '/') {
          rewrittenUrl = appBaseNoFile;
        }
        if (rewrittenUrl) {
          this.$$parse(rewrittenUrl);
        }
        return !!rewrittenUrl;
      };
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
      var appBaseNoFile = stripFile(appBase);
      parseAbsoluteUrl(appBase, this);
      this.$$parse = function(url) {
        var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
        var withoutHashUrl;
        if (withoutBaseUrl.charAt(0) === '#') {
          withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl);
          if (isUndefined(withoutHashUrl)) {
            withoutHashUrl = withoutBaseUrl;
          }
        } else {
          withoutHashUrl = this.$$html5 ? withoutBaseUrl : '';
        }
        parseAppUrl(withoutHashUrl, this);
        this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
        this.$$compose();
        function removeWindowsDriveName(path, url, base) {
          var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
          var firstPathSegmentMatch;
          if (url.indexOf(base) === 0) {
            url = url.replace(base, '');
          }
          if (windowsFilePathExp.exec(url)) {
            return path;
          }
          firstPathSegmentMatch = windowsFilePathExp.exec(path);
          return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
        }
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
      };
      this.$$parseLinkUrl = function(url, relHref) {
        if (stripHash(appBase) == stripHash(url)) {
          this.$$parse(url);
          return true;
        }
        return false;
      };
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
      this.$$html5 = true;
      LocationHashbangUrl.apply(this, arguments);
      var appBaseNoFile = stripFile(appBase);
      this.$$parseLinkUrl = function(url, relHref) {
        if (relHref && relHref[0] === '#') {
          this.hash(relHref.slice(1));
          return true;
        }
        var rewrittenUrl;
        var appUrl;
        if (appBase == stripHash(url)) {
          rewrittenUrl = url;
        } else if ((appUrl = beginsWith(appBaseNoFile, url))) {
          rewrittenUrl = appBase + hashPrefix + appUrl;
        } else if (appBaseNoFile === url + '/') {
          rewrittenUrl = appBaseNoFile;
        }
        if (rewrittenUrl) {
          this.$$parse(rewrittenUrl);
        }
        return !!rewrittenUrl;
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBase + hashPrefix + this.$$url;
      };
    }
    var locationPrototype = {
      $$html5: false,
      $$replace: false,
      absUrl: locationGetter('$$absUrl'),
      url: function(url) {
        if (isUndefined(url))
          return this.$$url;
        var match = PATH_MATCH.exec(url);
        if (match[1] || url === '')
          this.path(decodeURIComponent(match[1]));
        if (match[2] || match[1] || url === '')
          this.search(match[3] || '');
        this.hash(match[5] || '');
        return this;
      },
      protocol: locationGetter('$$protocol'),
      host: locationGetter('$$host'),
      port: locationGetter('$$port'),
      path: locationGetterSetter('$$path', function(path) {
        path = path !== null ? path.toString() : '';
        return path.charAt(0) == '/' ? path : '/' + path;
      }),
      search: function(search, paramValue) {
        switch (arguments.length) {
          case 0:
            return this.$$search;
          case 1:
            if (isString(search) || isNumber(search)) {
              search = search.toString();
              this.$$search = parseKeyValue(search);
            } else if (isObject(search)) {
              search = copy(search, {});
              forEach(search, function(value, key) {
                if (value == null)
                  delete search[key];
              });
              this.$$search = search;
            } else {
              throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
            }
            break;
          default:
            if (isUndefined(paramValue) || paramValue === null) {
              delete this.$$search[search];
            } else {
              this.$$search[search] = paramValue;
            }
        }
        this.$$compose();
        return this;
      },
      hash: locationGetterSetter('$$hash', function(hash) {
        return hash !== null ? hash.toString() : '';
      }),
      replace: function() {
        this.$$replace = true;
        return this;
      }
    };
    forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
      Location.prototype = Object.create(locationPrototype);
      Location.prototype.state = function(state) {
        if (!arguments.length)
          return this.$$state;
        if (Location !== LocationHtml5Url || !this.$$html5) {
          throw $locationMinErr('nostate', 'History API state support is available only ' + 'in HTML5 mode and only in browsers supporting HTML5 History API');
        }
        this.$$state = isUndefined(state) ? null : state;
        return this;
      };
    });
    function locationGetter(property) {
      return function() {
        return this[property];
      };
    }
    function locationGetterSetter(property, preprocess) {
      return function(value) {
        if (isUndefined(value))
          return this[property];
        this[property] = preprocess(value);
        this.$$compose();
        return this;
      };
    }
    function $LocationProvider() {
      var hashPrefix = '',
          html5Mode = {
            enabled: false,
            requireBase: true,
            rewriteLinks: true
          };
      this.hashPrefix = function(prefix) {
        if (isDefined(prefix)) {
          hashPrefix = prefix;
          return this;
        } else {
          return hashPrefix;
        }
      };
      this.html5Mode = function(mode) {
        if (isBoolean(mode)) {
          html5Mode.enabled = mode;
          return this;
        } else if (isObject(mode)) {
          if (isBoolean(mode.enabled)) {
            html5Mode.enabled = mode.enabled;
          }
          if (isBoolean(mode.requireBase)) {
            html5Mode.requireBase = mode.requireBase;
          }
          if (isBoolean(mode.rewriteLinks)) {
            html5Mode.rewriteLinks = mode.rewriteLinks;
          }
          return this;
        } else {
          return html5Mode;
        }
      };
      this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', function($rootScope, $browser, $sniffer, $rootElement) {
        var $location,
            LocationMode,
            baseHref = $browser.baseHref(),
            initialUrl = $browser.url(),
            appBase;
        if (html5Mode.enabled) {
          if (!baseHref && html5Mode.requireBase) {
            throw $locationMinErr('nobase', "$location in HTML5 mode requires a <base> tag to be present!");
          }
          appBase = serverBase(initialUrl) + (baseHref || '/');
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        $location = new LocationMode(appBase, '#' + hashPrefix);
        $location.$$parseLinkUrl(initialUrl, initialUrl);
        $location.$$state = $browser.state();
        var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
        function setBrowserUrlWithFallback(url, replace, state) {
          var oldUrl = $location.url();
          var oldState = $location.$$state;
          try {
            $browser.url(url, replace, state);
            $location.$$state = $browser.state();
          } catch (e) {
            $location.url(oldUrl);
            $location.$$state = oldState;
            throw e;
          }
        }
        $rootElement.on('click', function(event) {
          if (!html5Mode.rewriteLinks || event.ctrlKey || event.metaKey || event.which == 2)
            return;
          var elm = jqLite(event.target);
          while (nodeName_(elm[0]) !== 'a') {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          var absHref = elm.prop('href');
          var relHref = elm.attr('href') || elm.attr('xlink:href');
          if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
            absHref = urlResolve(absHref.animVal).href;
          }
          if (IGNORE_URI_REGEXP.test(absHref))
            return;
          if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
            if ($location.$$parseLinkUrl(absHref, relHref)) {
              event.preventDefault();
              if ($location.absUrl() != $browser.url()) {
                $rootScope.$apply();
                window.angular['ff-684208-preventDefault'] = true;
              }
            }
          }
        });
        if ($location.absUrl() != initialUrl) {
          $browser.url($location.absUrl(), true);
        }
        var initializing = true;
        $browser.onUrlChange(function(newUrl, newState) {
          $rootScope.$evalAsync(function() {
            var oldUrl = $location.absUrl();
            var oldState = $location.$$state;
            var defaultPrevented;
            $location.$$parse(newUrl);
            $location.$$state = newState;
            defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, newState, oldState).defaultPrevented;
            if ($location.absUrl() !== newUrl)
              return;
            if (defaultPrevented) {
              $location.$$parse(oldUrl);
              $location.$$state = oldState;
              setBrowserUrlWithFallback(oldUrl, false, oldState);
            } else {
              initializing = false;
              afterLocationChange(oldUrl, oldState);
            }
          });
          if (!$rootScope.$$phase)
            $rootScope.$digest();
        });
        $rootScope.$watch(function $locationWatch() {
          var oldUrl = trimEmptyHash($browser.url());
          var newUrl = trimEmptyHash($location.absUrl());
          var oldState = $browser.state();
          var currentReplace = $location.$$replace;
          var urlOrStateChanged = oldUrl !== newUrl || ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);
          if (initializing || urlOrStateChanged) {
            initializing = false;
            $rootScope.$evalAsync(function() {
              var newUrl = $location.absUrl();
              var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
              if ($location.absUrl() !== newUrl)
                return;
              if (defaultPrevented) {
                $location.$$parse(oldUrl);
                $location.$$state = oldState;
              } else {
                if (urlOrStateChanged) {
                  setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state);
                }
                afterLocationChange(oldUrl, oldState);
              }
            });
          }
          $location.$$replace = false;
        });
        return $location;
        function afterLocationChange(oldUrl, oldState) {
          $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl, $location.$$state, oldState);
        }
      }];
    }
    function $LogProvider() {
      var debug = true,
          self = this;
      this.debugEnabled = function(flag) {
        if (isDefined(flag)) {
          debug = flag;
          return this;
        } else {
          return debug;
        }
      };
      this.$get = ['$window', function($window) {
        return {
          log: consoleLog('log'),
          info: consoleLog('info'),
          warn: consoleLog('warn'),
          error: consoleLog('error'),
          debug: (function() {
            var fn = consoleLog('debug');
            return function() {
              if (debug) {
                fn.apply(self, arguments);
              }
            };
          }())
        };
        function formatError(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        }
        function consoleLog(type) {
          var console = $window.console || {},
              logFn = console[type] || console.log || noop,
              hasApply = false;
          try {
            hasApply = !!logFn.apply;
          } catch (e) {}
          if (hasApply) {
            return function() {
              var args = [];
              forEach(arguments, function(arg) {
                args.push(formatError(arg));
              });
              return logFn.apply(console, args);
            };
          }
          return function(arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
          };
        }
      }];
    }
    var $parseMinErr = minErr('$parse');
    function ensureSafeMemberName(name, fullExpression) {
      if (name === "__defineGetter__" || name === "__defineSetter__" || name === "__lookupGetter__" || name === "__lookupSetter__" || name === "__proto__") {
        throw $parseMinErr('isecfld', 'Attempting to access a disallowed field in Angular expressions! ' + 'Expression: {0}', fullExpression);
      }
      return name;
    }
    function ensureSafeObject(obj, fullExpression) {
      if (obj) {
        if (obj.constructor === obj) {
          throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.window === obj) {
          throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
          throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj === Object) {
          throw $parseMinErr('isecobj', 'Referencing Object in Angular expressions is disallowed! Expression: {0}', fullExpression);
        }
      }
      return obj;
    }
    var CALL = Function.prototype.call;
    var APPLY = Function.prototype.apply;
    var BIND = Function.prototype.bind;
    function ensureSafeFunction(obj, fullExpression) {
      if (obj) {
        if (obj.constructor === obj) {
          throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj === CALL || obj === APPLY || obj === BIND) {
          throw $parseMinErr('isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}', fullExpression);
        }
      }
    }
    var CONSTANTS = createMap();
    forEach({
      'null': function() {
        return null;
      },
      'true': function() {
        return true;
      },
      'false': function() {
        return false;
      },
      'undefined': function() {}
    }, function(constantGetter, name) {
      constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = true;
      CONSTANTS[name] = constantGetter;
    });
    CONSTANTS['this'] = function(self) {
      return self;
    };
    CONSTANTS['this'].sharedGetter = true;
    var OPERATORS = extend(createMap(), {
      '+': function(self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        if (isDefined(a)) {
          if (isDefined(b)) {
            return a + b;
          }
          return a;
        }
        return isDefined(b) ? b : undefined;
      },
      '-': function(self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
      },
      '*': function(self, locals, a, b) {
        return a(self, locals) * b(self, locals);
      },
      '/': function(self, locals, a, b) {
        return a(self, locals) / b(self, locals);
      },
      '%': function(self, locals, a, b) {
        return a(self, locals) % b(self, locals);
      },
      '===': function(self, locals, a, b) {
        return a(self, locals) === b(self, locals);
      },
      '!==': function(self, locals, a, b) {
        return a(self, locals) !== b(self, locals);
      },
      '==': function(self, locals, a, b) {
        return a(self, locals) == b(self, locals);
      },
      '!=': function(self, locals, a, b) {
        return a(self, locals) != b(self, locals);
      },
      '<': function(self, locals, a, b) {
        return a(self, locals) < b(self, locals);
      },
      '>': function(self, locals, a, b) {
        return a(self, locals) > b(self, locals);
      },
      '<=': function(self, locals, a, b) {
        return a(self, locals) <= b(self, locals);
      },
      '>=': function(self, locals, a, b) {
        return a(self, locals) >= b(self, locals);
      },
      '&&': function(self, locals, a, b) {
        return a(self, locals) && b(self, locals);
      },
      '||': function(self, locals, a, b) {
        return a(self, locals) || b(self, locals);
      },
      '!': function(self, locals, a) {
        return !a(self, locals);
      },
      '=': true,
      '|': true
    });
    var ESCAPE = {
      "n": "\n",
      "f": "\f",
      "r": "\r",
      "t": "\t",
      "v": "\v",
      "'": "'",
      '"': '"'
    };
    var Lexer = function(options) {
      this.options = options;
    };
    Lexer.prototype = {
      constructor: Lexer,
      lex: function(text) {
        this.text = text;
        this.index = 0;
        this.tokens = [];
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          if (ch === '"' || ch === "'") {
            this.readString(ch);
          } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
            this.readNumber();
          } else if (this.isIdent(ch)) {
            this.readIdent();
          } else if (this.is(ch, '(){}[].,;:?')) {
            this.tokens.push({
              index: this.index,
              text: ch
            });
            this.index++;
          } else if (this.isWhitespace(ch)) {
            this.index++;
          } else {
            var ch2 = ch + this.peek();
            var ch3 = ch2 + this.peek(2);
            var op1 = OPERATORS[ch];
            var op2 = OPERATORS[ch2];
            var op3 = OPERATORS[ch3];
            if (op1 || op2 || op3) {
              var token = op3 ? ch3 : (op2 ? ch2 : ch);
              this.tokens.push({
                index: this.index,
                text: token,
                operator: true
              });
              this.index += token.length;
            } else {
              this.throwError('Unexpected next character ', this.index, this.index + 1);
            }
          }
        }
        return this.tokens;
      },
      is: function(ch, chars) {
        return chars.indexOf(ch) !== -1;
      },
      peek: function(i) {
        var num = i || 1;
        return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
      },
      isNumber: function(ch) {
        return ('0' <= ch && ch <= '9') && typeof ch === "string";
      },
      isWhitespace: function(ch) {
        return (ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === '\u00A0');
      },
      isIdent: function(ch) {
        return ('a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$');
      },
      isExpOperator: function(ch) {
        return (ch === '-' || ch === '+' || this.isNumber(ch));
      },
      throwError: function(error, start, end) {
        end = end || this.index;
        var colStr = (isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end);
        throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
      },
      readNumber: function() {
        var number = '';
        var start = this.index;
        while (this.index < this.text.length) {
          var ch = lowercase(this.text.charAt(this.index));
          if (ch == '.' || this.isNumber(ch)) {
            number += ch;
          } else {
            var peekCh = this.peek();
            if (ch == 'e' && this.isExpOperator(peekCh)) {
              number += ch;
            } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
              number += ch;
            } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
              this.throwError('Invalid exponent');
            } else {
              break;
            }
          }
          this.index++;
        }
        this.tokens.push({
          index: start,
          text: number,
          constant: true,
          value: Number(number)
        });
      },
      readIdent: function() {
        var start = this.index;
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          if (!(this.isIdent(ch) || this.isNumber(ch))) {
            break;
          }
          this.index++;
        }
        this.tokens.push({
          index: start,
          text: this.text.slice(start, this.index),
          identifier: true
        });
      },
      readString: function(quote) {
        var start = this.index;
        this.index++;
        var string = '';
        var rawString = quote;
        var escape = false;
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          rawString += ch;
          if (escape) {
            if (ch === 'u') {
              var hex = this.text.substring(this.index + 1, this.index + 5);
              if (!hex.match(/[\da-f]{4}/i))
                this.throwError('Invalid unicode escape [\\u' + hex + ']');
              this.index += 4;
              string += String.fromCharCode(parseInt(hex, 16));
            } else {
              var rep = ESCAPE[ch];
              string = string + (rep || ch);
            }
            escape = false;
          } else if (ch === '\\') {
            escape = true;
          } else if (ch === quote) {
            this.index++;
            this.tokens.push({
              index: start,
              text: rawString,
              constant: true,
              value: string
            });
            return;
          } else {
            string += ch;
          }
          this.index++;
        }
        this.throwError('Unterminated quote', start);
      }
    };
    function isConstant(exp) {
      return exp.constant;
    }
    var Parser = function(lexer, $filter, options) {
      this.lexer = lexer;
      this.$filter = $filter;
      this.options = options;
    };
    Parser.ZERO = extend(function() {
      return 0;
    }, {
      sharedGetter: true,
      constant: true
    });
    Parser.prototype = {
      constructor: Parser,
      parse: function(text) {
        this.text = text;
        this.tokens = this.lexer.lex(text);
        var value = this.statements();
        if (this.tokens.length !== 0) {
          this.throwError('is an unexpected token', this.tokens[0]);
        }
        value.literal = !!value.literal;
        value.constant = !!value.constant;
        return value;
      },
      primary: function() {
        var primary;
        if (this.expect('(')) {
          primary = this.filterChain();
          this.consume(')');
        } else if (this.expect('[')) {
          primary = this.arrayDeclaration();
        } else if (this.expect('{')) {
          primary = this.object();
        } else if (this.peek().identifier) {
          primary = this.identifier();
        } else if (this.peek().constant) {
          primary = this.constant();
        } else {
          this.throwError('not a primary expression', this.peek());
        }
        var next,
            context;
        while ((next = this.expect('(', '[', '.'))) {
          if (next.text === '(') {
            primary = this.functionCall(primary, context);
            context = null;
          } else if (next.text === '[') {
            context = primary;
            primary = this.objectIndex(primary);
          } else if (next.text === '.') {
            context = primary;
            primary = this.fieldAccess(primary);
          } else {
            this.throwError('IMPOSSIBLE');
          }
        }
        return primary;
      },
      throwError: function(msg, token) {
        throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
      },
      peekToken: function() {
        if (this.tokens.length === 0)
          throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        return this.tokens[0];
      },
      peek: function(e1, e2, e3, e4) {
        return this.peekAhead(0, e1, e2, e3, e4);
      },
      peekAhead: function(i, e1, e2, e3, e4) {
        if (this.tokens.length > i) {
          var token = this.tokens[i];
          var t = token.text;
          if (t === e1 || t === e2 || t === e3 || t === e4 || (!e1 && !e2 && !e3 && !e4)) {
            return token;
          }
        }
        return false;
      },
      expect: function(e1, e2, e3, e4) {
        var token = this.peek(e1, e2, e3, e4);
        if (token) {
          this.tokens.shift();
          return token;
        }
        return false;
      },
      consume: function(e1) {
        if (this.tokens.length === 0) {
          throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        }
        var token = this.expect(e1);
        if (!token) {
          this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
        }
        return token;
      },
      unaryFn: function(op, right) {
        var fn = OPERATORS[op];
        return extend(function $parseUnaryFn(self, locals) {
          return fn(self, locals, right);
        }, {
          constant: right.constant,
          inputs: [right]
        });
      },
      binaryFn: function(left, op, right, isBranching) {
        var fn = OPERATORS[op];
        return extend(function $parseBinaryFn(self, locals) {
          return fn(self, locals, left, right);
        }, {
          constant: left.constant && right.constant,
          inputs: !isBranching && [left, right]
        });
      },
      identifier: function() {
        var id = this.consume().text;
        while (this.peek('.') && this.peekAhead(1).identifier && !this.peekAhead(2, '(')) {
          id += this.consume().text + this.consume().text;
        }
        return CONSTANTS[id] || getterFn(id, this.options, this.text);
      },
      constant: function() {
        var value = this.consume().value;
        return extend(function $parseConstant() {
          return value;
        }, {
          constant: true,
          literal: true
        });
      },
      statements: function() {
        var statements = [];
        while (true) {
          if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
            statements.push(this.filterChain());
          if (!this.expect(';')) {
            return (statements.length === 1) ? statements[0] : function $parseStatements(self, locals) {
              var value;
              for (var i = 0,
                  ii = statements.length; i < ii; i++) {
                value = statements[i](self, locals);
              }
              return value;
            };
          }
        }
      },
      filterChain: function() {
        var left = this.expression();
        var token;
        while ((token = this.expect('|'))) {
          left = this.filter(left);
        }
        return left;
      },
      filter: function(inputFn) {
        var fn = this.$filter(this.consume().text);
        var argsFn;
        var args;
        if (this.peek(':')) {
          argsFn = [];
          args = [];
          while (this.expect(':')) {
            argsFn.push(this.expression());
          }
        }
        var inputs = [inputFn].concat(argsFn || []);
        return extend(function $parseFilter(self, locals) {
          var input = inputFn(self, locals);
          if (args) {
            args[0] = input;
            var i = argsFn.length;
            while (i--) {
              args[i + 1] = argsFn[i](self, locals);
            }
            return fn.apply(undefined, args);
          }
          return fn(input);
        }, {
          constant: !fn.$stateful && inputs.every(isConstant),
          inputs: !fn.$stateful && inputs
        });
      },
      expression: function() {
        return this.assignment();
      },
      assignment: function() {
        var left = this.ternary();
        var right;
        var token;
        if ((token = this.expect('='))) {
          if (!left.assign) {
            this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
          }
          right = this.ternary();
          return extend(function $parseAssignment(scope, locals) {
            return left.assign(scope, right(scope, locals), locals);
          }, {inputs: [left, right]});
        }
        return left;
      },
      ternary: function() {
        var left = this.logicalOR();
        var middle;
        var token;
        if ((token = this.expect('?'))) {
          middle = this.assignment();
          if (this.consume(':')) {
            var right = this.assignment();
            return extend(function $parseTernary(self, locals) {
              return left(self, locals) ? middle(self, locals) : right(self, locals);
            }, {constant: left.constant && middle.constant && right.constant});
          }
        }
        return left;
      },
      logicalOR: function() {
        var left = this.logicalAND();
        var token;
        while ((token = this.expect('||'))) {
          left = this.binaryFn(left, token.text, this.logicalAND(), true);
        }
        return left;
      },
      logicalAND: function() {
        var left = this.equality();
        var token;
        while ((token = this.expect('&&'))) {
          left = this.binaryFn(left, token.text, this.equality(), true);
        }
        return left;
      },
      equality: function() {
        var left = this.relational();
        var token;
        while ((token = this.expect('==', '!=', '===', '!=='))) {
          left = this.binaryFn(left, token.text, this.relational());
        }
        return left;
      },
      relational: function() {
        var left = this.additive();
        var token;
        while ((token = this.expect('<', '>', '<=', '>='))) {
          left = this.binaryFn(left, token.text, this.additive());
        }
        return left;
      },
      additive: function() {
        var left = this.multiplicative();
        var token;
        while ((token = this.expect('+', '-'))) {
          left = this.binaryFn(left, token.text, this.multiplicative());
        }
        return left;
      },
      multiplicative: function() {
        var left = this.unary();
        var token;
        while ((token = this.expect('*', '/', '%'))) {
          left = this.binaryFn(left, token.text, this.unary());
        }
        return left;
      },
      unary: function() {
        var token;
        if (this.expect('+')) {
          return this.primary();
        } else if ((token = this.expect('-'))) {
          return this.binaryFn(Parser.ZERO, token.text, this.unary());
        } else if ((token = this.expect('!'))) {
          return this.unaryFn(token.text, this.unary());
        } else {
          return this.primary();
        }
      },
      fieldAccess: function(object) {
        var expression = this.text;
        var field = this.consume().text;
        var getter = getterFn(field, this.options, expression);
        return extend(function $parseFieldAccess(scope, locals, self) {
          return getter(self || object(scope, locals));
        }, {assign: function(scope, value, locals) {
            var o = object(scope, locals);
            if (!o)
              object.assign(scope, o = {});
            return setter(o, field, value, expression);
          }});
      },
      objectIndex: function(obj) {
        var expression = this.text;
        var indexFn = this.expression();
        this.consume(']');
        return extend(function $parseObjectIndex(self, locals) {
          var o = obj(self, locals),
              i = indexFn(self, locals),
              v;
          ensureSafeMemberName(i, expression);
          if (!o)
            return undefined;
          v = ensureSafeObject(o[i], expression);
          return v;
        }, {assign: function(self, value, locals) {
            var key = ensureSafeMemberName(indexFn(self, locals), expression);
            var o = ensureSafeObject(obj(self, locals), expression);
            if (!o)
              obj.assign(self, o = {});
            return o[key] = value;
          }});
      },
      functionCall: function(fnGetter, contextGetter) {
        var argsFn = [];
        if (this.peekToken().text !== ')') {
          do {
            argsFn.push(this.expression());
          } while (this.expect(','));
        }
        this.consume(')');
        var expressionText = this.text;
        var args = argsFn.length ? [] : null;
        return function $parseFunctionCall(scope, locals) {
          var context = contextGetter ? contextGetter(scope, locals) : isDefined(contextGetter) ? undefined : scope;
          var fn = fnGetter(scope, locals, context) || noop;
          if (args) {
            var i = argsFn.length;
            while (i--) {
              args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
            }
          }
          ensureSafeObject(context, expressionText);
          ensureSafeFunction(fn, expressionText);
          var v = fn.apply ? fn.apply(context, args) : fn(args[0], args[1], args[2], args[3], args[4]);
          return ensureSafeObject(v, expressionText);
        };
      },
      arrayDeclaration: function() {
        var elementFns = [];
        if (this.peekToken().text !== ']') {
          do {
            if (this.peek(']')) {
              break;
            }
            elementFns.push(this.expression());
          } while (this.expect(','));
        }
        this.consume(']');
        return extend(function $parseArrayLiteral(self, locals) {
          var array = [];
          for (var i = 0,
              ii = elementFns.length; i < ii; i++) {
            array.push(elementFns[i](self, locals));
          }
          return array;
        }, {
          literal: true,
          constant: elementFns.every(isConstant),
          inputs: elementFns
        });
      },
      object: function() {
        var keys = [],
            valueFns = [];
        if (this.peekToken().text !== '}') {
          do {
            if (this.peek('}')) {
              break;
            }
            var token = this.consume();
            if (token.constant) {
              keys.push(token.value);
            } else if (token.identifier) {
              keys.push(token.text);
            } else {
              this.throwError("invalid key", token);
            }
            this.consume(':');
            valueFns.push(this.expression());
          } while (this.expect(','));
        }
        this.consume('}');
        return extend(function $parseObjectLiteral(self, locals) {
          var object = {};
          for (var i = 0,
              ii = valueFns.length; i < ii; i++) {
            object[keys[i]] = valueFns[i](self, locals);
          }
          return object;
        }, {
          literal: true,
          constant: valueFns.every(isConstant),
          inputs: valueFns
        });
      }
    };
    function setter(obj, path, setValue, fullExp) {
      ensureSafeObject(obj, fullExp);
      var element = path.split('.'),
          key;
      for (var i = 0; element.length > 1; i++) {
        key = ensureSafeMemberName(element.shift(), fullExp);
        var propertyObj = ensureSafeObject(obj[key], fullExp);
        if (!propertyObj) {
          propertyObj = {};
          obj[key] = propertyObj;
        }
        obj = propertyObj;
      }
      key = ensureSafeMemberName(element.shift(), fullExp);
      ensureSafeObject(obj[key], fullExp);
      obj[key] = setValue;
      return setValue;
    }
    var getterFnCacheDefault = createMap();
    var getterFnCacheExpensive = createMap();
    function isPossiblyDangerousMemberName(name) {
      return name == 'constructor';
    }
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, expensiveChecks) {
      ensureSafeMemberName(key0, fullExp);
      ensureSafeMemberName(key1, fullExp);
      ensureSafeMemberName(key2, fullExp);
      ensureSafeMemberName(key3, fullExp);
      ensureSafeMemberName(key4, fullExp);
      var eso = function(o) {
        return ensureSafeObject(o, fullExp);
      };
      var eso0 = (expensiveChecks || isPossiblyDangerousMemberName(key0)) ? eso : identity;
      var eso1 = (expensiveChecks || isPossiblyDangerousMemberName(key1)) ? eso : identity;
      var eso2 = (expensiveChecks || isPossiblyDangerousMemberName(key2)) ? eso : identity;
      var eso3 = (expensiveChecks || isPossiblyDangerousMemberName(key3)) ? eso : identity;
      var eso4 = (expensiveChecks || isPossiblyDangerousMemberName(key4)) ? eso : identity;
      return function cspSafeGetter(scope, locals) {
        var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
        if (pathVal == null)
          return pathVal;
        pathVal = eso0(pathVal[key0]);
        if (!key1)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = eso1(pathVal[key1]);
        if (!key2)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = eso2(pathVal[key2]);
        if (!key3)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = eso3(pathVal[key3]);
        if (!key4)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = eso4(pathVal[key4]);
        return pathVal;
      };
    }
    function getterFnWithEnsureSafeObject(fn, fullExpression) {
      return function(s, l) {
        return fn(s, l, ensureSafeObject, fullExpression);
      };
    }
    function getterFn(path, options, fullExp) {
      var expensiveChecks = options.expensiveChecks;
      var getterFnCache = (expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault);
      var fn = getterFnCache[path];
      if (fn)
        return fn;
      var pathKeys = path.split('.'),
          pathKeysLength = pathKeys.length;
      if (options.csp) {
        if (pathKeysLength < 6) {
          fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, expensiveChecks);
        } else {
          fn = function cspSafeGetter(scope, locals) {
            var i = 0,
                val;
            do {
              val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, expensiveChecks)(scope, locals);
              locals = undefined;
              scope = val;
            } while (i < pathKeysLength);
            return val;
          };
        }
      } else {
        var code = '';
        if (expensiveChecks) {
          code += 's = eso(s, fe);\nl = eso(l, fe);\n';
        }
        var needsEnsureSafeObject = expensiveChecks;
        forEach(pathKeys, function(key, index) {
          ensureSafeMemberName(key, fullExp);
          var lookupJs = (index ? 's' : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + '.' + key;
          if (expensiveChecks || isPossiblyDangerousMemberName(key)) {
            lookupJs = 'eso(' + lookupJs + ', fe)';
            needsEnsureSafeObject = true;
          }
          code += 'if(s == null) return undefined;\n' + 's=' + lookupJs + ';\n';
        });
        code += 'return s;';
        var evaledFnGetter = new Function('s', 'l', 'eso', 'fe', code);
        evaledFnGetter.toString = valueFn(code);
        if (needsEnsureSafeObject) {
          evaledFnGetter = getterFnWithEnsureSafeObject(evaledFnGetter, fullExp);
        }
        fn = evaledFnGetter;
      }
      fn.sharedGetter = true;
      fn.assign = function(self, value) {
        return setter(self, path, value, path);
      };
      getterFnCache[path] = fn;
      return fn;
    }
    var objectValueOf = Object.prototype.valueOf;
    function getValueOf(value) {
      return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
    }
    function $ParseProvider() {
      var cacheDefault = createMap();
      var cacheExpensive = createMap();
      this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {
        var $parseOptions = {
          csp: $sniffer.csp,
          expensiveChecks: false
        },
            $parseOptionsExpensive = {
              csp: $sniffer.csp,
              expensiveChecks: true
            };
        function wrapSharedExpression(exp) {
          var wrapped = exp;
          if (exp.sharedGetter) {
            wrapped = function $parseWrapper(self, locals) {
              return exp(self, locals);
            };
            wrapped.literal = exp.literal;
            wrapped.constant = exp.constant;
            wrapped.assign = exp.assign;
          }
          return wrapped;
        }
        return function $parse(exp, interceptorFn, expensiveChecks) {
          var parsedExpression,
              oneTime,
              cacheKey;
          switch (typeof exp) {
            case 'string':
              cacheKey = exp = exp.trim();
              var cache = (expensiveChecks ? cacheExpensive : cacheDefault);
              parsedExpression = cache[cacheKey];
              if (!parsedExpression) {
                if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
                  oneTime = true;
                  exp = exp.substring(2);
                }
                var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions;
                var lexer = new Lexer(parseOptions);
                var parser = new Parser(lexer, $filter, parseOptions);
                parsedExpression = parser.parse(exp);
                if (parsedExpression.constant) {
                  parsedExpression.$$watchDelegate = constantWatchDelegate;
                } else if (oneTime) {
                  parsedExpression = wrapSharedExpression(parsedExpression);
                  parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
                } else if (parsedExpression.inputs) {
                  parsedExpression.$$watchDelegate = inputsWatchDelegate;
                }
                cache[cacheKey] = parsedExpression;
              }
              return addInterceptor(parsedExpression, interceptorFn);
            case 'function':
              return addInterceptor(exp, interceptorFn);
            default:
              return addInterceptor(noop, interceptorFn);
          }
        };
        function collectExpressionInputs(inputs, list) {
          for (var i = 0,
              ii = inputs.length; i < ii; i++) {
            var input = inputs[i];
            if (!input.constant) {
              if (input.inputs) {
                collectExpressionInputs(input.inputs, list);
              } else if (list.indexOf(input) === -1) {
                list.push(input);
              }
            }
          }
          return list;
        }
        function expressionInputDirtyCheck(newValue, oldValueOfValue) {
          if (newValue == null || oldValueOfValue == null) {
            return newValue === oldValueOfValue;
          }
          if (typeof newValue === 'object') {
            newValue = getValueOf(newValue);
            if (typeof newValue === 'object') {
              return false;
            }
          }
          return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
        }
        function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var inputExpressions = parsedExpression.$$inputs || (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));
          var lastResult;
          if (inputExpressions.length === 1) {
            var oldInputValue = expressionInputDirtyCheck;
            inputExpressions = inputExpressions[0];
            return scope.$watch(function expressionInputWatch(scope) {
              var newInputValue = inputExpressions(scope);
              if (!expressionInputDirtyCheck(newInputValue, oldInputValue)) {
                lastResult = parsedExpression(scope);
                oldInputValue = newInputValue && getValueOf(newInputValue);
              }
              return lastResult;
            }, listener, objectEquality);
          }
          var oldInputValueOfValues = [];
          for (var i = 0,
              ii = inputExpressions.length; i < ii; i++) {
            oldInputValueOfValues[i] = expressionInputDirtyCheck;
          }
          return scope.$watch(function expressionInputsWatch(scope) {
            var changed = false;
            for (var i = 0,
                ii = inputExpressions.length; i < ii; i++) {
              var newInputValue = inputExpressions[i](scope);
              if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
                oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
              }
            }
            if (changed) {
              lastResult = parsedExpression(scope);
            }
            return lastResult;
          }, listener, objectEquality);
        }
        function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch,
              lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            if (isDefined(value)) {
              scope.$$postDigest(function() {
                if (isDefined(lastValue)) {
                  unwatch();
                }
              });
            }
          }, objectEquality);
        }
        function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch,
              lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.call(this, value, old, scope);
            }
            if (isAllDefined(value)) {
              scope.$$postDigest(function() {
                if (isAllDefined(lastValue))
                  unwatch();
              });
            }
          }, objectEquality);
          function isAllDefined(value) {
            var allDefined = true;
            forEach(value, function(val) {
              if (!isDefined(val))
                allDefined = false;
            });
            return allDefined;
          }
        }
        function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch;
          return unwatch = scope.$watch(function constantWatch(scope) {
            return parsedExpression(scope);
          }, function constantListener(value, old, scope) {
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            unwatch();
          }, objectEquality);
        }
        function addInterceptor(parsedExpression, interceptorFn) {
          if (!interceptorFn)
            return parsedExpression;
          var watchDelegate = parsedExpression.$$watchDelegate;
          var regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate;
          var fn = regularWatch ? function regularInterceptedExpression(scope, locals) {
            var value = parsedExpression(scope, locals);
            return interceptorFn(value, scope, locals);
          } : function oneTimeInterceptedExpression(scope, locals) {
            var value = parsedExpression(scope, locals);
            var result = interceptorFn(value, scope, locals);
            return isDefined(value) ? result : value;
          };
          if (parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
            fn.$$watchDelegate = parsedExpression.$$watchDelegate;
          } else if (!interceptorFn.$stateful) {
            fn.$$watchDelegate = inputsWatchDelegate;
            fn.inputs = [parsedExpression];
          }
          return fn;
        }
      }];
    }
    function $QProvider() {
      this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
        return qFactory(function(callback) {
          $rootScope.$evalAsync(callback);
        }, $exceptionHandler);
      }];
    }
    function $$QProvider() {
      this.$get = ['$browser', '$exceptionHandler', function($browser, $exceptionHandler) {
        return qFactory(function(callback) {
          $browser.defer(callback);
        }, $exceptionHandler);
      }];
    }
    function qFactory(nextTick, exceptionHandler) {
      var $qMinErr = minErr('$q', TypeError);
      function callOnce(self, resolveFn, rejectFn) {
        var called = false;
        function wrap(fn) {
          return function(value) {
            if (called)
              return;
            called = true;
            fn.call(self, value);
          };
        }
        return [wrap(resolveFn), wrap(rejectFn)];
      }
      var defer = function() {
        return new Deferred();
      };
      function Promise() {
        this.$$state = {status: 0};
      }
      Promise.prototype = {
        then: function(onFulfilled, onRejected, progressBack) {
          var result = new Deferred();
          this.$$state.pending = this.$$state.pending || [];
          this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
          if (this.$$state.status > 0)
            scheduleProcessQueue(this.$$state);
          return result.promise;
        },
        "catch": function(callback) {
          return this.then(null, callback);
        },
        "finally": function(callback, progressBack) {
          return this.then(function(value) {
            return handleCallback(value, true, callback);
          }, function(error) {
            return handleCallback(error, false, callback);
          }, progressBack);
        }
      };
      function simpleBind(context, fn) {
        return function(value) {
          fn.call(context, value);
        };
      }
      function processQueue(state) {
        var fn,
            promise,
            pending;
        pending = state.pending;
        state.processScheduled = false;
        state.pending = undefined;
        for (var i = 0,
            ii = pending.length; i < ii; ++i) {
          promise = pending[i][0];
          fn = pending[i][state.status];
          try {
            if (isFunction(fn)) {
              promise.resolve(fn(state.value));
            } else if (state.status === 1) {
              promise.resolve(state.value);
            } else {
              promise.reject(state.value);
            }
          } catch (e) {
            promise.reject(e);
            exceptionHandler(e);
          }
        }
      }
      function scheduleProcessQueue(state) {
        if (state.processScheduled || !state.pending)
          return;
        state.processScheduled = true;
        nextTick(function() {
          processQueue(state);
        });
      }
      function Deferred() {
        this.promise = new Promise();
        this.resolve = simpleBind(this, this.resolve);
        this.reject = simpleBind(this, this.reject);
        this.notify = simpleBind(this, this.notify);
      }
      Deferred.prototype = {
        resolve: function(val) {
          if (this.promise.$$state.status)
            return;
          if (val === this.promise) {
            this.$$reject($qMinErr('qcycle', "Expected promise to be resolved with value other than itself '{0}'", val));
          } else {
            this.$$resolve(val);
          }
        },
        $$resolve: function(val) {
          var then,
              fns;
          fns = callOnce(this, this.$$resolve, this.$$reject);
          try {
            if ((isObject(val) || isFunction(val)))
              then = val && val.then;
            if (isFunction(then)) {
              this.promise.$$state.status = -1;
              then.call(val, fns[0], fns[1], this.notify);
            } else {
              this.promise.$$state.value = val;
              this.promise.$$state.status = 1;
              scheduleProcessQueue(this.promise.$$state);
            }
          } catch (e) {
            fns[1](e);
            exceptionHandler(e);
          }
        },
        reject: function(reason) {
          if (this.promise.$$state.status)
            return;
          this.$$reject(reason);
        },
        $$reject: function(reason) {
          this.promise.$$state.value = reason;
          this.promise.$$state.status = 2;
          scheduleProcessQueue(this.promise.$$state);
        },
        notify: function(progress) {
          var callbacks = this.promise.$$state.pending;
          if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
            nextTick(function() {
              var callback,
                  result;
              for (var i = 0,
                  ii = callbacks.length; i < ii; i++) {
                result = callbacks[i][0];
                callback = callbacks[i][3];
                try {
                  result.notify(isFunction(callback) ? callback(progress) : progress);
                } catch (e) {
                  exceptionHandler(e);
                }
              }
            });
          }
        }
      };
      var reject = function(reason) {
        var result = new Deferred();
        result.reject(reason);
        return result.promise;
      };
      var makePromise = function makePromise(value, resolved) {
        var result = new Deferred();
        if (resolved) {
          result.resolve(value);
        } else {
          result.reject(value);
        }
        return result.promise;
      };
      var handleCallback = function handleCallback(value, isResolved, callback) {
        var callbackOutput = null;
        try {
          if (isFunction(callback))
            callbackOutput = callback();
        } catch (e) {
          return makePromise(e, false);
        }
        if (isPromiseLike(callbackOutput)) {
          return callbackOutput.then(function() {
            return makePromise(value, isResolved);
          }, function(error) {
            return makePromise(error, false);
          });
        } else {
          return makePromise(value, isResolved);
        }
      };
      var when = function(value, callback, errback, progressBack) {
        var result = new Deferred();
        result.resolve(value);
        return result.promise.then(callback, errback, progressBack);
      };
      function all(promises) {
        var deferred = new Deferred(),
            counter = 0,
            results = isArray(promises) ? [] : {};
        forEach(promises, function(promise, key) {
          counter++;
          when(promise).then(function(value) {
            if (results.hasOwnProperty(key))
              return;
            results[key] = value;
            if (!(--counter))
              deferred.resolve(results);
          }, function(reason) {
            if (results.hasOwnProperty(key))
              return;
            deferred.reject(reason);
          });
        });
        if (counter === 0) {
          deferred.resolve(results);
        }
        return deferred.promise;
      }
      var $Q = function Q(resolver) {
        if (!isFunction(resolver)) {
          throw $qMinErr('norslvr', "Expected resolverFn, got '{0}'", resolver);
        }
        if (!(this instanceof Q)) {
          return new Q(resolver);
        }
        var deferred = new Deferred();
        function resolveFn(value) {
          deferred.resolve(value);
        }
        function rejectFn(reason) {
          deferred.reject(reason);
        }
        resolver(resolveFn, rejectFn);
        return deferred.promise;
      };
      $Q.defer = defer;
      $Q.reject = reject;
      $Q.when = when;
      $Q.all = all;
      return $Q;
    }
    function $$RAFProvider() {
      this.$get = ['$window', '$timeout', function($window, $timeout) {
        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
        var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
        var rafSupported = !!requestAnimationFrame;
        var raf = rafSupported ? function(fn) {
          var id = requestAnimationFrame(fn);
          return function() {
            cancelAnimationFrame(id);
          };
        } : function(fn) {
          var timer = $timeout(fn, 16.66, false);
          return function() {
            $timeout.cancel(timer);
          };
        };
        raf.supported = rafSupported;
        return raf;
      }];
    }
    function $RootScopeProvider() {
      var TTL = 10;
      var $rootScopeMinErr = minErr('$rootScope');
      var lastDirtyWatch = null;
      var applyAsyncId = null;
      this.digestTtl = function(value) {
        if (arguments.length) {
          TTL = value;
        }
        return TTL;
      };
      this.$get = ['$injector', '$exceptionHandler', '$parse', '$browser', function($injector, $exceptionHandler, $parse, $browser) {
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this.$root = this;
          this.$$destroyed = false;
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$isolateBindings = null;
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function(isolate, parent) {
            var child;
            parent = parent || this;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
            } else {
              if (!this.$$ChildScope) {
                this.$$ChildScope = function ChildScope() {
                  this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
                  this.$$listeners = {};
                  this.$$listenerCount = {};
                  this.$id = nextUid();
                  this.$$ChildScope = null;
                };
                this.$$ChildScope.prototype = this;
              }
              child = new this.$$ChildScope();
            }
            child.$parent = parent;
            child.$$prevSibling = parent.$$childTail;
            if (parent.$$childHead) {
              parent.$$childTail.$$nextSibling = child;
              parent.$$childTail = child;
            } else {
              parent.$$childHead = parent.$$childTail = child;
            }
            if (isolate || parent != this)
              child.$on('$destroy', destroyChild);
            return child;
            function destroyChild() {
              child.$$destroyed = true;
            }
          },
          $watch: function(watchExp, listener, objectEquality) {
            var get = $parse(watchExp);
            if (get.$$watchDelegate) {
              return get.$$watchDelegate(this, listener, objectEquality, get);
            }
            var scope = this,
                array = scope.$$watchers,
                watcher = {
                  fn: listener,
                  last: initWatchVal,
                  get: get,
                  exp: watchExp,
                  eq: !!objectEquality
                };
            lastDirtyWatch = null;
            if (!isFunction(listener)) {
              watcher.fn = noop;
            }
            if (!array) {
              array = scope.$$watchers = [];
            }
            array.unshift(watcher);
            return function deregisterWatch() {
              arrayRemove(array, watcher);
              lastDirtyWatch = null;
            };
          },
          $watchGroup: function(watchExpressions, listener) {
            var oldValues = new Array(watchExpressions.length);
            var newValues = new Array(watchExpressions.length);
            var deregisterFns = [];
            var self = this;
            var changeReactionScheduled = false;
            var firstRun = true;
            if (!watchExpressions.length) {
              var shouldCall = true;
              self.$evalAsync(function() {
                if (shouldCall)
                  listener(newValues, newValues, self);
              });
              return function deregisterWatchGroup() {
                shouldCall = false;
              };
            }
            if (watchExpressions.length === 1) {
              return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
                newValues[0] = value;
                oldValues[0] = oldValue;
                listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
              });
            }
            forEach(watchExpressions, function(expr, i) {
              var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
                newValues[i] = value;
                oldValues[i] = oldValue;
                if (!changeReactionScheduled) {
                  changeReactionScheduled = true;
                  self.$evalAsync(watchGroupAction);
                }
              });
              deregisterFns.push(unwatchFn);
            });
            function watchGroupAction() {
              changeReactionScheduled = false;
              if (firstRun) {
                firstRun = false;
                listener(newValues, newValues, self);
              } else {
                listener(newValues, oldValues, self);
              }
            }
            return function deregisterWatchGroup() {
              while (deregisterFns.length) {
                deregisterFns.shift()();
              }
            };
          },
          $watchCollection: function(obj, listener) {
            $watchCollectionInterceptor.$stateful = true;
            var self = this;
            var newValue;
            var oldValue;
            var veryOldValue;
            var trackVeryOldValue = (listener.length > 1);
            var changeDetected = 0;
            var changeDetector = $parse(obj, $watchCollectionInterceptor);
            var internalArray = [];
            var internalObject = {};
            var initRun = true;
            var oldLength = 0;
            function $watchCollectionInterceptor(_value) {
              newValue = _value;
              var newLength,
                  key,
                  bothNaN,
                  newItem,
                  oldItem;
              if (isUndefined(newValue))
                return;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  oldItem = oldValue[i];
                  newItem = newValue[i];
                  bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                  if (!bothNaN && (oldItem !== newItem)) {
                    changeDetected++;
                    oldValue[i] = newItem;
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key in newValue) {
                  if (newValue.hasOwnProperty(key)) {
                    newLength++;
                    newItem = newValue[key];
                    oldItem = oldValue[key];
                    if (key in oldValue) {
                      bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                      if (!bothNaN && (oldItem !== newItem)) {
                        changeDetected++;
                        oldValue[key] = newItem;
                      }
                    } else {
                      oldLength++;
                      oldValue[key] = newItem;
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key in oldValue) {
                    if (!newValue.hasOwnProperty(key)) {
                      oldLength--;
                      delete oldValue[key];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              if (initRun) {
                initRun = false;
                listener(newValue, newValue, self);
              } else {
                listener(newValue, veryOldValue, self);
              }
              if (trackVeryOldValue) {
                if (!isObject(newValue)) {
                  veryOldValue = newValue;
                } else if (isArrayLike(newValue)) {
                  veryOldValue = new Array(newValue.length);
                  for (var i = 0; i < newValue.length; i++) {
                    veryOldValue[i] = newValue[i];
                  }
                } else {
                  veryOldValue = {};
                  for (var key in newValue) {
                    if (hasOwnProperty.call(newValue, key)) {
                      veryOldValue[key] = newValue[key];
                    }
                  }
                }
              }
            }
            return this.$watch(changeDetector, $watchCollectionAction);
          },
          $digest: function() {
            var watch,
                value,
                last,
                watchers,
                length,
                dirty,
                ttl = TTL,
                next,
                current,
                target = this,
                watchLog = [],
                logIdx,
                logMsg,
                asyncTask;
            beginPhase('$digest');
            $browser.$$checkUrlChange();
            if (this === $rootScope && applyAsyncId !== null) {
              $browser.defer.cancel(applyAsyncId);
              flushApplyAsync();
            }
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              while (asyncQueue.length) {
                try {
                  asyncTask = asyncQueue.shift();
                  asyncTask.scope.$eval(asyncTask.expression);
                } catch (e) {
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              traverseScopesLoop: do {
                if ((watchers = current.$$watchers)) {
                  length = watchers.length;
                  while (length--) {
                    try {
                      watch = watchers[length];
                      if (watch) {
                        if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : (typeof value === 'number' && typeof last === 'number' && isNaN(value) && isNaN(last)))) {
                          dirty = true;
                          lastDirtyWatch = watch;
                          watch.last = watch.eq ? copy(value, null) : value;
                          watch.fn(value, ((last === initWatchVal) ? value : last), current);
                          if (ttl < 5) {
                            logIdx = 4 - ttl;
                            if (!watchLog[logIdx])
                              watchLog[logIdx] = [];
                            watchLog[logIdx].push({
                              msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                              newVal: value,
                              oldVal: last
                            });
                          }
                        } else if (watch === lastDirtyWatch) {
                          dirty = false;
                          break traverseScopesLoop;
                        }
                      }
                    } catch (e) {
                      $exceptionHandler(e);
                    }
                  }
                }
                if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
                  while (current !== target && !(next = current.$$nextSibling)) {
                    current = current.$parent;
                  }
                }
              } while ((current = next));
              if ((dirty || asyncQueue.length) && !(ttl--)) {
                clearPhase();
                throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, watchLog);
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueue.length) {
              try {
                postDigestQueue.shift()();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          },
          $destroy: function() {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast('$destroy');
            this.$$destroyed = true;
            if (this === $rootScope)
              return;
            for (var eventName in this.$$listenerCount) {
              decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
            }
            if (parent.$$childHead == this)
              parent.$$childHead = this.$$nextSibling;
            if (parent.$$childTail == this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
            this.$on = this.$watch = this.$watchGroup = function() {
              return noop;
            };
            this.$$listeners = {};
            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null;
          },
          $eval: function(expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function(expr) {
            if (!$rootScope.$$phase && !asyncQueue.length) {
              $browser.defer(function() {
                if (asyncQueue.length) {
                  $rootScope.$digest();
                }
              });
            }
            asyncQueue.push({
              scope: this,
              expression: expr
            });
          },
          $$postDigest: function(fn) {
            postDigestQueue.push(fn);
          },
          $apply: function(expr) {
            try {
              beginPhase('$apply');
              return this.$eval(expr);
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              clearPhase();
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $applyAsync: function(expr) {
            var scope = this;
            expr && applyAsyncQueue.push($applyAsyncExpression);
            scheduleApplyAsync();
            function $applyAsyncExpression() {
              scope.$eval(expr);
            }
          },
          $on: function(name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while ((current = current.$parent));
            var self = this;
            return function() {
              var indexOfListener = namedListeners.indexOf(listener);
              if (indexOfListener !== -1) {
                namedListeners[indexOfListener] = null;
                decrementListenerCount(self, 1, name);
              }
            };
          },
          $emit: function(name, args) {
            var empty = [],
                namedListeners,
                scope = this,
                stopPropagation = false,
                event = {
                  name: name,
                  targetScope: scope,
                  stopPropagation: function() {
                    stopPropagation = true;
                  },
                  preventDefault: function() {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                },
                listenerArgs = concat([event], arguments, 1),
                i,
                length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation) {
                event.currentScope = null;
                return event;
              }
              scope = scope.$parent;
            } while (scope);
            event.currentScope = null;
            return event;
          },
          $broadcast: function(name, args) {
            var target = this,
                current = target,
                next = target,
                event = {
                  name: name,
                  targetScope: target,
                  preventDefault: function() {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                };
            if (!target.$$listenerCount[name])
              return event;
            var listenerArgs = concat([event], arguments, 1),
                listeners,
                i,
                length;
            while ((current = next)) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = ((current.$$listenerCount[name] && current.$$childHead) || (current !== target && current.$$nextSibling)))) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            event.currentScope = null;
            return event;
          }
        };
        var $rootScope = new Scope();
        var asyncQueue = $rootScope.$$asyncQueue = [];
        var postDigestQueue = $rootScope.$$postDigestQueue = [];
        var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while ((current = current.$parent));
        }
        function initWatchVal() {}
        function flushApplyAsync() {
          while (applyAsyncQueue.length) {
            try {
              applyAsyncQueue.shift()();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          applyAsyncId = null;
        }
        function scheduleApplyAsync() {
          if (applyAsyncId === null) {
            applyAsyncId = $browser.defer(function() {
              $rootScope.$apply(flushApplyAsync);
            });
          }
        }
      }];
    }
    function $$SanitizeUriProvider() {
      var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
          imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
      this.aHrefSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          aHrefSanitizationWhitelist = regexp;
          return this;
        }
        return aHrefSanitizationWhitelist;
      };
      this.imgSrcSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          imgSrcSanitizationWhitelist = regexp;
          return this;
        }
        return imgSrcSanitizationWhitelist;
      };
      this.$get = function() {
        return function sanitizeUri(uri, isImage) {
          var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
          var normalizedVal;
          normalizedVal = urlResolve(uri).href;
          if (normalizedVal !== '' && !normalizedVal.match(regex)) {
            return 'unsafe:' + normalizedVal;
          }
          return uri;
        };
      };
    }
    var $sceMinErr = minErr('$sce');
    var SCE_CONTEXTS = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    };
    function adjustMatcher(matcher) {
      if (matcher === 'self') {
        return matcher;
      } else if (isString(matcher)) {
        if (matcher.indexOf('***') > -1) {
          throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
        }
        matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
        return new RegExp('^' + matcher + '$');
      } else if (isRegExp(matcher)) {
        return new RegExp('^' + matcher.source + '$');
      } else {
        throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
      }
    }
    function adjustMatchers(matchers) {
      var adjustedMatchers = [];
      if (isDefined(matchers)) {
        forEach(matchers, function(matcher) {
          adjustedMatchers.push(adjustMatcher(matcher));
        });
      }
      return adjustedMatchers;
    }
    function $SceDelegateProvider() {
      this.SCE_CONTEXTS = SCE_CONTEXTS;
      var resourceUrlWhitelist = ['self'],
          resourceUrlBlacklist = [];
      this.resourceUrlWhitelist = function(value) {
        if (arguments.length) {
          resourceUrlWhitelist = adjustMatchers(value);
        }
        return resourceUrlWhitelist;
      };
      this.resourceUrlBlacklist = function(value) {
        if (arguments.length) {
          resourceUrlBlacklist = adjustMatchers(value);
        }
        return resourceUrlBlacklist;
      };
      this.$get = ['$injector', function($injector) {
        var htmlSanitizer = function htmlSanitizer(html) {
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        if ($injector.has('$sanitize')) {
          htmlSanitizer = $injector.get('$sanitize');
        }
        function matchUrl(matcher, parsedUrl) {
          if (matcher === 'self') {
            return urlIsSameOrigin(parsedUrl);
          } else {
            return !!matcher.exec(parsedUrl.href);
          }
        }
        function isResourceUrlAllowedByPolicy(url) {
          var parsedUrl = urlResolve(url.toString());
          var i,
              n,
              allowed = false;
          for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
            if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
              if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                allowed = false;
                break;
              }
            }
          }
          return allowed;
        }
        function generateHolderType(Base) {
          var holderType = function TrustedValueHolderType(trustedValue) {
            this.$$unwrapTrustedValue = function() {
              return trustedValue;
            };
          };
          if (Base) {
            holderType.prototype = new Base();
          }
          holderType.prototype.valueOf = function sceValueOf() {
            return this.$$unwrapTrustedValue();
          };
          holderType.prototype.toString = function sceToString() {
            return this.$$unwrapTrustedValue().toString();
          };
          return holderType;
        }
        var trustedValueHolderBase = generateHolderType(),
            byType = {};
        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
        function trustAs(type, trustedValue) {
          var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
          if (!Constructor) {
            throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
          }
          if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
            return trustedValue;
          }
          if (typeof trustedValue !== 'string') {
            throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
          }
          return new Constructor(trustedValue);
        }
        function valueOf(maybeTrusted) {
          if (maybeTrusted instanceof trustedValueHolderBase) {
            return maybeTrusted.$$unwrapTrustedValue();
          } else {
            return maybeTrusted;
          }
        }
        function getTrusted(type, maybeTrusted) {
          if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
            return maybeTrusted;
          }
          var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
          if (constructor && maybeTrusted instanceof constructor) {
            return maybeTrusted.$$unwrapTrustedValue();
          }
          if (type === SCE_CONTEXTS.RESOURCE_URL) {
            if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
              return maybeTrusted;
            } else {
              throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
            }
          } else if (type === SCE_CONTEXTS.HTML) {
            return htmlSanitizer(maybeTrusted);
          }
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        return {
          trustAs: trustAs,
          getTrusted: getTrusted,
          valueOf: valueOf
        };
      }];
    }
    function $SceProvider() {
      var enabled = true;
      this.enabled = function(value) {
        if (arguments.length) {
          enabled = !!value;
        }
        return enabled;
      };
      this.$get = ['$parse', '$sceDelegate', function($parse, $sceDelegate) {
        if (enabled && msie < 8) {
          throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        }
        var sce = shallowCopy(SCE_CONTEXTS);
        sce.isEnabled = function() {
          return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;
        if (!enabled) {
          sce.trustAs = sce.getTrusted = function(type, value) {
            return value;
          };
          sce.valueOf = identity;
        }
        sce.parseAs = function sceParseAs(type, expr) {
          var parsed = $parse(expr);
          if (parsed.literal && parsed.constant) {
            return parsed;
          } else {
            return $parse(expr, function(value) {
              return sce.getTrusted(type, value);
            });
          }
        };
        var parse = sce.parseAs,
            getTrusted = sce.getTrusted,
            trustAs = sce.trustAs;
        forEach(SCE_CONTEXTS, function(enumValue, name) {
          var lName = lowercase(name);
          sce[camelCase("parse_as_" + lName)] = function(expr) {
            return parse(enumValue, expr);
          };
          sce[camelCase("get_trusted_" + lName)] = function(value) {
            return getTrusted(enumValue, value);
          };
          sce[camelCase("trust_as_" + lName)] = function(value) {
            return trustAs(enumValue, value);
          };
        });
        return sce;
      }];
    }
    function $SnifferProvider() {
      this.$get = ['$window', '$document', function($window, $document) {
        var eventSupport = {},
            android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
            boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
            document = $document[0] || {},
            vendorPrefix,
            vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/,
            bodyStyle = document.body && document.body.style,
            transitions = false,
            animations = false,
            match;
        if (bodyStyle) {
          for (var prop in bodyStyle) {
            if (match = vendorRegex.exec(prop)) {
              vendorPrefix = match[0];
              vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
              break;
            }
          }
          if (!vendorPrefix) {
            vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
          }
          transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
          animations = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));
          if (android && (!transitions || !animations)) {
            transitions = isString(document.body.style.webkitTransition);
            animations = isString(document.body.style.webkitAnimation);
          }
        }
        return {
          history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
          hasEvent: function(event) {
            if (event === 'input' && msie <= 11)
              return false;
            if (isUndefined(eventSupport[event])) {
              var divElm = document.createElement('div');
              eventSupport[event] = 'on' + event in divElm;
            }
            return eventSupport[event];
          },
          csp: csp(),
          vendorPrefix: vendorPrefix,
          transitions: transitions,
          animations: animations,
          android: android
        };
      }];
    }
    var $compileMinErr = minErr('$compile');
    function $TemplateRequestProvider() {
      this.$get = ['$templateCache', '$http', '$q', function($templateCache, $http, $q) {
        function handleRequestFn(tpl, ignoreRequestError) {
          var self = handleRequestFn;
          self.totalPendingRequests++;
          var transformResponse = $http.defaults && $http.defaults.transformResponse;
          if (isArray(transformResponse)) {
            transformResponse = transformResponse.filter(function(transformer) {
              return transformer !== defaultHttpResponseTransform;
            });
          } else if (transformResponse === defaultHttpResponseTransform) {
            transformResponse = null;
          }
          var httpOptions = {
            cache: $templateCache,
            transformResponse: transformResponse
          };
          return $http.get(tpl, httpOptions).then(function(response) {
            self.totalPendingRequests--;
            return response.data;
          }, handleError);
          function handleError(resp) {
            self.totalPendingRequests--;
            if (!ignoreRequestError) {
              throw $compileMinErr('tpload', 'Failed to load template: {0}', tpl);
            }
            return $q.reject(resp);
          }
        }
        handleRequestFn.totalPendingRequests = 0;
        return handleRequestFn;
      }];
    }
    function $$TestabilityProvider() {
      this.$get = ['$rootScope', '$browser', '$location', function($rootScope, $browser, $location) {
        var testability = {};
        testability.findBindings = function(element, expression, opt_exactMatch) {
          var bindings = element.getElementsByClassName('ng-binding');
          var matches = [];
          forEach(bindings, function(binding) {
            var dataBinding = angular.element(binding).data('$binding');
            if (dataBinding) {
              forEach(dataBinding, function(bindingName) {
                if (opt_exactMatch) {
                  var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
                  if (matcher.test(bindingName)) {
                    matches.push(binding);
                  }
                } else {
                  if (bindingName.indexOf(expression) != -1) {
                    matches.push(binding);
                  }
                }
              });
            }
          });
          return matches;
        };
        testability.findModels = function(element, expression, opt_exactMatch) {
          var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
          for (var p = 0; p < prefixes.length; ++p) {
            var attributeEquals = opt_exactMatch ? '=' : '*=';
            var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
            var elements = element.querySelectorAll(selector);
            if (elements.length) {
              return elements;
            }
          }
        };
        testability.getLocation = function() {
          return $location.url();
        };
        testability.setLocation = function(url) {
          if (url !== $location.url()) {
            $location.url(url);
            $rootScope.$digest();
          }
        };
        testability.whenStable = function(callback) {
          $browser.notifyWhenNoOutstandingRequests(callback);
        };
        return testability;
      }];
    }
    function $TimeoutProvider() {
      this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler', function($rootScope, $browser, $q, $$q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          var skipApply = (isDefined(invokeApply) && !invokeApply),
              deferred = (skipApply ? $$q : $q).defer(),
              promise = deferred.promise,
              timeoutId;
          timeoutId = $browser.defer(function() {
            try {
              deferred.resolve(fn());
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function(promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            delete deferreds[promise.$$timeoutId];
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };
        return timeout;
      }];
    }
    var urlParsingNode = document.createElement("a");
    var originUrl = urlResolve(window.location.href);
    function urlResolve(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
      };
    }
    function urlIsSameOrigin(requestUrl) {
      var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
      return (parsed.protocol === originUrl.protocol && parsed.host === originUrl.host);
    }
    function $WindowProvider() {
      this.$get = valueFn(window);
    }
    $FilterProvider.$inject = ['$provide'];
    function $FilterProvider($provide) {
      var suffix = 'Filter';
      function register(name, factory) {
        if (isObject(name)) {
          var filters = {};
          forEach(name, function(filter, key) {
            filters[key] = register(key, filter);
          });
          return filters;
        } else {
          return $provide.factory(name + suffix, factory);
        }
      }
      this.register = register;
      this.$get = ['$injector', function($injector) {
        return function(name) {
          return $injector.get(name + suffix);
        };
      }];
      register('currency', currencyFilter);
      register('date', dateFilter);
      register('filter', filterFilter);
      register('json', jsonFilter);
      register('limitTo', limitToFilter);
      register('lowercase', lowercaseFilter);
      register('number', numberFilter);
      register('orderBy', orderByFilter);
      register('uppercase', uppercaseFilter);
    }
    function filterFilter() {
      return function(array, expression, comparator) {
        if (!isArray(array))
          return array;
        var predicateFn;
        var matchAgainstAnyProp;
        switch (typeof expression) {
          case 'function':
            predicateFn = expression;
            break;
          case 'boolean':
          case 'number':
          case 'string':
            matchAgainstAnyProp = true;
          case 'object':
            predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
            break;
          default:
            return array;
        }
        return array.filter(predicateFn);
      };
    }
    function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
      var predicateFn;
      if (comparator === true) {
        comparator = equals;
      } else if (!isFunction(comparator)) {
        comparator = function(actual, expected) {
          if (isObject(actual) || isObject(expected)) {
            return false;
          }
          actual = lowercase('' + actual);
          expected = lowercase('' + expected);
          return actual.indexOf(expected) !== -1;
        };
      }
      predicateFn = function(item) {
        return deepCompare(item, expression, comparator, matchAgainstAnyProp);
      };
      return predicateFn;
    }
    function deepCompare(actual, expected, comparator, matchAgainstAnyProp) {
      var actualType = typeof actual;
      var expectedType = typeof expected;
      if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
        return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
      } else if (actualType === 'array') {
        return actual.some(function(item) {
          return deepCompare(item, expected, comparator, matchAgainstAnyProp);
        });
      }
      switch (actualType) {
        case 'object':
          var key;
          if (matchAgainstAnyProp) {
            for (key in actual) {
              if ((key.charAt(0) !== '$') && deepCompare(actual[key], expected, comparator)) {
                return true;
              }
            }
            return false;
          } else if (expectedType === 'object') {
            for (key in expected) {
              var expectedVal = expected[key];
              if (isFunction(expectedVal)) {
                continue;
              }
              var keyIsDollar = key === '$';
              var actualVal = keyIsDollar ? actual : actual[key];
              if (!deepCompare(actualVal, expectedVal, comparator, keyIsDollar)) {
                return false;
              }
            }
            return true;
          } else {
            return comparator(actual, expected);
          }
          break;
        case 'function':
          return false;
        default:
          return comparator(actual, expected);
      }
    }
    currencyFilter.$inject = ['$locale'];
    function currencyFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function(amount, currencySymbol, fractionSize) {
        if (isUndefined(currencySymbol)) {
          currencySymbol = formats.CURRENCY_SYM;
        }
        if (isUndefined(fractionSize)) {
          fractionSize = formats.PATTERNS[1].maxFrac;
        }
        return (amount == null) ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol);
      };
    }
    numberFilter.$inject = ['$locale'];
    function numberFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function(number, fractionSize) {
        return (number == null) ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
      };
    }
    var DECIMAL_SEP = '.';
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
      if (!isFinite(number) || isObject(number))
        return '';
      var isNegative = number < 0;
      number = Math.abs(number);
      var numStr = number + '',
          formatedText = '',
          parts = [];
      var hasExponent = false;
      if (numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] == '-' && match[3] > fractionSize + 1) {
          number = 0;
        } else {
          formatedText = numStr;
          hasExponent = true;
        }
      }
      if (!hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
        if (isUndefined(fractionSize)) {
          fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }
        number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);
        var fraction = ('' + number).split(DECIMAL_SEP);
        var whole = fraction[0];
        fraction = fraction[1] || '';
        var i,
            pos = 0,
            lgroup = pattern.lgSize,
            group = pattern.gSize;
        if (whole.length >= (lgroup + group)) {
          pos = whole.length - lgroup;
          for (i = 0; i < pos; i++) {
            if ((pos - i) % group === 0 && i !== 0) {
              formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
          }
        }
        for (i = pos; i < whole.length; i++) {
          if ((whole.length - i) % lgroup === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
        while (fraction.length < fractionSize) {
          fraction += '0';
        }
        if (fractionSize && fractionSize !== "0")
          formatedText += decimalSep + fraction.substr(0, fractionSize);
      } else {
        if (fractionSize > 0 && number < 1) {
          formatedText = number.toFixed(fractionSize);
          number = parseFloat(formatedText);
        }
      }
      if (number === 0) {
        isNegative = false;
      }
      parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf);
      return parts.join('');
    }
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg = '-';
        num = -num;
      }
      num = '' + num;
      while (num.length < digits)
        num = '0' + num;
      if (trim)
        num = num.substr(num.length - digits);
      return neg + num;
    }
    function dateGetter(name, size, offset, trim) {
      offset = offset || 0;
      return function(date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset)
          value += offset;
        if (value === 0 && offset == -12)
          value = 12;
        return padNumber(value, size, trim);
      };
    }
    function dateStrGetter(name, shortForm) {
      return function(date, formats) {
        var value = date['get' + name]();
        var get = uppercase(shortForm ? ('SHORT' + name) : name);
        return formats[get][value];
      };
    }
    function timeZoneGetter(date) {
      var zone = -1 * date.getTimezoneOffset();
      var paddedZone = (zone >= 0) ? "+" : "";
      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
      return paddedZone;
    }
    function getFirstThursdayOfYear(year) {
      var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
      return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
    }
    function getThursdayThisWeek(datetime) {
      return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()));
    }
    function weekGetter(size) {
      return function(date) {
        var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
            thisThurs = getThursdayThisWeek(date);
        var diff = +thisThurs - +firstThurs,
            result = 1 + Math.round(diff / 6.048e8);
        return padNumber(result, size);
      };
    }
    function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter,
      ww: weekGetter(2),
      w: weekGetter(1)
    };
    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,
        NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ['$locale'];
    function dateFilter($locale) {
      var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
      function jsonStringToDate(string) {
        var match;
        if (match = string.match(R_ISO8601_STR)) {
          var date = new Date(0),
              tzHour = 0,
              tzMin = 0,
              dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
              timeSetter = match[8] ? date.setUTCHours : date.setHours;
          if (match[9]) {
            tzHour = int(match[9] + match[10]);
            tzMin = int(match[9] + match[11]);
          }
          dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
          var h = int(match[4] || 0) - tzHour;
          var m = int(match[5] || 0) - tzMin;
          var s = int(match[6] || 0);
          var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
          timeSetter.call(date, h, m, s, ms);
          return date;
        }
        return string;
      }
      return function(date, format, timezone) {
        var text = '',
            parts = [],
            fn,
            match;
        format = format || 'mediumDate';
        format = $locale.DATETIME_FORMATS[format] || format;
        if (isString(date)) {
          date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date);
        }
        if (isNumber(date)) {
          date = new Date(date);
        }
        if (!isDate(date)) {
          return date;
        }
        while (format) {
          match = DATE_FORMATS_SPLIT.exec(format);
          if (match) {
            parts = concat(parts, match, 1);
            format = parts.pop();
          } else {
            parts.push(format);
            format = null;
          }
        }
        if (timezone && timezone === 'UTC') {
          date = new Date(date.getTime());
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        }
        forEach(parts, function(value) {
          fn = DATE_FORMATS[value];
          text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
        });
        return text;
      };
    }
    function jsonFilter() {
      return function(object, spacing) {
        if (isUndefined(spacing)) {
          spacing = 2;
        }
        return toJson(object, spacing);
      };
    }
    var lowercaseFilter = valueFn(lowercase);
    var uppercaseFilter = valueFn(uppercase);
    function limitToFilter() {
      return function(input, limit) {
        if (isNumber(input))
          input = input.toString();
        if (!isArray(input) && !isString(input))
          return input;
        if (Math.abs(Number(limit)) === Infinity) {
          limit = Number(limit);
        } else {
          limit = int(limit);
        }
        if (isString(input)) {
          if (limit) {
            return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
          } else {
            return "";
          }
        }
        var out = [],
            i,
            n;
        if (limit > input.length)
          limit = input.length;
        else if (limit < -input.length)
          limit = -input.length;
        if (limit > 0) {
          i = 0;
          n = limit;
        } else {
          i = input.length + limit;
          n = input.length;
        }
        for (; i < n; i++) {
          out.push(input[i]);
        }
        return out;
      };
    }
    orderByFilter.$inject = ['$parse'];
    function orderByFilter($parse) {
      return function(array, sortPredicate, reverseOrder) {
        if (!(isArrayLike(array)))
          return array;
        sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
        if (sortPredicate.length === 0) {
          sortPredicate = ['+'];
        }
        sortPredicate = sortPredicate.map(function(predicate) {
          var descending = false,
              get = predicate || identity;
          if (isString(predicate)) {
            if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
              descending = predicate.charAt(0) == '-';
              predicate = predicate.substring(1);
            }
            if (predicate === '') {
              return reverseComparator(function(a, b) {
                return compare(a, b);
              }, descending);
            }
            get = $parse(predicate);
            if (get.constant) {
              var key = get();
              return reverseComparator(function(a, b) {
                return compare(a[key], b[key]);
              }, descending);
            }
          }
          return reverseComparator(function(a, b) {
            return compare(get(a), get(b));
          }, descending);
        });
        return slice.call(array).sort(reverseComparator(comparator, reverseOrder));
        function comparator(o1, o2) {
          for (var i = 0; i < sortPredicate.length; i++) {
            var comp = sortPredicate[i](o1, o2);
            if (comp !== 0)
              return comp;
          }
          return 0;
        }
        function reverseComparator(comp, descending) {
          return descending ? function(a, b) {
            return comp(b, a);
          } : comp;
        }
        function compare(v1, v2) {
          var t1 = typeof v1;
          var t2 = typeof v2;
          if (t1 === t2 && t1 === "object") {
            t1 = typeof(v1.valueOf ? v1 = v1.valueOf() : v1);
            t2 = typeof(v2.valueOf ? v2 = v2.valueOf() : v2);
            if (t1 === t2 && t1 === "object") {
              t1 = typeof(v1.toString ? v1 = v1.toString() : v1);
              t2 = typeof(v2.toString ? v2 = v2.toString() : v2);
              if (t1 === t2 && v1 === v2 || t1 === "object")
                return 0;
            }
          }
          if (t1 === t2) {
            if (t1 === "string") {
              v1 = v1.toLowerCase();
              v2 = v2.toLowerCase();
            }
            if (v1 === v2)
              return 0;
            return v1 < v2 ? -1 : 1;
          } else {
            return t1 < t2 ? -1 : 1;
          }
        }
      };
    }
    function ngDirective(directive) {
      if (isFunction(directive)) {
        directive = {link: directive};
      }
      directive.restrict = directive.restrict || 'AC';
      return valueFn(directive);
    }
    var htmlAnchorDirective = valueFn({
      restrict: 'E',
      compile: function(element, attr) {
        if (!attr.href && !attr.xlinkHref && !attr.name) {
          return function(scope, element) {
            var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
            element.on('click', function(event) {
              if (!element.attr(href)) {
                event.preventDefault();
              }
            });
          };
        }
      }
    });
    var ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
      if (propName == "multiple")
        return;
      var normalized = directiveNormalize('ng-' + attrName);
      ngAttributeAliasDirectives[normalized] = function() {
        return {
          restrict: 'A',
          priority: 100,
          link: function(scope, element, attr) {
            scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
              attr.$set(attrName, !!value);
            });
          }
        };
      };
    });
    forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
      ngAttributeAliasDirectives[ngAttr] = function() {
        return {
          priority: 100,
          link: function(scope, element, attr) {
            if (ngAttr === "ngPattern" && attr.ngPattern.charAt(0) == "/") {
              var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
              if (match) {
                attr.$set("ngPattern", new RegExp(match[1], match[2]));
                return;
              }
            }
            scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
              attr.$set(ngAttr, value);
            });
          }
        };
      };
    });
    forEach(['src', 'srcset', 'href'], function(attrName) {
      var normalized = directiveNormalize('ng-' + attrName);
      ngAttributeAliasDirectives[normalized] = function() {
        return {
          priority: 99,
          link: function(scope, element, attr) {
            var propName = attrName,
                name = attrName;
            if (attrName === 'href' && toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
              name = 'xlinkHref';
              attr.$attr[name] = 'xlink:href';
              propName = null;
            }
            attr.$observe(normalized, function(value) {
              if (!value) {
                if (attrName === 'href') {
                  attr.$set(name, null);
                }
                return;
              }
              attr.$set(name, value);
              if (msie && propName)
                element.prop(propName, attr[name]);
            });
          }
        };
      };
    });
    var nullFormCtrl = {
      $addControl: noop,
      $$renameControl: nullFormRenameControl,
      $removeControl: noop,
      $setValidity: noop,
      $setDirty: noop,
      $setPristine: noop,
      $setSubmitted: noop
    },
        SUBMITTED_CLASS = 'ng-submitted';
    function nullFormRenameControl(control, name) {
      control.$name = name;
    }
    FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
    function FormController(element, attrs, $scope, $animate, $interpolate) {
      var form = this,
          controls = [];
      var parentForm = form.$$parentForm = element.parent().controller('form') || nullFormCtrl;
      form.$error = {};
      form.$$success = {};
      form.$pending = undefined;
      form.$name = $interpolate(attrs.name || attrs.ngForm || '')($scope);
      form.$dirty = false;
      form.$pristine = true;
      form.$valid = true;
      form.$invalid = false;
      form.$submitted = false;
      parentForm.$addControl(form);
      form.$rollbackViewValue = function() {
        forEach(controls, function(control) {
          control.$rollbackViewValue();
        });
      };
      form.$commitViewValue = function() {
        forEach(controls, function(control) {
          control.$commitViewValue();
        });
      };
      form.$addControl = function(control) {
        assertNotHasOwnProperty(control.$name, 'input');
        controls.push(control);
        if (control.$name) {
          form[control.$name] = control;
        }
      };
      form.$$renameControl = function(control, newName) {
        var oldName = control.$name;
        if (form[oldName] === control) {
          delete form[oldName];
        }
        form[newName] = control;
        control.$name = newName;
      };
      form.$removeControl = function(control) {
        if (control.$name && form[control.$name] === control) {
          delete form[control.$name];
        }
        forEach(form.$pending, function(value, name) {
          form.$setValidity(name, null, control);
        });
        forEach(form.$error, function(value, name) {
          form.$setValidity(name, null, control);
        });
        arrayRemove(controls, control);
      };
      addSetValidityMethod({
        ctrl: this,
        $element: element,
        set: function(object, property, control) {
          var list = object[property];
          if (!list) {
            object[property] = [control];
          } else {
            var index = list.indexOf(control);
            if (index === -1) {
              list.push(control);
            }
          }
        },
        unset: function(object, property, control) {
          var list = object[property];
          if (!list) {
            return;
          }
          arrayRemove(list, control);
          if (list.length === 0) {
            delete object[property];
          }
        },
        parentForm: parentForm,
        $animate: $animate
      });
      form.$setDirty = function() {
        $animate.removeClass(element, PRISTINE_CLASS);
        $animate.addClass(element, DIRTY_CLASS);
        form.$dirty = true;
        form.$pristine = false;
        parentForm.$setDirty();
      };
      form.$setPristine = function() {
        $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
        form.$dirty = false;
        form.$pristine = true;
        form.$submitted = false;
        forEach(controls, function(control) {
          control.$setPristine();
        });
      };
      form.$setUntouched = function() {
        forEach(controls, function(control) {
          control.$setUntouched();
        });
      };
      form.$setSubmitted = function() {
        $animate.addClass(element, SUBMITTED_CLASS);
        form.$submitted = true;
        parentForm.$setSubmitted();
      };
    }
    var formDirectiveFactory = function(isNgForm) {
      return ['$timeout', function($timeout) {
        var formDirective = {
          name: 'form',
          restrict: isNgForm ? 'EAC' : 'E',
          controller: FormController,
          compile: function ngFormCompile(formElement) {
            formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
            return {pre: function ngFormPreLink(scope, formElement, attr, controller) {
                if (!('action' in attr)) {
                  var handleFormSubmission = function(event) {
                    scope.$apply(function() {
                      controller.$commitViewValue();
                      controller.$setSubmitted();
                    });
                    event.preventDefault();
                  };
                  addEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                  formElement.on('$destroy', function() {
                    $timeout(function() {
                      removeEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                    }, 0, false);
                  });
                }
                var parentFormCtrl = controller.$$parentForm,
                    alias = controller.$name;
                if (alias) {
                  setter(scope, alias, controller, alias);
                  attr.$observe(attr.name ? 'name' : 'ngForm', function(newValue) {
                    if (alias === newValue)
                      return;
                    setter(scope, alias, undefined, alias);
                    alias = newValue;
                    setter(scope, alias, controller, alias);
                    parentFormCtrl.$$renameControl(controller, alias);
                  });
                }
                formElement.on('$destroy', function() {
                  parentFormCtrl.$removeControl(controller);
                  if (alias) {
                    setter(scope, alias, undefined, alias);
                  }
                  extend(controller, nullFormCtrl);
                });
              }};
          }
        };
        return formDirective;
      }];
    };
    var formDirective = formDirectiveFactory();
    var ngFormDirective = formDirectiveFactory(true);
    var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
    var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
    var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
    var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
    var $ngModelMinErr = new minErr('ngModel');
    var inputType = {
      'text': textInputType,
      'date': createDateInputType('date', DATE_REGEXP, createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']), 'yyyy-MM-dd'),
      'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']), 'yyyy-MM-ddTHH:mm:ss.sss'),
      'time': createDateInputType('time', TIME_REGEXP, createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']), 'HH:mm:ss.sss'),
      'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),
      'month': createDateInputType('month', MONTH_REGEXP, createDateParser(MONTH_REGEXP, ['yyyy', 'MM']), 'yyyy-MM'),
      'number': numberInputType,
      'url': urlInputType,
      'email': emailInputType,
      'radio': radioInputType,
      'checkbox': checkboxInputType,
      'hidden': noop,
      'button': noop,
      'submit': noop,
      'reset': noop,
      'file': noop
    };
    function stringBasedInputType(ctrl) {
      ctrl.$formatters.push(function(value) {
        return ctrl.$isEmpty(value) ? value : value.toString();
      });
    }
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
    }
    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      var type = lowercase(element[0].type);
      if (!$sniffer.android) {
        var composing = false;
        element.on('compositionstart', function(data) {
          composing = true;
        });
        element.on('compositionend', function() {
          composing = false;
          listener();
        });
      }
      var listener = function(ev) {
        if (timeout) {
          $browser.defer.cancel(timeout);
          timeout = null;
        }
        if (composing)
          return;
        var value = element.val(),
            event = ev && ev.type;
        if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
          value = trim(value);
        }
        if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
          ctrl.$setViewValue(value, event);
        }
      };
      if ($sniffer.hasEvent('input')) {
        element.on('input', listener);
      } else {
        var timeout;
        var deferListener = function(ev, input, origValue) {
          if (!timeout) {
            timeout = $browser.defer(function() {
              timeout = null;
              if (!input || input.value !== origValue) {
                listener(ev);
              }
            });
          }
        };
        element.on('keydown', function(event) {
          var key = event.keyCode;
          if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
            return;
          deferListener(event, this, this.value);
        });
        if ($sniffer.hasEvent('paste')) {
          element.on('paste cut', deferListener);
        }
      }
      element.on('change', listener);
      ctrl.$render = function() {
        element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
      };
    }
    function weekParser(isoWeek, existingDate) {
      if (isDate(isoWeek)) {
        return isoWeek;
      }
      if (isString(isoWeek)) {
        WEEK_REGEXP.lastIndex = 0;
        var parts = WEEK_REGEXP.exec(isoWeek);
        if (parts) {
          var year = +parts[1],
              week = +parts[2],
              hours = 0,
              minutes = 0,
              seconds = 0,
              milliseconds = 0,
              firstThurs = getFirstThursdayOfYear(year),
              addDays = (week - 1) * 7;
          if (existingDate) {
            hours = existingDate.getHours();
            minutes = existingDate.getMinutes();
            seconds = existingDate.getSeconds();
            milliseconds = existingDate.getMilliseconds();
          }
          return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
        }
      }
      return NaN;
    }
    function createDateParser(regexp, mapping) {
      return function(iso, date) {
        var parts,
            map;
        if (isDate(iso)) {
          return iso;
        }
        if (isString(iso)) {
          if (iso.charAt(0) == '"' && iso.charAt(iso.length - 1) == '"') {
            iso = iso.substring(1, iso.length - 1);
          }
          if (ISO_DATE_REGEXP.test(iso)) {
            return new Date(iso);
          }
          regexp.lastIndex = 0;
          parts = regexp.exec(iso);
          if (parts) {
            parts.shift();
            if (date) {
              map = {
                yyyy: date.getFullYear(),
                MM: date.getMonth() + 1,
                dd: date.getDate(),
                HH: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds(),
                sss: date.getMilliseconds() / 1000
              };
            } else {
              map = {
                yyyy: 1970,
                MM: 1,
                dd: 1,
                HH: 0,
                mm: 0,
                ss: 0,
                sss: 0
              };
            }
            forEach(parts, function(part, index) {
              if (index < mapping.length) {
                map[mapping[index]] = +part;
              }
            });
            return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
          }
        }
        return NaN;
      };
    }
    function createDateInputType(type, regexp, parseDate, format) {
      return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
        badInputChecker(scope, element, attr, ctrl);
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        var timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
        var previousDate;
        ctrl.$$parserName = type;
        ctrl.$parsers.push(function(value) {
          if (ctrl.$isEmpty(value))
            return null;
          if (regexp.test(value)) {
            var parsedDate = parseDate(value, previousDate);
            if (timezone === 'UTC') {
              parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
            }
            return parsedDate;
          }
          return undefined;
        });
        ctrl.$formatters.push(function(value) {
          if (value && !isDate(value)) {
            throw $ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
          }
          if (isValidDate(value)) {
            previousDate = value;
            if (previousDate && timezone === 'UTC') {
              var timezoneOffset = 60000 * previousDate.getTimezoneOffset();
              previousDate = new Date(previousDate.getTime() + timezoneOffset);
            }
            return $filter('date')(value, format, timezone);
          } else {
            previousDate = null;
            return '';
          }
        });
        if (isDefined(attr.min) || attr.ngMin) {
          var minVal;
          ctrl.$validators.min = function(value) {
            return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
          };
          attr.$observe('min', function(val) {
            minVal = parseObservedDateValue(val);
            ctrl.$validate();
          });
        }
        if (isDefined(attr.max) || attr.ngMax) {
          var maxVal;
          ctrl.$validators.max = function(value) {
            return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
          };
          attr.$observe('max', function(val) {
            maxVal = parseObservedDateValue(val);
            ctrl.$validate();
          });
        }
        function isValidDate(value) {
          return value && !(value.getTime && value.getTime() !== value.getTime());
        }
        function parseObservedDateValue(val) {
          return isDefined(val) ? (isDate(val) ? val : parseDate(val)) : undefined;
        }
      };
    }
    function badInputChecker(scope, element, attr, ctrl) {
      var node = element[0];
      var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
      if (nativeValidation) {
        ctrl.$parsers.push(function(value) {
          var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
          return validity.badInput && !validity.typeMismatch ? undefined : value;
        });
      }
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      badInputChecker(scope, element, attr, ctrl);
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      ctrl.$$parserName = 'number';
      ctrl.$parsers.push(function(value) {
        if (ctrl.$isEmpty(value))
          return null;
        if (NUMBER_REGEXP.test(value))
          return parseFloat(value);
        return undefined;
      });
      ctrl.$formatters.push(function(value) {
        if (!ctrl.$isEmpty(value)) {
          if (!isNumber(value)) {
            throw $ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
          }
          value = value.toString();
        }
        return value;
      });
      if (attr.min || attr.ngMin) {
        var minVal;
        ctrl.$validators.min = function(value) {
          return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
        };
        attr.$observe('min', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          minVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ctrl.$validate();
        });
      }
      if (attr.max || attr.ngMax) {
        var maxVal;
        ctrl.$validators.max = function(value) {
          return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
        };
        attr.$observe('max', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          maxVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ctrl.$validate();
        });
      }
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
      ctrl.$$parserName = 'url';
      ctrl.$validators.url = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
      };
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
      ctrl.$$parserName = 'email';
      ctrl.$validators.email = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
      };
    }
    function radioInputType(scope, element, attr, ctrl) {
      if (isUndefined(attr.name)) {
        element.attr('name', nextUid());
      }
      var listener = function(ev) {
        if (element[0].checked) {
          ctrl.$setViewValue(attr.value, ev && ev.type);
        }
      };
      element.on('click', listener);
      ctrl.$render = function() {
        var value = attr.value;
        element[0].checked = (value == ctrl.$viewValue);
      };
      attr.$observe('value', ctrl.$render);
    }
    function parseConstantExpr($parse, context, name, expression, fallback) {
      var parseFn;
      if (isDefined(expression)) {
        parseFn = $parse(expression);
        if (!parseFn.constant) {
          throw minErr('ngModel')('constexpr', 'Expected constant expression for `{0}`, but saw ' + '`{1}`.', name, expression);
        }
        return parseFn(context);
      }
      return fallback;
    }
    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
      var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
      var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);
      var listener = function(ev) {
        ctrl.$setViewValue(element[0].checked, ev && ev.type);
      };
      element.on('click', listener);
      ctrl.$render = function() {
        element[0].checked = ctrl.$viewValue;
      };
      ctrl.$isEmpty = function(value) {
        return value === false;
      };
      ctrl.$formatters.push(function(value) {
        return equals(value, trueValue);
      });
      ctrl.$parsers.push(function(value) {
        return value ? trueValue : falseValue;
      });
    }
    var inputDirective = ['$browser', '$sniffer', '$filter', '$parse', function($browser, $sniffer, $filter, $parse) {
      return {
        restrict: 'E',
        require: ['?ngModel'],
        link: {pre: function(scope, element, attr, ctrls) {
            if (ctrls[0]) {
              (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse);
            }
          }}
      };
    }];
    var VALID_CLASS = 'ng-valid',
        INVALID_CLASS = 'ng-invalid',
        PRISTINE_CLASS = 'ng-pristine',
        DIRTY_CLASS = 'ng-dirty',
        UNTOUCHED_CLASS = 'ng-untouched',
        TOUCHED_CLASS = 'ng-touched',
        PENDING_CLASS = 'ng-pending';
    var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$rootScope', '$q', '$interpolate', function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
      this.$viewValue = Number.NaN;
      this.$modelValue = Number.NaN;
      this.$$rawModelValue = undefined;
      this.$validators = {};
      this.$asyncValidators = {};
      this.$parsers = [];
      this.$formatters = [];
      this.$viewChangeListeners = [];
      this.$untouched = true;
      this.$touched = false;
      this.$pristine = true;
      this.$dirty = false;
      this.$valid = true;
      this.$invalid = false;
      this.$error = {};
      this.$$success = {};
      this.$pending = undefined;
      this.$name = $interpolate($attr.name || '', false)($scope);
      var parsedNgModel = $parse($attr.ngModel),
          parsedNgModelAssign = parsedNgModel.assign,
          ngModelGet = parsedNgModel,
          ngModelSet = parsedNgModelAssign,
          pendingDebounce = null,
          ctrl = this;
      this.$$setOptions = function(options) {
        ctrl.$options = options;
        if (options && options.getterSetter) {
          var invokeModelGetter = $parse($attr.ngModel + '()'),
              invokeModelSetter = $parse($attr.ngModel + '($$$p)');
          ngModelGet = function($scope) {
            var modelValue = parsedNgModel($scope);
            if (isFunction(modelValue)) {
              modelValue = invokeModelGetter($scope);
            }
            return modelValue;
          };
          ngModelSet = function($scope, newValue) {
            if (isFunction(parsedNgModel($scope))) {
              invokeModelSetter($scope, {$$$p: ctrl.$modelValue});
            } else {
              parsedNgModelAssign($scope, ctrl.$modelValue);
            }
          };
        } else if (!parsedNgModel.assign) {
          throw $ngModelMinErr('nonassign', "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
        }
      };
      this.$render = noop;
      this.$isEmpty = function(value) {
        return isUndefined(value) || value === '' || value === null || value !== value;
      };
      var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
          currentValidationRunId = 0;
      addSetValidityMethod({
        ctrl: this,
        $element: $element,
        set: function(object, property) {
          object[property] = true;
        },
        unset: function(object, property) {
          delete object[property];
        },
        parentForm: parentForm,
        $animate: $animate
      });
      this.$setPristine = function() {
        ctrl.$dirty = false;
        ctrl.$pristine = true;
        $animate.removeClass($element, DIRTY_CLASS);
        $animate.addClass($element, PRISTINE_CLASS);
      };
      this.$setDirty = function() {
        ctrl.$dirty = true;
        ctrl.$pristine = false;
        $animate.removeClass($element, PRISTINE_CLASS);
        $animate.addClass($element, DIRTY_CLASS);
        parentForm.$setDirty();
      };
      this.$setUntouched = function() {
        ctrl.$touched = false;
        ctrl.$untouched = true;
        $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
      };
      this.$setTouched = function() {
        ctrl.$touched = true;
        ctrl.$untouched = false;
        $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
      };
      this.$rollbackViewValue = function() {
        $timeout.cancel(pendingDebounce);
        ctrl.$viewValue = ctrl.$$lastCommittedViewValue;
        ctrl.$render();
      };
      this.$validate = function() {
        if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
          return;
        }
        var viewValue = ctrl.$$lastCommittedViewValue;
        var modelValue = ctrl.$$rawModelValue;
        var parserName = ctrl.$$parserName || 'parse';
        var parserValid = ctrl.$error[parserName] ? false : undefined;
        var prevValid = ctrl.$valid;
        var prevModelValue = ctrl.$modelValue;
        var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
        ctrl.$$runValidators(parserValid, modelValue, viewValue, function(allValid) {
          if (!allowInvalid && prevValid !== allValid) {
            ctrl.$modelValue = allValid ? modelValue : undefined;
            if (ctrl.$modelValue !== prevModelValue) {
              ctrl.$$writeModelToScope();
            }
          }
        });
      };
      this.$$runValidators = function(parseValid, modelValue, viewValue, doneCallback) {
        currentValidationRunId++;
        var localValidationRunId = currentValidationRunId;
        if (!processParseErrors(parseValid)) {
          validationDone(false);
          return;
        }
        if (!processSyncValidators()) {
          validationDone(false);
          return;
        }
        processAsyncValidators();
        function processParseErrors(parseValid) {
          var errorKey = ctrl.$$parserName || 'parse';
          if (parseValid === undefined) {
            setValidity(errorKey, null);
          } else {
            setValidity(errorKey, parseValid);
            if (!parseValid) {
              forEach(ctrl.$validators, function(v, name) {
                setValidity(name, null);
              });
              forEach(ctrl.$asyncValidators, function(v, name) {
                setValidity(name, null);
              });
              return false;
            }
          }
          return true;
        }
        function processSyncValidators() {
          var syncValidatorsValid = true;
          forEach(ctrl.$validators, function(validator, name) {
            var result = validator(modelValue, viewValue);
            syncValidatorsValid = syncValidatorsValid && result;
            setValidity(name, result);
          });
          if (!syncValidatorsValid) {
            forEach(ctrl.$asyncValidators, function(v, name) {
              setValidity(name, null);
            });
            return false;
          }
          return true;
        }
        function processAsyncValidators() {
          var validatorPromises = [];
          var allValid = true;
          forEach(ctrl.$asyncValidators, function(validator, name) {
            var promise = validator(modelValue, viewValue);
            if (!isPromiseLike(promise)) {
              throw $ngModelMinErr("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
            }
            setValidity(name, undefined);
            validatorPromises.push(promise.then(function() {
              setValidity(name, true);
            }, function(error) {
              allValid = false;
              setValidity(name, false);
            }));
          });
          if (!validatorPromises.length) {
            validationDone(true);
          } else {
            $q.all(validatorPromises).then(function() {
              validationDone(allValid);
            }, noop);
          }
        }
        function setValidity(name, isValid) {
          if (localValidationRunId === currentValidationRunId) {
            ctrl.$setValidity(name, isValid);
          }
        }
        function validationDone(allValid) {
          if (localValidationRunId === currentValidationRunId) {
            doneCallback(allValid);
          }
        }
      };
      this.$commitViewValue = function() {
        var viewValue = ctrl.$viewValue;
        $timeout.cancel(pendingDebounce);
        if (ctrl.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !ctrl.$$hasNativeValidators)) {
          return;
        }
        ctrl.$$lastCommittedViewValue = viewValue;
        if (ctrl.$pristine) {
          this.$setDirty();
        }
        this.$$parseAndValidate();
      };
      this.$$parseAndValidate = function() {
        var viewValue = ctrl.$$lastCommittedViewValue;
        var modelValue = viewValue;
        var parserValid = isUndefined(modelValue) ? undefined : true;
        if (parserValid) {
          for (var i = 0; i < ctrl.$parsers.length; i++) {
            modelValue = ctrl.$parsers[i](modelValue);
            if (isUndefined(modelValue)) {
              parserValid = false;
              break;
            }
          }
        }
        if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
          ctrl.$modelValue = ngModelGet($scope);
        }
        var prevModelValue = ctrl.$modelValue;
        var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
        ctrl.$$rawModelValue = modelValue;
        if (allowInvalid) {
          ctrl.$modelValue = modelValue;
          writeToModelIfNeeded();
        }
        ctrl.$$runValidators(parserValid, modelValue, ctrl.$$lastCommittedViewValue, function(allValid) {
          if (!allowInvalid) {
            ctrl.$modelValue = allValid ? modelValue : undefined;
            writeToModelIfNeeded();
          }
        });
        function writeToModelIfNeeded() {
          if (ctrl.$modelValue !== prevModelValue) {
            ctrl.$$writeModelToScope();
          }
        }
      };
      this.$$writeModelToScope = function() {
        ngModelSet($scope, ctrl.$modelValue);
        forEach(ctrl.$viewChangeListeners, function(listener) {
          try {
            listener();
          } catch (e) {
            $exceptionHandler(e);
          }
        });
      };
      this.$setViewValue = function(value, trigger) {
        ctrl.$viewValue = value;
        if (!ctrl.$options || ctrl.$options.updateOnDefault) {
          ctrl.$$debounceViewValueCommit(trigger);
        }
      };
      this.$$debounceViewValueCommit = function(trigger) {
        var debounceDelay = 0,
            options = ctrl.$options,
            debounce;
        if (options && isDefined(options.debounce)) {
          debounce = options.debounce;
          if (isNumber(debounce)) {
            debounceDelay = debounce;
          } else if (isNumber(debounce[trigger])) {
            debounceDelay = debounce[trigger];
          } else if (isNumber(debounce['default'])) {
            debounceDelay = debounce['default'];
          }
        }
        $timeout.cancel(pendingDebounce);
        if (debounceDelay) {
          pendingDebounce = $timeout(function() {
            ctrl.$commitViewValue();
          }, debounceDelay);
        } else if ($rootScope.$$phase) {
          ctrl.$commitViewValue();
        } else {
          $scope.$apply(function() {
            ctrl.$commitViewValue();
          });
        }
      };
      $scope.$watch(function ngModelWatch() {
        var modelValue = ngModelGet($scope);
        if (modelValue !== ctrl.$modelValue) {
          ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
          var formatters = ctrl.$formatters,
              idx = formatters.length;
          var viewValue = modelValue;
          while (idx--) {
            viewValue = formatters[idx](viewValue);
          }
          if (ctrl.$viewValue !== viewValue) {
            ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
            ctrl.$render();
            ctrl.$$runValidators(undefined, modelValue, viewValue, noop);
          }
        }
        return modelValue;
      });
    }];
    var ngModelDirective = ['$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        require: ['ngModel', '^?form', '^?ngModelOptions'],
        controller: NgModelController,
        priority: 1,
        compile: function ngModelCompile(element) {
          element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);
          return {
            pre: function ngModelPreLink(scope, element, attr, ctrls) {
              var modelCtrl = ctrls[0],
                  formCtrl = ctrls[1] || nullFormCtrl;
              modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);
              formCtrl.$addControl(modelCtrl);
              attr.$observe('name', function(newValue) {
                if (modelCtrl.$name !== newValue) {
                  formCtrl.$$renameControl(modelCtrl, newValue);
                }
              });
              scope.$on('$destroy', function() {
                formCtrl.$removeControl(modelCtrl);
              });
            },
            post: function ngModelPostLink(scope, element, attr, ctrls) {
              var modelCtrl = ctrls[0];
              if (modelCtrl.$options && modelCtrl.$options.updateOn) {
                element.on(modelCtrl.$options.updateOn, function(ev) {
                  modelCtrl.$$debounceViewValueCommit(ev && ev.type);
                });
              }
              element.on('blur', function(ev) {
                if (modelCtrl.$touched)
                  return;
                if ($rootScope.$$phase) {
                  scope.$evalAsync(modelCtrl.$setTouched);
                } else {
                  scope.$apply(modelCtrl.$setTouched);
                }
              });
            }
          };
        }
      };
    }];
    var ngChangeDirective = valueFn({
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attr.ngChange);
        });
      }
    });
    var requiredDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          attr.required = true;
          ctrl.$validators.required = function(modelValue, viewValue) {
            return !attr.required || !ctrl.$isEmpty(viewValue);
          };
          attr.$observe('required', function() {
            ctrl.$validate();
          });
        }
      };
    };
    var patternDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var regexp,
              patternExp = attr.ngPattern || attr.pattern;
          attr.$observe('pattern', function(regex) {
            if (isString(regex) && regex.length > 0) {
              regex = new RegExp('^' + regex + '$');
            }
            if (regex && !regex.test) {
              throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp, regex, startingTag(elm));
            }
            regexp = regex || undefined;
            ctrl.$validate();
          });
          ctrl.$validators.pattern = function(value) {
            return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value);
          };
        }
      };
    };
    var maxlengthDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var maxlength = -1;
          attr.$observe('maxlength', function(value) {
            var intVal = int(value);
            maxlength = isNaN(intVal) ? -1 : intVal;
            ctrl.$validate();
          });
          ctrl.$validators.maxlength = function(modelValue, viewValue) {
            return (maxlength < 0) || ctrl.$isEmpty(modelValue) || (viewValue.length <= maxlength);
          };
        }
      };
    };
    var minlengthDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var minlength = 0;
          attr.$observe('minlength', function(value) {
            minlength = int(value) || 0;
            ctrl.$validate();
          });
          ctrl.$validators.minlength = function(modelValue, viewValue) {
            return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
          };
        }
      };
    };
    var ngListDirective = function() {
      return {
        restrict: 'A',
        priority: 100,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
          var ngList = element.attr(attr.$attr.ngList) || ', ';
          var trimValues = attr.ngTrim !== 'false';
          var separator = trimValues ? trim(ngList) : ngList;
          var parse = function(viewValue) {
            if (isUndefined(viewValue))
              return;
            var list = [];
            if (viewValue) {
              forEach(viewValue.split(separator), function(value) {
                if (value)
                  list.push(trimValues ? trim(value) : value);
              });
            }
            return list;
          };
          ctrl.$parsers.push(parse);
          ctrl.$formatters.push(function(value) {
            if (isArray(value)) {
              return value.join(ngList);
            }
            return undefined;
          });
          ctrl.$isEmpty = function(value) {
            return !value || !value.length;
          };
        }
      };
    };
    var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
    var ngValueDirective = function() {
      return {
        restrict: 'A',
        priority: 100,
        compile: function(tpl, tplAttr) {
          if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
            return function ngValueConstantLink(scope, elm, attr) {
              attr.$set('value', scope.$eval(attr.ngValue));
            };
          } else {
            return function ngValueLink(scope, elm, attr) {
              scope.$watch(attr.ngValue, function valueWatchAction(value) {
                attr.$set('value', value);
              });
            };
          }
        }
      };
    };
    var ngModelOptionsDirective = function() {
      return {
        restrict: 'A',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
          var that = this;
          this.$options = $scope.$eval($attrs.ngModelOptions);
          if (this.$options.updateOn !== undefined) {
            this.$options.updateOnDefault = false;
            this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function() {
              that.$options.updateOnDefault = true;
              return ' ';
            }));
          } else {
            this.$options.updateOnDefault = true;
          }
        }]
      };
    };
    function addSetValidityMethod(context) {
      var ctrl = context.ctrl,
          $element = context.$element,
          classCache = {},
          set = context.set,
          unset = context.unset,
          parentForm = context.parentForm,
          $animate = context.$animate;
      classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS));
      ctrl.$setValidity = setValidity;
      function setValidity(validationErrorKey, state, options) {
        if (state === undefined) {
          createAndSet('$pending', validationErrorKey, options);
        } else {
          unsetAndCleanup('$pending', validationErrorKey, options);
        }
        if (!isBoolean(state)) {
          unset(ctrl.$error, validationErrorKey, options);
          unset(ctrl.$$success, validationErrorKey, options);
        } else {
          if (state) {
            unset(ctrl.$error, validationErrorKey, options);
            set(ctrl.$$success, validationErrorKey, options);
          } else {
            set(ctrl.$error, validationErrorKey, options);
            unset(ctrl.$$success, validationErrorKey, options);
          }
        }
        if (ctrl.$pending) {
          cachedToggleClass(PENDING_CLASS, true);
          ctrl.$valid = ctrl.$invalid = undefined;
          toggleValidationCss('', null);
        } else {
          cachedToggleClass(PENDING_CLASS, false);
          ctrl.$valid = isObjectEmpty(ctrl.$error);
          ctrl.$invalid = !ctrl.$valid;
          toggleValidationCss('', ctrl.$valid);
        }
        var combinedState;
        if (ctrl.$pending && ctrl.$pending[validationErrorKey]) {
          combinedState = undefined;
        } else if (ctrl.$error[validationErrorKey]) {
          combinedState = false;
        } else if (ctrl.$$success[validationErrorKey]) {
          combinedState = true;
        } else {
          combinedState = null;
        }
        toggleValidationCss(validationErrorKey, combinedState);
        parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
      }
      function createAndSet(name, value, options) {
        if (!ctrl[name]) {
          ctrl[name] = {};
        }
        set(ctrl[name], value, options);
      }
      function unsetAndCleanup(name, value, options) {
        if (ctrl[name]) {
          unset(ctrl[name], value, options);
        }
        if (isObjectEmpty(ctrl[name])) {
          ctrl[name] = undefined;
        }
      }
      function cachedToggleClass(className, switchValue) {
        if (switchValue && !classCache[className]) {
          $animate.addClass($element, className);
          classCache[className] = true;
        } else if (!switchValue && classCache[className]) {
          $animate.removeClass($element, className);
          classCache[className] = false;
        }
      }
      function toggleValidationCss(validationErrorKey, isValid) {
        validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
        cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === true);
        cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === false);
      }
    }
    function isObjectEmpty(obj) {
      if (obj) {
        for (var prop in obj) {
          return false;
        }
      }
      return true;
    }
    var ngBindDirective = ['$compile', function($compile) {
      return {
        restrict: 'AC',
        compile: function ngBindCompile(templateElement) {
          $compile.$$addBindingClass(templateElement);
          return function ngBindLink(scope, element, attr) {
            $compile.$$addBindingInfo(element, attr.ngBind);
            element = element[0];
            scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
              element.textContent = value === undefined ? '' : value;
            });
          };
        }
      };
    }];
    var ngBindTemplateDirective = ['$interpolate', '$compile', function($interpolate, $compile) {
      return {compile: function ngBindTemplateCompile(templateElement) {
          $compile.$$addBindingClass(templateElement);
          return function ngBindTemplateLink(scope, element, attr) {
            var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
            $compile.$$addBindingInfo(element, interpolateFn.expressions);
            element = element[0];
            attr.$observe('ngBindTemplate', function(value) {
              element.textContent = value === undefined ? '' : value;
            });
          };
        }};
    }];
    var ngBindHtmlDirective = ['$sce', '$parse', '$compile', function($sce, $parse, $compile) {
      return {
        restrict: 'A',
        compile: function ngBindHtmlCompile(tElement, tAttrs) {
          var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
          var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function getStringValue(value) {
            return (value || '').toString();
          });
          $compile.$$addBindingClass(tElement);
          return function ngBindHtmlLink(scope, element, attr) {
            $compile.$$addBindingInfo(element, attr.ngBindHtml);
            scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
              element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
            });
          };
        }
      };
    }];
    function classDirective(name, selector) {
      name = 'ngClass' + name;
      return ['$animate', function($animate) {
        return {
          restrict: 'AC',
          link: function(scope, element, attr) {
            var oldVal;
            scope.$watch(attr[name], ngClassWatchAction, true);
            attr.$observe('class', function(value) {
              ngClassWatchAction(scope.$eval(attr[name]));
            });
            if (name !== 'ngClass') {
              scope.$watch('$index', function($index, old$index) {
                var mod = $index & 1;
                if (mod !== (old$index & 1)) {
                  var classes = arrayClasses(scope.$eval(attr[name]));
                  mod === selector ? addClasses(classes) : removeClasses(classes);
                }
              });
            }
            function addClasses(classes) {
              var newClasses = digestClassCounts(classes, 1);
              attr.$addClass(newClasses);
            }
            function removeClasses(classes) {
              var newClasses = digestClassCounts(classes, -1);
              attr.$removeClass(newClasses);
            }
            function digestClassCounts(classes, count) {
              var classCounts = element.data('$classCounts') || {};
              var classesToUpdate = [];
              forEach(classes, function(className) {
                if (count > 0 || classCounts[className]) {
                  classCounts[className] = (classCounts[className] || 0) + count;
                  if (classCounts[className] === +(count > 0)) {
                    classesToUpdate.push(className);
                  }
                }
              });
              element.data('$classCounts', classCounts);
              return classesToUpdate.join(' ');
            }
            function updateClasses(oldClasses, newClasses) {
              var toAdd = arrayDifference(newClasses, oldClasses);
              var toRemove = arrayDifference(oldClasses, newClasses);
              toAdd = digestClassCounts(toAdd, 1);
              toRemove = digestClassCounts(toRemove, -1);
              if (toAdd && toAdd.length) {
                $animate.addClass(element, toAdd);
              }
              if (toRemove && toRemove.length) {
                $animate.removeClass(element, toRemove);
              }
            }
            function ngClassWatchAction(newVal) {
              if (selector === true || scope.$index % 2 === selector) {
                var newClasses = arrayClasses(newVal || []);
                if (!oldVal) {
                  addClasses(newClasses);
                } else if (!equals(newVal, oldVal)) {
                  var oldClasses = arrayClasses(oldVal);
                  updateClasses(oldClasses, newClasses);
                }
              }
              oldVal = shallowCopy(newVal);
            }
          }
        };
        function arrayDifference(tokens1, tokens2) {
          var values = [];
          outer: for (var i = 0; i < tokens1.length; i++) {
            var token = tokens1[i];
            for (var j = 0; j < tokens2.length; j++) {
              if (token == tokens2[j])
                continue outer;
            }
            values.push(token);
          }
          return values;
        }
        function arrayClasses(classVal) {
          if (isArray(classVal)) {
            return classVal;
          } else if (isString(classVal)) {
            return classVal.split(' ');
          } else if (isObject(classVal)) {
            var classes = [];
            forEach(classVal, function(v, k) {
              if (v) {
                classes = classes.concat(k.split(' '));
              }
            });
            return classes;
          }
          return classVal;
        }
      }];
    }
    var ngClassDirective = classDirective('', true);
    var ngClassOddDirective = classDirective('Odd', 0);
    var ngClassEvenDirective = classDirective('Even', 1);
    var ngCloakDirective = ngDirective({compile: function(element, attr) {
        attr.$set('ngCloak', undefined);
        element.removeClass('ng-cloak');
      }});
    var ngControllerDirective = [function() {
      return {
        restrict: 'A',
        scope: true,
        controller: '@',
        priority: 500
      };
    }];
    var ngEventDirectives = {};
    var forceAsyncEvents = {
      'blur': true,
      'focus': true
    };
    forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function(eventName) {
      var directiveName = directiveNormalize('ng-' + eventName);
      ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
        return {
          restrict: 'A',
          compile: function($element, attr) {
            var fn = $parse(attr[directiveName], null, true);
            return function ngEventHandler(scope, element) {
              element.on(eventName, function(event) {
                var callback = function() {
                  fn(scope, {$event: event});
                };
                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            };
          }
        };
      }];
    });
    var ngIfDirective = ['$animate', function($animate) {
      return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        $$tlb: true,
        link: function($scope, $element, $attr, ctrl, $transclude) {
          var block,
              childScope,
              previousElements;
          $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
            if (value) {
              if (!childScope) {
                $transclude(function(clone, newScope) {
                  childScope = newScope;
                  clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                  block = {clone: clone};
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            } else {
              if (previousElements) {
                previousElements.remove();
                previousElements = null;
              }
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }
              if (block) {
                previousElements = getBlockNodes(block.clone);
                $animate.leave(previousElements).then(function() {
                  previousElements = null;
                });
                block = null;
              }
            }
          });
        }
      };
    }];
    var ngIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate', '$sce', function($templateRequest, $anchorScroll, $animate, $sce) {
      return {
        restrict: 'ECA',
        priority: 400,
        terminal: true,
        transclude: 'element',
        controller: angular.noop,
        compile: function(element, attr) {
          var srcExp = attr.ngInclude || attr.src,
              onloadExp = attr.onload || '',
              autoScrollExp = attr.autoscroll;
          return function(scope, $element, $attr, ctrl, $transclude) {
            var changeCounter = 0,
                currentScope,
                previousElement,
                currentElement;
            var cleanupLastIncludeContent = function() {
              if (previousElement) {
                previousElement.remove();
                previousElement = null;
              }
              if (currentScope) {
                currentScope.$destroy();
                currentScope = null;
              }
              if (currentElement) {
                $animate.leave(currentElement).then(function() {
                  previousElement = null;
                });
                previousElement = currentElement;
                currentElement = null;
              }
            };
            scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
              var afterAnimation = function() {
                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              };
              var thisChangeId = ++changeCounter;
              if (src) {
                $templateRequest(src, true).then(function(response) {
                  if (thisChangeId !== changeCounter)
                    return;
                  var newScope = scope.$new();
                  ctrl.template = response;
                  var clone = $transclude(newScope, function(clone) {
                    cleanupLastIncludeContent();
                    $animate.enter(clone, null, $element).then(afterAnimation);
                  });
                  currentScope = newScope;
                  currentElement = clone;
                  currentScope.$emit('$includeContentLoaded', src);
                  scope.$eval(onloadExp);
                }, function() {
                  if (thisChangeId === changeCounter) {
                    cleanupLastIncludeContent();
                    scope.$emit('$includeContentError', src);
                  }
                });
                scope.$emit('$includeContentRequested', src);
              } else {
                cleanupLastIncludeContent();
                ctrl.template = null;
              }
            });
          };
        }
      };
    }];
    var ngIncludeFillContentDirective = ['$compile', function($compile) {
      return {
        restrict: 'ECA',
        priority: -400,
        require: 'ngInclude',
        link: function(scope, $element, $attr, ctrl) {
          if (/SVG/.test($element[0].toString())) {
            $element.empty();
            $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function namespaceAdaptedClone(clone) {
              $element.append(clone);
            }, {futureParentElement: $element});
            return;
          }
          $element.html(ctrl.template);
          $compile($element.contents())(scope);
        }
      };
    }];
    var ngInitDirective = ngDirective({
      priority: 450,
      compile: function() {
        return {pre: function(scope, element, attrs) {
            scope.$eval(attrs.ngInit);
          }};
      }
    });
    var ngNonBindableDirective = ngDirective({
      terminal: true,
      priority: 1000
    });
    var ngPluralizeDirective = ['$locale', '$interpolate', function($locale, $interpolate) {
      var BRACE = /{}/g,
          IS_WHEN = /^when(Minus)?(.+)$/;
      return {
        restrict: 'EA',
        link: function(scope, element, attr) {
          var numberExp = attr.count,
              whenExp = attr.$attr.when && element.attr(attr.$attr.when),
              offset = attr.offset || 0,
              whens = scope.$eval(whenExp) || {},
              whensExpFns = {},
              startSymbol = $interpolate.startSymbol(),
              endSymbol = $interpolate.endSymbol(),
              braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
              watchRemover = angular.noop,
              lastCount;
          forEach(attr, function(expression, attributeName) {
            var tmpMatch = IS_WHEN.exec(attributeName);
            if (tmpMatch) {
              var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
              whens[whenKey] = element.attr(attr.$attr[attributeName]);
            }
          });
          forEach(whens, function(expression, key) {
            whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
          });
          scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
            var count = parseFloat(newVal);
            var countIsNaN = isNaN(count);
            if (!countIsNaN && !(count in whens)) {
              count = $locale.pluralCat(count - offset);
            }
            if ((count !== lastCount) && !(countIsNaN && isNaN(lastCount))) {
              watchRemover();
              watchRemover = scope.$watch(whensExpFns[count], updateElementText);
              lastCount = count;
            }
          });
          function updateElementText(newText) {
            element.text(newText || '');
          }
        }
      };
    }];
    var ngRepeatDirective = ['$parse', '$animate', function($parse, $animate) {
      var NG_REMOVED = '$$NG_REMOVED';
      var ngRepeatMinErr = minErr('ngRepeat');
      var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
        scope[valueIdentifier] = value;
        if (keyIdentifier)
          scope[keyIdentifier] = key;
        scope.$index = index;
        scope.$first = (index === 0);
        scope.$last = (index === (arrayLength - 1));
        scope.$middle = !(scope.$first || scope.$last);
        scope.$odd = !(scope.$even = (index & 1) === 0);
      };
      var getBlockStart = function(block) {
        return block.clone[0];
      };
      var getBlockEnd = function(block) {
        return block.clone[block.clone.length - 1];
      };
      return {
        restrict: 'A',
        multiElement: true,
        transclude: 'element',
        priority: 1000,
        terminal: true,
        $$tlb: true,
        compile: function ngRepeatCompile($element, $attr) {
          var expression = $attr.ngRepeat;
          var ngRepeatEndComment = document.createComment(' end ngRepeat: ' + expression + ' ');
          var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          if (!match) {
            throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
          }
          var lhs = match[1];
          var rhs = match[2];
          var aliasAs = match[3];
          var trackByExp = match[4];
          match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
          if (!match) {
            throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
          }
          var valueIdentifier = match[3] || match[1];
          var keyIdentifier = match[2];
          if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(aliasAs))) {
            throw ngRepeatMinErr('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
          }
          var trackByExpGetter,
              trackByIdExpFn,
              trackByIdArrayFn,
              trackByIdObjFn;
          var hashFnLocals = {$id: hashKey};
          if (trackByExp) {
            trackByExpGetter = $parse(trackByExp);
          } else {
            trackByIdArrayFn = function(key, value) {
              return hashKey(value);
            };
            trackByIdObjFn = function(key) {
              return key;
            };
          }
          return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {
            if (trackByExpGetter) {
              trackByIdExpFn = function(key, value, index) {
                if (keyIdentifier)
                  hashFnLocals[keyIdentifier] = key;
                hashFnLocals[valueIdentifier] = value;
                hashFnLocals.$index = index;
                return trackByExpGetter($scope, hashFnLocals);
              };
            }
            var lastBlockMap = createMap();
            $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
              var index,
                  length,
                  previousNode = $element[0],
                  nextNode,
                  nextBlockMap = createMap(),
                  collectionLength,
                  key,
                  value,
                  trackById,
                  trackByIdFn,
                  collectionKeys,
                  block,
                  nextBlockOrder,
                  elementsToRemove;
              if (aliasAs) {
                $scope[aliasAs] = collection;
              }
              if (isArrayLike(collection)) {
                collectionKeys = collection;
                trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
              } else {
                trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                collectionKeys = [];
                for (var itemKey in collection) {
                  if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) != '$') {
                    collectionKeys.push(itemKey);
                  }
                }
                collectionKeys.sort();
              }
              collectionLength = collectionKeys.length;
              nextBlockOrder = new Array(collectionLength);
              for (index = 0; index < collectionLength; index++) {
                key = (collection === collectionKeys) ? index : collectionKeys[index];
                value = collection[key];
                trackById = trackByIdFn(key, value, index);
                if (lastBlockMap[trackById]) {
                  block = lastBlockMap[trackById];
                  delete lastBlockMap[trackById];
                  nextBlockMap[trackById] = block;
                  nextBlockOrder[index] = block;
                } else if (nextBlockMap[trackById]) {
                  forEach(nextBlockOrder, function(block) {
                    if (block && block.scope)
                      lastBlockMap[block.id] = block;
                  });
                  throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                } else {
                  nextBlockOrder[index] = {
                    id: trackById,
                    scope: undefined,
                    clone: undefined
                  };
                  nextBlockMap[trackById] = true;
                }
              }
              for (var blockKey in lastBlockMap) {
                block = lastBlockMap[blockKey];
                elementsToRemove = getBlockNodes(block.clone);
                $animate.leave(elementsToRemove);
                if (elementsToRemove[0].parentNode) {
                  for (index = 0, length = elementsToRemove.length; index < length; index++) {
                    elementsToRemove[index][NG_REMOVED] = true;
                  }
                }
                block.scope.$destroy();
              }
              for (index = 0; index < collectionLength; index++) {
                key = (collection === collectionKeys) ? index : collectionKeys[index];
                value = collection[key];
                block = nextBlockOrder[index];
                if (block.scope) {
                  nextNode = previousNode;
                  do {
                    nextNode = nextNode.nextSibling;
                  } while (nextNode && nextNode[NG_REMOVED]);
                  if (getBlockStart(block) != nextNode) {
                    $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode));
                  }
                  previousNode = getBlockEnd(block);
                  updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                } else {
                  $transclude(function ngRepeatTransclude(clone, scope) {
                    block.scope = scope;
                    var endNode = ngRepeatEndComment.cloneNode(false);
                    clone[clone.length++] = endNode;
                    $animate.enter(clone, null, jqLite(previousNode));
                    previousNode = endNode;
                    block.clone = clone;
                    nextBlockMap[block.id] = block;
                    updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                  });
                }
              }
              lastBlockMap = nextBlockMap;
            });
          };
        }
      };
    }];
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
    var ngShowDirective = ['$animate', function($animate) {
      return {
        restrict: 'A',
        multiElement: true,
        link: function(scope, element, attr) {
          scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
            $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS});
          });
        }
      };
    }];
    var ngHideDirective = ['$animate', function($animate) {
      return {
        restrict: 'A',
        multiElement: true,
        link: function(scope, element, attr) {
          scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
            $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS});
          });
        }
      };
    }];
    var ngStyleDirective = ngDirective(function(scope, element, attr) {
      scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
        if (oldStyles && (newStyles !== oldStyles)) {
          forEach(oldStyles, function(val, style) {
            element.css(style, '');
          });
        }
        if (newStyles)
          element.css(newStyles);
      }, true);
    });
    var ngSwitchDirective = ['$animate', function($animate) {
      return {
        restrict: 'EA',
        require: 'ngSwitch',
        controller: ['$scope', function ngSwitchController() {
          this.cases = {};
        }],
        link: function(scope, element, attr, ngSwitchController) {
          var watchExpr = attr.ngSwitch || attr.on,
              selectedTranscludes = [],
              selectedElements = [],
              previousLeaveAnimations = [],
              selectedScopes = [];
          var spliceFactory = function(array, index) {
            return function() {
              array.splice(index, 1);
            };
          };
          scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
            var i,
                ii;
            for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) {
              $animate.cancel(previousLeaveAnimations[i]);
            }
            previousLeaveAnimations.length = 0;
            for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
              var selected = getBlockNodes(selectedElements[i].clone);
              selectedScopes[i].$destroy();
              var promise = previousLeaveAnimations[i] = $animate.leave(selected);
              promise.then(spliceFactory(previousLeaveAnimations, i));
            }
            selectedElements.length = 0;
            selectedScopes.length = 0;
            if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
              forEach(selectedTranscludes, function(selectedTransclude) {
                selectedTransclude.transclude(function(caseElement, selectedScope) {
                  selectedScopes.push(selectedScope);
                  var anchor = selectedTransclude.element;
                  caseElement[caseElement.length++] = document.createComment(' end ngSwitchWhen: ');
                  var block = {clone: caseElement};
                  selectedElements.push(block);
                  $animate.enter(caseElement, anchor.parent(), anchor);
                });
              });
            }
          });
        }
      };
    }];
    var ngSwitchWhenDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function(scope, element, attrs, ctrl, $transclude) {
        ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);
        ctrl.cases['!' + attrs.ngSwitchWhen].push({
          transclude: $transclude,
          element: element
        });
      }
    });
    var ngSwitchDefaultDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function(scope, element, attr, ctrl, $transclude) {
        ctrl.cases['?'] = (ctrl.cases['?'] || []);
        ctrl.cases['?'].push({
          transclude: $transclude,
          element: element
        });
      }
    });
    var ngTranscludeDirective = ngDirective({
      restrict: 'EAC',
      link: function($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
        }
        $transclude(function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    });
    var scriptDirective = ['$templateCache', function($templateCache) {
      return {
        restrict: 'E',
        terminal: true,
        compile: function(element, attr) {
          if (attr.type == 'text/ng-template') {
            var templateUrl = attr.id,
                text = element[0].text;
            $templateCache.put(templateUrl, text);
          }
        }
      };
    }];
    var ngOptionsMinErr = minErr('ngOptions');
    var ngOptionsDirective = valueFn({
      restrict: 'A',
      terminal: true
    });
    var selectDirective = ['$compile', '$parse', function($compile, $parse) {
      var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
          nullModelCtrl = {$setViewValue: noop};
      return {
        restrict: 'E',
        require: ['select', '?ngModel'],
        controller: ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {
          var self = this,
              optionsMap = {},
              ngModelCtrl = nullModelCtrl,
              nullOption,
              unknownOption;
          self.databound = $attrs.ngModel;
          self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
            ngModelCtrl = ngModelCtrl_;
            nullOption = nullOption_;
            unknownOption = unknownOption_;
          };
          self.addOption = function(value, element) {
            assertNotHasOwnProperty(value, '"option value"');
            optionsMap[value] = true;
            if (ngModelCtrl.$viewValue == value) {
              $element.val(value);
              if (unknownOption.parent())
                unknownOption.remove();
            }
            if (element && element[0].hasAttribute('selected')) {
              element[0].selected = true;
            }
          };
          self.removeOption = function(value) {
            if (this.hasOption(value)) {
              delete optionsMap[value];
              if (ngModelCtrl.$viewValue === value) {
                this.renderUnknownOption(value);
              }
            }
          };
          self.renderUnknownOption = function(val) {
            var unknownVal = '? ' + hashKey(val) + ' ?';
            unknownOption.val(unknownVal);
            $element.prepend(unknownOption);
            $element.val(unknownVal);
            unknownOption.prop('selected', true);
          };
          self.hasOption = function(value) {
            return optionsMap.hasOwnProperty(value);
          };
          $scope.$on('$destroy', function() {
            self.renderUnknownOption = noop;
          });
        }],
        link: function(scope, element, attr, ctrls) {
          if (!ctrls[1])
            return;
          var selectCtrl = ctrls[0],
              ngModelCtrl = ctrls[1],
              multiple = attr.multiple,
              optionsExp = attr.ngOptions,
              nullOption = false,
              emptyOption,
              renderScheduled = false,
              optionTemplate = jqLite(document.createElement('option')),
              optGroupTemplate = jqLite(document.createElement('optgroup')),
              unknownOption = optionTemplate.clone();
          for (var i = 0,
              children = element.children(),
              ii = children.length; i < ii; i++) {
            if (children[i].value === '') {
              emptyOption = nullOption = children.eq(i);
              break;
            }
          }
          selectCtrl.init(ngModelCtrl, nullOption, unknownOption);
          if (multiple) {
            ngModelCtrl.$isEmpty = function(value) {
              return !value || value.length === 0;
            };
          }
          if (optionsExp)
            setupAsOptions(scope, element, ngModelCtrl);
          else if (multiple)
            setupAsMultiple(scope, element, ngModelCtrl);
          else
            setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
          function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
            ngModelCtrl.$render = function() {
              var viewValue = ngModelCtrl.$viewValue;
              if (selectCtrl.hasOption(viewValue)) {
                if (unknownOption.parent())
                  unknownOption.remove();
                selectElement.val(viewValue);
                if (viewValue === '')
                  emptyOption.prop('selected', true);
              } else {
                if (isUndefined(viewValue) && emptyOption) {
                  selectElement.val('');
                } else {
                  selectCtrl.renderUnknownOption(viewValue);
                }
              }
            };
            selectElement.on('change', function() {
              scope.$apply(function() {
                if (unknownOption.parent())
                  unknownOption.remove();
                ngModelCtrl.$setViewValue(selectElement.val());
              });
            });
          }
          function setupAsMultiple(scope, selectElement, ctrl) {
            var lastView;
            ctrl.$render = function() {
              var items = new HashMap(ctrl.$viewValue);
              forEach(selectElement.find('option'), function(option) {
                option.selected = isDefined(items.get(option.value));
              });
            };
            scope.$watch(function selectMultipleWatch() {
              if (!equals(lastView, ctrl.$viewValue)) {
                lastView = shallowCopy(ctrl.$viewValue);
                ctrl.$render();
              }
            });
            selectElement.on('change', function() {
              scope.$apply(function() {
                var array = [];
                forEach(selectElement.find('option'), function(option) {
                  if (option.selected) {
                    array.push(option.value);
                  }
                });
                ctrl.$setViewValue(array);
              });
            });
          }
          function setupAsOptions(scope, selectElement, ctrl) {
            var match;
            if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
              throw ngOptionsMinErr('iexp', "Expected expression in form of " + "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" + " but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
            }
            var displayFn = $parse(match[2] || match[1]),
                valueName = match[4] || match[6],
                selectAs = / as /.test(match[0]) && match[1],
                selectAsFn = selectAs ? $parse(selectAs) : null,
                keyName = match[5],
                groupByFn = $parse(match[3] || ''),
                valueFn = $parse(match[2] ? match[1] : valueName),
                valuesFn = $parse(match[7]),
                track = match[8],
                trackFn = track ? $parse(match[8]) : null,
                trackKeysCache = {},
                optionGroupsCache = [[{
                  element: selectElement,
                  label: ''
                }]],
                locals = {};
            if (nullOption) {
              $compile(nullOption)(scope);
              nullOption.removeClass('ng-scope');
              nullOption.remove();
            }
            selectElement.empty();
            selectElement.on('change', selectionChanged);
            ctrl.$render = render;
            scope.$watchCollection(valuesFn, scheduleRendering);
            scope.$watchCollection(getLabels, scheduleRendering);
            if (multiple) {
              scope.$watchCollection(function() {
                return ctrl.$modelValue;
              }, scheduleRendering);
            }
            function callExpression(exprFn, key, value) {
              locals[valueName] = value;
              if (keyName)
                locals[keyName] = key;
              return exprFn(scope, locals);
            }
            function selectionChanged() {
              scope.$apply(function() {
                var collection = valuesFn(scope) || [];
                var viewValue;
                if (multiple) {
                  viewValue = [];
                  forEach(selectElement.val(), function(selectedKey) {
                    selectedKey = trackFn ? trackKeysCache[selectedKey] : selectedKey;
                    viewValue.push(getViewValue(selectedKey, collection[selectedKey]));
                  });
                } else {
                  var selectedKey = trackFn ? trackKeysCache[selectElement.val()] : selectElement.val();
                  viewValue = getViewValue(selectedKey, collection[selectedKey]);
                }
                ctrl.$setViewValue(viewValue);
                render();
              });
            }
            function getViewValue(key, value) {
              if (key === '?') {
                return undefined;
              } else if (key === '') {
                return null;
              } else {
                var viewValueFn = selectAsFn ? selectAsFn : valueFn;
                return callExpression(viewValueFn, key, value);
              }
            }
            function getLabels() {
              var values = valuesFn(scope);
              var toDisplay;
              if (values && isArray(values)) {
                toDisplay = new Array(values.length);
                for (var i = 0,
                    ii = values.length; i < ii; i++) {
                  toDisplay[i] = callExpression(displayFn, i, values[i]);
                }
                return toDisplay;
              } else if (values) {
                toDisplay = {};
                for (var prop in values) {
                  if (values.hasOwnProperty(prop)) {
                    toDisplay[prop] = callExpression(displayFn, prop, values[prop]);
                  }
                }
              }
              return toDisplay;
            }
            function createIsSelectedFn(viewValue) {
              var selectedSet;
              if (multiple) {
                if (trackFn && isArray(viewValue)) {
                  selectedSet = new HashMap([]);
                  for (var trackIndex = 0; trackIndex < viewValue.length; trackIndex++) {
                    selectedSet.put(callExpression(trackFn, null, viewValue[trackIndex]), true);
                  }
                } else {
                  selectedSet = new HashMap(viewValue);
                }
              } else if (trackFn) {
                viewValue = callExpression(trackFn, null, viewValue);
              }
              return function isSelected(key, value) {
                var compareValueFn;
                if (trackFn) {
                  compareValueFn = trackFn;
                } else if (selectAsFn) {
                  compareValueFn = selectAsFn;
                } else {
                  compareValueFn = valueFn;
                }
                if (multiple) {
                  return isDefined(selectedSet.remove(callExpression(compareValueFn, key, value)));
                } else {
                  return viewValue === callExpression(compareValueFn, key, value);
                }
              };
            }
            function scheduleRendering() {
              if (!renderScheduled) {
                scope.$$postDigest(render);
                renderScheduled = true;
              }
            }
            function updateLabelMap(labelMap, label, added) {
              labelMap[label] = labelMap[label] || 0;
              labelMap[label] += (added ? 1 : -1);
            }
            function render() {
              renderScheduled = false;
              var optionGroups = {'': []},
                  optionGroupNames = [''],
                  optionGroupName,
                  optionGroup,
                  option,
                  existingParent,
                  existingOptions,
                  existingOption,
                  viewValue = ctrl.$viewValue,
                  values = valuesFn(scope) || [],
                  keys = keyName ? sortedKeys(values) : values,
                  key,
                  value,
                  groupLength,
                  length,
                  groupIndex,
                  index,
                  labelMap = {},
                  selected,
                  isSelected = createIsSelectedFn(viewValue),
                  anySelected = false,
                  lastElement,
                  element,
                  label,
                  optionId;
              trackKeysCache = {};
              for (index = 0; length = keys.length, index < length; index++) {
                key = index;
                if (keyName) {
                  key = keys[index];
                  if (key.charAt(0) === '$')
                    continue;
                }
                value = values[key];
                optionGroupName = callExpression(groupByFn, key, value) || '';
                if (!(optionGroup = optionGroups[optionGroupName])) {
                  optionGroup = optionGroups[optionGroupName] = [];
                  optionGroupNames.push(optionGroupName);
                }
                selected = isSelected(key, value);
                anySelected = anySelected || selected;
                label = callExpression(displayFn, key, value);
                label = isDefined(label) ? label : '';
                optionId = trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index);
                if (trackFn) {
                  trackKeysCache[optionId] = key;
                }
                optionGroup.push({
                  id: optionId,
                  label: label,
                  selected: selected
                });
              }
              if (!multiple) {
                if (nullOption || viewValue === null) {
                  optionGroups[''].unshift({
                    id: '',
                    label: '',
                    selected: !anySelected
                  });
                } else if (!anySelected) {
                  optionGroups[''].unshift({
                    id: '?',
                    label: '',
                    selected: true
                  });
                }
              }
              for (groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++) {
                optionGroupName = optionGroupNames[groupIndex];
                optionGroup = optionGroups[optionGroupName];
                if (optionGroupsCache.length <= groupIndex) {
                  existingParent = {
                    element: optGroupTemplate.clone().attr('label', optionGroupName),
                    label: optionGroup.label
                  };
                  existingOptions = [existingParent];
                  optionGroupsCache.push(existingOptions);
                  selectElement.append(existingParent.element);
                } else {
                  existingOptions = optionGroupsCache[groupIndex];
                  existingParent = existingOptions[0];
                  if (existingParent.label != optionGroupName) {
                    existingParent.element.attr('label', existingParent.label = optionGroupName);
                  }
                }
                lastElement = null;
                for (index = 0, length = optionGroup.length; index < length; index++) {
                  option = optionGroup[index];
                  if ((existingOption = existingOptions[index + 1])) {
                    lastElement = existingOption.element;
                    if (existingOption.label !== option.label) {
                      updateLabelMap(labelMap, existingOption.label, false);
                      updateLabelMap(labelMap, option.label, true);
                      lastElement.text(existingOption.label = option.label);
                      lastElement.prop('label', existingOption.label);
                    }
                    if (existingOption.id !== option.id) {
                      lastElement.val(existingOption.id = option.id);
                    }
                    if (lastElement[0].selected !== option.selected) {
                      lastElement.prop('selected', (existingOption.selected = option.selected));
                      if (msie) {
                        lastElement.prop('selected', existingOption.selected);
                      }
                    }
                  } else {
                    if (option.id === '' && nullOption) {
                      element = nullOption;
                    } else {
                      (element = optionTemplate.clone()).val(option.id).prop('selected', option.selected).attr('selected', option.selected).prop('label', option.label).text(option.label);
                    }
                    existingOptions.push(existingOption = {
                      element: element,
                      label: option.label,
                      id: option.id,
                      selected: option.selected
                    });
                    updateLabelMap(labelMap, option.label, true);
                    if (lastElement) {
                      lastElement.after(element);
                    } else {
                      existingParent.element.append(element);
                    }
                    lastElement = element;
                  }
                }
                index++;
                while (existingOptions.length > index) {
                  option = existingOptions.pop();
                  updateLabelMap(labelMap, option.label, false);
                  option.element.remove();
                }
              }
              while (optionGroupsCache.length > groupIndex) {
                optionGroup = optionGroupsCache.pop();
                for (index = 1; index < optionGroup.length; ++index) {
                  updateLabelMap(labelMap, optionGroup[index].label, false);
                }
                optionGroup[0].element.remove();
              }
              forEach(labelMap, function(count, label) {
                if (count > 0) {
                  selectCtrl.addOption(label);
                } else if (count < 0) {
                  selectCtrl.removeOption(label);
                }
              });
            }
          }
        }
      };
    }];
    var optionDirective = ['$interpolate', function($interpolate) {
      var nullSelectCtrl = {
        addOption: noop,
        removeOption: noop
      };
      return {
        restrict: 'E',
        priority: 100,
        compile: function(element, attr) {
          if (isUndefined(attr.value)) {
            var interpolateFn = $interpolate(element.text(), true);
            if (!interpolateFn) {
              attr.$set('value', element.text());
            }
          }
          return function(scope, element, attr) {
            var selectCtrlName = '$selectController',
                parent = element.parent(),
                selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
            if (!selectCtrl || !selectCtrl.databound) {
              selectCtrl = nullSelectCtrl;
            }
            if (interpolateFn) {
              scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                attr.$set('value', newVal);
                if (oldVal !== newVal) {
                  selectCtrl.removeOption(oldVal);
                }
                selectCtrl.addOption(newVal, element);
              });
            } else {
              selectCtrl.addOption(attr.value, element);
            }
            element.on('$destroy', function() {
              selectCtrl.removeOption(attr.value);
            });
          };
        }
      };
    }];
    var styleDirective = valueFn({
      restrict: 'E',
      terminal: false
    });
    if (window.angular.bootstrap) {
      console.log('WARNING: Tried to load angular more than once.');
      return;
    }
    bindJQuery();
    publishExternalAPI(angular);
    jqLite(document).ready(function() {
      angularInit(document, bootstrap);
    });
  })(window, document);
  !window.angular.$$csp() && window.angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');
})(require("process"));
