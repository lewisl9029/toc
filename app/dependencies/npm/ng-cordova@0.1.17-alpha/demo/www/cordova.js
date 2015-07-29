/* */ 
"format cjs";
(function(Buffer, process) {
  ;
  (function() {
    var CORDOVA_JS_BUILD_LABEL = '3.6.3';
    var require,
        define;
    (function() {
      var modules = {},
          requireStack = [],
          inProgressModules = {},
          SEPARATOR = ".";
      function build(module) {
        var factory = module.factory,
            localRequire = function(id) {
              var resultantId = id;
              if (id.charAt(0) === ".") {
                resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
              }
              return require(resultantId);
            };
        module.exports = {};
        delete module.factory;
        factory(localRequire, module.exports, module);
        return module.exports;
      }
      require = function(id) {
        if (!modules[id]) {
          throw "module " + id + " not found";
        } else if (id in inProgressModules) {
          var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
          throw "Cycle in require graph: " + cycle;
        }
        if (modules[id].factory) {
          try {
            inProgressModules[id] = requireStack.length;
            requireStack.push(id);
            return build(modules[id]);
          } finally {
            delete inProgressModules[id];
            requireStack.pop();
          }
        }
        return modules[id].exports;
      };
      define = function(id, factory) {
        if (modules[id]) {
          throw "module " + id + " already defined";
        }
        modules[id] = {
          id: id,
          factory: factory
        };
      };
      define.remove = function(id) {
        delete modules[id];
      };
      define.moduleMap = modules;
    })();
    if (typeof module === "object" && typeof require === "function") {
      module.exports.require = require;
      module.exports.define = define;
    }
    define("cordova", function(require, exports, module) {
      var channel = require("cordova/channel");
      var platform = require("cordova/platform");
      var m_document_addEventListener = document.addEventListener;
      var m_document_removeEventListener = document.removeEventListener;
      var m_window_addEventListener = window.addEventListener;
      var m_window_removeEventListener = window.removeEventListener;
      var documentEventHandlers = {},
          windowEventHandlers = {};
      document.addEventListener = function(evt, handler, capture) {
        var e = evt.toLowerCase();
        if (typeof documentEventHandlers[e] != 'undefined') {
          documentEventHandlers[e].subscribe(handler);
        } else {
          m_document_addEventListener.call(document, evt, handler, capture);
        }
      };
      window.addEventListener = function(evt, handler, capture) {
        var e = evt.toLowerCase();
        if (typeof windowEventHandlers[e] != 'undefined') {
          windowEventHandlers[e].subscribe(handler);
        } else {
          m_window_addEventListener.call(window, evt, handler, capture);
        }
      };
      document.removeEventListener = function(evt, handler, capture) {
        var e = evt.toLowerCase();
        if (typeof documentEventHandlers[e] != "undefined") {
          documentEventHandlers[e].unsubscribe(handler);
        } else {
          m_document_removeEventListener.call(document, evt, handler, capture);
        }
      };
      window.removeEventListener = function(evt, handler, capture) {
        var e = evt.toLowerCase();
        if (typeof windowEventHandlers[e] != "undefined") {
          windowEventHandlers[e].unsubscribe(handler);
        } else {
          m_window_removeEventListener.call(window, evt, handler, capture);
        }
      };
      function createEvent(type, data) {
        var event = document.createEvent('Events');
        event.initEvent(type, false, false);
        if (data) {
          for (var i in data) {
            if (data.hasOwnProperty(i)) {
              event[i] = data[i];
            }
          }
        }
        return event;
      }
      var cordova = {
        define: define,
        require: require,
        version: CORDOVA_JS_BUILD_LABEL,
        platformId: platform.id,
        addWindowEventHandler: function(event) {
          return (windowEventHandlers[event] = channel.create(event));
        },
        addStickyDocumentEventHandler: function(event) {
          return (documentEventHandlers[event] = channel.createSticky(event));
        },
        addDocumentEventHandler: function(event) {
          return (documentEventHandlers[event] = channel.create(event));
        },
        removeWindowEventHandler: function(event) {
          delete windowEventHandlers[event];
        },
        removeDocumentEventHandler: function(event) {
          delete documentEventHandlers[event];
        },
        getOriginalHandlers: function() {
          return {
            'document': {
              'addEventListener': m_document_addEventListener,
              'removeEventListener': m_document_removeEventListener
            },
            'window': {
              'addEventListener': m_window_addEventListener,
              'removeEventListener': m_window_removeEventListener
            }
          };
        },
        fireDocumentEvent: function(type, data, bNoDetach) {
          var evt = createEvent(type, data);
          if (typeof documentEventHandlers[type] != 'undefined') {
            if (bNoDetach) {
              documentEventHandlers[type].fire(evt);
            } else {
              setTimeout(function() {
                if (type == 'deviceready') {
                  document.dispatchEvent(evt);
                }
                documentEventHandlers[type].fire(evt);
              }, 0);
            }
          } else {
            document.dispatchEvent(evt);
          }
        },
        fireWindowEvent: function(type, data) {
          var evt = createEvent(type, data);
          if (typeof windowEventHandlers[type] != 'undefined') {
            setTimeout(function() {
              windowEventHandlers[type].fire(evt);
            }, 0);
          } else {
            window.dispatchEvent(evt);
          }
        },
        callbackId: Math.floor(Math.random() * 2000000000),
        callbacks: {},
        callbackStatus: {
          NO_RESULT: 0,
          OK: 1,
          CLASS_NOT_FOUND_EXCEPTION: 2,
          ILLEGAL_ACCESS_EXCEPTION: 3,
          INSTANTIATION_EXCEPTION: 4,
          MALFORMED_URL_EXCEPTION: 5,
          IO_EXCEPTION: 6,
          INVALID_ACTION: 7,
          JSON_EXCEPTION: 8,
          ERROR: 9
        },
        callbackSuccess: function(callbackId, args) {
          try {
            cordova.callbackFromNative(callbackId, true, args.status, [args.message], args.keepCallback);
          } catch (e) {
            console.log("Error in success callback: " + callbackId + " = " + e);
          }
        },
        callbackError: function(callbackId, args) {
          try {
            cordova.callbackFromNative(callbackId, false, args.status, [args.message], args.keepCallback);
          } catch (e) {
            console.log("Error in error callback: " + callbackId + " = " + e);
          }
        },
        callbackFromNative: function(callbackId, success, status, args, keepCallback) {
          var callback = cordova.callbacks[callbackId];
          if (callback) {
            if (success && status == cordova.callbackStatus.OK) {
              callback.success && callback.success.apply(null, args);
            } else if (!success) {
              callback.fail && callback.fail.apply(null, args);
            }
            if (!keepCallback) {
              delete cordova.callbacks[callbackId];
            }
          }
        },
        addConstructor: function(func) {
          channel.onCordovaReady.subscribe(function() {
            try {
              func();
            } catch (e) {
              console.log("Failed to run constructor: " + e);
            }
          });
        }
      };
      module.exports = cordova;
    });
    define("cordova/argscheck", function(require, exports, module) {
      var exec = require("cordova/exec");
      var utils = require("cordova/utils");
      var moduleExports = module.exports;
      var typeMap = {
        'A': 'Array',
        'D': 'Date',
        'N': 'Number',
        'S': 'String',
        'F': 'Function',
        'O': 'Object'
      };
      function extractParamName(callee, argIndex) {
        return (/.*?\((.*?)\)/).exec(callee)[1].split(', ')[argIndex];
      }
      function checkArgs(spec, functionName, args, opt_callee) {
        if (!moduleExports.enableChecks) {
          return;
        }
        var errMsg = null;
        var typeName;
        for (var i = 0; i < spec.length; ++i) {
          var c = spec.charAt(i),
              cUpper = c.toUpperCase(),
              arg = args[i];
          if (c == '*') {
            continue;
          }
          typeName = utils.typeName(arg);
          if ((arg === null || arg === undefined) && c == cUpper) {
            continue;
          }
          if (typeName != typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
          }
        }
        if (errMsg) {
          errMsg += ', but got ' + typeName + '.';
          errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
          if (typeof jasmine == 'undefined') {
            console.error(errMsg);
          }
          throw TypeError(errMsg);
        }
      }
      function getValue(value, defaultValue) {
        return value === undefined ? defaultValue : value;
      }
      moduleExports.checkArgs = checkArgs;
      moduleExports.getValue = getValue;
      moduleExports.enableChecks = true;
    });
    define("cordova/base64", function(require, exports, module) {
      var base64 = exports;
      base64.fromArrayBuffer = function(arrayBuffer) {
        var array = new Uint8Array(arrayBuffer);
        return uint8ToBase64(array);
      };
      base64.toArrayBuffer = function(str) {
        var decodedStr = typeof atob != 'undefined' ? atob(str) : new Buffer(str, 'base64').toString('binary');
        var arrayBuffer = new ArrayBuffer(decodedStr.length);
        var array = new Uint8Array(arrayBuffer);
        for (var i = 0,
            len = decodedStr.length; i < len; i++) {
          array[i] = decodedStr.charCodeAt(i);
        }
        return arrayBuffer;
      };
      var b64_6bit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var b64_12bit;
      var b64_12bitTable = function() {
        b64_12bit = [];
        for (var i = 0; i < 64; i++) {
          for (var j = 0; j < 64; j++) {
            b64_12bit[i * 64 + j] = b64_6bit[i] + b64_6bit[j];
          }
        }
        b64_12bitTable = function() {
          return b64_12bit;
        };
        return b64_12bit;
      };
      function uint8ToBase64(rawData) {
        var numBytes = rawData.byteLength;
        var output = "";
        var segment;
        var table = b64_12bitTable();
        for (var i = 0; i < numBytes - 2; i += 3) {
          segment = (rawData[i] << 16) + (rawData[i + 1] << 8) + rawData[i + 2];
          output += table[segment >> 12];
          output += table[segment & 0xfff];
        }
        if (numBytes - i == 2) {
          segment = (rawData[i] << 16) + (rawData[i + 1] << 8);
          output += table[segment >> 12];
          output += b64_6bit[(segment & 0xfff) >> 6];
          output += '=';
        } else if (numBytes - i == 1) {
          segment = (rawData[i] << 16);
          output += table[segment >> 12];
          output += '==';
        }
        return output;
      }
    });
    define("cordova/builder", function(require, exports, module) {
      var utils = require("cordova/utils");
      function each(objects, func, context) {
        for (var prop in objects) {
          if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
          }
        }
      }
      function clobber(obj, key, value) {
        exports.replaceHookForTesting(obj, key);
        obj[key] = value;
        if (obj[key] !== value) {
          utils.defineGetter(obj, key, function() {
            return value;
          });
        }
      }
      function assignOrWrapInDeprecateGetter(obj, key, value, message) {
        if (message) {
          utils.defineGetter(obj, key, function() {
            console.log(message);
            delete obj[key];
            clobber(obj, key, value);
            return value;
          });
        } else {
          clobber(obj, key, value);
        }
      }
      function include(parent, objects, clobber, merge) {
        each(objects, function(obj, key) {
          try {
            var result = obj.path ? require(obj.path) : {};
            if (clobber) {
              if (typeof parent[key] === 'undefined') {
                assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
              } else if (typeof obj.path !== 'undefined') {
                if (merge) {
                  recursiveMerge(parent[key], result);
                } else {
                  assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                }
              }
              result = parent[key];
            } else {
              if (typeof parent[key] == 'undefined') {
                assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
              } else {
                result = parent[key];
              }
            }
            if (obj.children) {
              include(result, obj.children, clobber, merge);
            }
          } catch (e) {
            utils.alert('Exception building Cordova JS globals: ' + e + ' for key "' + key + '"');
          }
        });
      }
      function recursiveMerge(target, src) {
        for (var prop in src) {
          if (src.hasOwnProperty(prop)) {
            if (target.prototype && target.prototype.constructor === target) {
              clobber(target.prototype, prop, src[prop]);
            } else {
              if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
                recursiveMerge(target[prop], src[prop]);
              } else {
                clobber(target, prop, src[prop]);
              }
            }
          }
        }
      }
      exports.buildIntoButDoNotClobber = function(objects, target) {
        include(target, objects, false, false);
      };
      exports.buildIntoAndClobber = function(objects, target) {
        include(target, objects, true, false);
      };
      exports.buildIntoAndMerge = function(objects, target) {
        include(target, objects, true, true);
      };
      exports.recursiveMerge = recursiveMerge;
      exports.assignOrWrapInDeprecateGetter = assignOrWrapInDeprecateGetter;
      exports.replaceHookForTesting = function() {};
    });
    define("cordova/channel", function(require, exports, module) {
      var utils = require("cordova/utils"),
          nextGuid = 1;
      var Channel = function(type, sticky) {
        this.type = type;
        this.handlers = {};
        this.state = sticky ? 1 : 0;
        this.fireArgs = null;
        this.numHandlers = 0;
        this.onHasSubscribersChange = null;
      },
          channel = {
            join: function(h, c) {
              var len = c.length,
                  i = len,
                  f = function() {
                    if (!(--i))
                      h();
                  };
              for (var j = 0; j < len; j++) {
                if (c[j].state === 0) {
                  throw Error('Can only use join with sticky channels.');
                }
                c[j].subscribe(f);
              }
              if (!len)
                h();
            },
            create: function(type) {
              return channel[type] = new Channel(type, false);
            },
            createSticky: function(type) {
              return channel[type] = new Channel(type, true);
            },
            deviceReadyChannelsArray: [],
            deviceReadyChannelsMap: {},
            waitForInitialization: function(feature) {
              if (feature) {
                var c = channel[feature] || this.createSticky(feature);
                this.deviceReadyChannelsMap[feature] = c;
                this.deviceReadyChannelsArray.push(c);
              }
            },
            initializationComplete: function(feature) {
              var c = this.deviceReadyChannelsMap[feature];
              if (c) {
                c.fire();
              }
            }
          };
      function forceFunction(f) {
        if (typeof f != 'function')
          throw "Function required as first argument!";
      }
      Channel.prototype.subscribe = function(f, c) {
        forceFunction(f);
        if (this.state == 2) {
          f.apply(c || this, this.fireArgs);
          return;
        }
        var func = f,
            guid = f.observer_guid;
        if (typeof c == "object") {
          func = utils.close(c, f);
        }
        if (!guid) {
          guid = '' + nextGuid++;
        }
        func.observer_guid = guid;
        f.observer_guid = guid;
        if (!this.handlers[guid]) {
          this.handlers[guid] = func;
          this.numHandlers++;
          if (this.numHandlers == 1) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
          }
        }
      };
      Channel.prototype.unsubscribe = function(f) {
        forceFunction(f);
        var guid = f.observer_guid,
            handler = this.handlers[guid];
        if (handler) {
          delete this.handlers[guid];
          this.numHandlers--;
          if (this.numHandlers === 0) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
          }
        }
      };
      Channel.prototype.fire = function(e) {
        var fail = false,
            fireArgs = Array.prototype.slice.call(arguments);
        if (this.state == 1) {
          this.state = 2;
          this.fireArgs = fireArgs;
        }
        if (this.numHandlers) {
          var toCall = [];
          for (var item in this.handlers) {
            toCall.push(this.handlers[item]);
          }
          for (var i = 0; i < toCall.length; ++i) {
            toCall[i].apply(this, fireArgs);
          }
          if (this.state == 2 && this.numHandlers) {
            this.numHandlers = 0;
            this.handlers = {};
            this.onHasSubscribersChange && this.onHasSubscribersChange();
          }
        }
      };
      channel.createSticky('onDOMContentLoaded');
      channel.createSticky('onNativeReady');
      channel.createSticky('onCordovaReady');
      channel.createSticky('onPluginsReady');
      channel.createSticky('onDeviceReady');
      channel.create('onResume');
      channel.create('onPause');
      channel.createSticky('onDestroy');
      channel.waitForInitialization('onCordovaReady');
      channel.waitForInitialization('onDOMContentLoaded');
      module.exports = channel;
    });
    define("cordova/exec", function(require, exports, module) {
      var cordova = require("cordova"),
          channel = require("cordova/channel"),
          utils = require("cordova/utils"),
          base64 = require("cordova/base64"),
          jsToNativeModes = {
            IFRAME_NAV: 0,
            XHR_NO_PAYLOAD: 1,
            XHR_WITH_PAYLOAD: 2,
            XHR_OPTIONAL_PAYLOAD: 3,
            IFRAME_HASH_NO_PAYLOAD: 4,
            IFRAME_HASH_WITH_PAYLOAD: 5,
            WK_WEBVIEW_BINDING: 6
          },
          bridgeMode,
          execIframe,
          execHashIframe,
          hashToggle = 1,
          execXhr,
          requestCount = 0,
          vcHeaderValue = null,
          commandQueue = [],
          isInContextOfEvalJs = 0;
      function createExecIframe() {
        var iframe = document.createElement("iframe");
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        return iframe;
      }
      function createHashIframe() {
        var ret = createExecIframe();
        ret.contentWindow.history.replaceState(null, null, 'file:///#');
        return ret;
      }
      function shouldBundleCommandJson() {
        if (bridgeMode === jsToNativeModes.XHR_WITH_PAYLOAD) {
          return true;
        }
        if (bridgeMode === jsToNativeModes.XHR_OPTIONAL_PAYLOAD) {
          var payloadLength = 0;
          for (var i = 0; i < commandQueue.length; ++i) {
            payloadLength += commandQueue[i].length;
          }
          return payloadLength < 4500;
        }
        return false;
      }
      function massageArgsJsToNative(args) {
        if (!args || utils.typeName(args) != 'Array') {
          return args;
        }
        var ret = [];
        args.forEach(function(arg, i) {
          if (utils.typeName(arg) == 'ArrayBuffer') {
            ret.push({
              'CDVType': 'ArrayBuffer',
              'data': base64.fromArrayBuffer(arg)
            });
          } else {
            ret.push(arg);
          }
        });
        return ret;
      }
      function massageMessageNativeToJs(message) {
        if (message.CDVType == 'ArrayBuffer') {
          var stringToArrayBuffer = function(str) {
            var ret = new Uint8Array(str.length);
            for (var i = 0; i < str.length; i++) {
              ret[i] = str.charCodeAt(i);
            }
            return ret.buffer;
          };
          var base64ToArrayBuffer = function(b64) {
            return stringToArrayBuffer(atob(b64));
          };
          message = base64ToArrayBuffer(message.data);
        }
        return message;
      }
      function convertMessageToArgsNativeToJs(message) {
        var args = [];
        if (!message || !message.hasOwnProperty('CDVType')) {
          args.push(message);
        } else if (message.CDVType == 'MultiPart') {
          message.messages.forEach(function(e) {
            args.push(massageMessageNativeToJs(e));
          });
        } else {
          args.push(massageMessageNativeToJs(message));
        }
        return args;
      }
      function iOSExec() {
        if (bridgeMode === undefined) {
          if (navigator.userAgent) {
            bridgeMode = navigator.userAgent.indexOf(' 5_') == -1 ? jsToNativeModes.IFRAME_NAV : jsToNativeModes.XHR_NO_PAYLOAD;
          } else {
            bridgeMode = jsToNativeModes.IFRAME_NAV;
          }
        }
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.cordova && window.webkit.messageHandlers.cordova.postMessage) {
          bridgeMode = jsToNativeModes.WK_WEBVIEW_BINDING;
        }
        var successCallback,
            failCallback,
            service,
            action,
            actionArgs,
            splitCommand;
        var callbackId = null;
        if (typeof arguments[0] !== "string") {
          successCallback = arguments[0];
          failCallback = arguments[1];
          service = arguments[2];
          action = arguments[3];
          actionArgs = arguments[4];
          callbackId = 'INVALID';
        } else {
          try {
            splitCommand = arguments[0].split(".");
            action = splitCommand.pop();
            service = splitCommand.join(".");
            actionArgs = Array.prototype.splice.call(arguments, 1);
            console.log('The old format of this exec call has been removed (deprecated since 2.1). Change to: ' + "cordova.exec(null, null, \"" + service + "\", \"" + action + "\"," + JSON.stringify(actionArgs) + ");");
            return;
          } catch (e) {}
        }
        actionArgs = actionArgs || [];
        if (successCallback || failCallback) {
          callbackId = service + cordova.callbackId++;
          cordova.callbacks[callbackId] = {
            success: successCallback,
            fail: failCallback
          };
        }
        actionArgs = massageArgsJsToNative(actionArgs);
        var command = [callbackId, service, action, actionArgs];
        commandQueue.push(JSON.stringify(command));
        if (bridgeMode === jsToNativeModes.WK_WEBVIEW_BINDING) {
          window.webkit.messageHandlers.cordova.postMessage(command);
        } else {
          if (!isInContextOfEvalJs && commandQueue.length == 1) {
            switch (bridgeMode) {
              case jsToNativeModes.XHR_NO_PAYLOAD:
              case jsToNativeModes.XHR_WITH_PAYLOAD:
              case jsToNativeModes.XHR_OPTIONAL_PAYLOAD:
                pokeNativeViaXhr();
                break;
              default:
                pokeNativeViaIframe();
            }
          }
        }
      }
      function pokeNativeViaXhr() {
        if (execXhr && execXhr.readyState != 4) {
          execXhr = null;
        }
        execXhr = execXhr || new XMLHttpRequest();
        execXhr.open('HEAD', "/!gap_exec?" + (+new Date()), true);
        if (!vcHeaderValue) {
          vcHeaderValue = /.*\((.*)\)/.exec(navigator.userAgent)[1];
        }
        execXhr.setRequestHeader('vc', vcHeaderValue);
        execXhr.setRequestHeader('rc', ++requestCount);
        if (shouldBundleCommandJson()) {
          execXhr.setRequestHeader('cmds', iOSExec.nativeFetchMessages());
        }
        execXhr.send(null);
      }
      function pokeNativeViaIframe() {
        if (!document.body) {
          setTimeout(pokeNativeViaIframe);
          return;
        }
        if (bridgeMode === jsToNativeModes.IFRAME_HASH_NO_PAYLOAD || bridgeMode === jsToNativeModes.IFRAME_HASH_WITH_PAYLOAD) {
          execHashIframe = execHashIframe || createHashIframe();
          if (!execHashIframe.contentWindow) {
            execHashIframe = createHashIframe();
          }
          hashToggle = hashToggle ^ 3;
          var hashValue = '%0' + hashToggle;
          if (bridgeMode === jsToNativeModes.IFRAME_HASH_WITH_PAYLOAD) {
            hashValue += iOSExec.nativeFetchMessages();
          }
          execHashIframe.contentWindow.location.hash = hashValue;
        } else {
          execIframe = execIframe || createExecIframe();
          if (!execIframe.contentWindow) {
            execIframe = createExecIframe();
          }
          execIframe.src = "gap://ready";
        }
      }
      iOSExec.jsToNativeModes = jsToNativeModes;
      iOSExec.setJsToNativeBridgeMode = function(mode) {
        if (execIframe) {
          execIframe.parentNode.removeChild(execIframe);
          execIframe = null;
        }
        bridgeMode = mode;
      };
      iOSExec.nativeFetchMessages = function() {
        if (!commandQueue.length) {
          return '';
        }
        var json = '[' + commandQueue.join(',') + ']';
        commandQueue.length = 0;
        return json;
      };
      iOSExec.nativeCallback = function(callbackId, status, message, keepCallback) {
        return iOSExec.nativeEvalAndFetch(function() {
          var success = status === 0 || status === 1;
          var args = convertMessageToArgsNativeToJs(message);
          cordova.callbackFromNative(callbackId, success, status, args, keepCallback);
        });
      };
      iOSExec.nativeEvalAndFetch = function(func) {
        isInContextOfEvalJs++;
        try {
          func();
          return iOSExec.nativeFetchMessages();
        } finally {
          isInContextOfEvalJs--;
        }
      };
      module.exports = iOSExec;
    });
    define("cordova/exec/proxy", function(require, exports, module) {
      var CommandProxyMap = {};
      module.exports = {
        add: function(id, proxyObj) {
          console.log("adding proxy for " + id);
          CommandProxyMap[id] = proxyObj;
          return proxyObj;
        },
        remove: function(id) {
          var proxy = CommandProxyMap[id];
          delete CommandProxyMap[id];
          CommandProxyMap[id] = null;
          return proxy;
        },
        get: function(service, action) {
          return (CommandProxyMap[service] ? CommandProxyMap[service][action] : null);
        }
      };
    });
    define("cordova/init", function(require, exports, module) {
      var channel = require("cordova/channel");
      var cordova = require("cordova");
      var modulemapper = require("cordova/modulemapper");
      var platform = require("cordova/platform");
      var pluginloader = require("cordova/pluginloader");
      var platformInitChannelsArray = [channel.onNativeReady, channel.onPluginsReady];
      function logUnfiredChannels(arr) {
        for (var i = 0; i < arr.length; ++i) {
          if (arr[i].state != 2) {
            console.log('Channel not fired: ' + arr[i].type);
          }
        }
      }
      window.setTimeout(function() {
        if (channel.onDeviceReady.state != 2) {
          console.log('deviceready has not fired after 5 seconds.');
          logUnfiredChannels(platformInitChannelsArray);
          logUnfiredChannels(channel.deviceReadyChannelsArray);
        }
      }, 5000);
      function replaceNavigator(origNavigator) {
        var CordovaNavigator = function() {};
        CordovaNavigator.prototype = origNavigator;
        var newNavigator = new CordovaNavigator();
        if (CordovaNavigator.bind) {
          for (var key in origNavigator) {
            if (typeof origNavigator[key] == 'function') {
              newNavigator[key] = origNavigator[key].bind(origNavigator);
            }
          }
        }
        return newNavigator;
      }
      if (window.navigator) {
        window.navigator = replaceNavigator(window.navigator);
      }
      if (!window.console) {
        window.console = {log: function() {}};
      }
      if (!window.console.warn) {
        window.console.warn = function(msg) {
          this.log("warn: " + msg);
        };
      }
      channel.onPause = cordova.addDocumentEventHandler('pause');
      channel.onResume = cordova.addDocumentEventHandler('resume');
      channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');
      if (document.readyState == 'complete' || document.readyState == 'interactive') {
        channel.onDOMContentLoaded.fire();
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          channel.onDOMContentLoaded.fire();
        }, false);
      }
      if (window._nativeReady) {
        channel.onNativeReady.fire();
      }
      modulemapper.clobbers('cordova', 'cordova');
      modulemapper.clobbers('cordova/exec', 'cordova.exec');
      modulemapper.clobbers('cordova/exec', 'Cordova.exec');
      platform.bootstrap && platform.bootstrap();
      setTimeout(function() {
        pluginloader.load(function() {
          channel.onPluginsReady.fire();
        });
      }, 0);
      channel.join(function() {
        modulemapper.mapModules(window);
        platform.initialize && platform.initialize();
        channel.onCordovaReady.fire();
        channel.join(function() {
          require("cordova").fireDocumentEvent('deviceready');
        }, channel.deviceReadyChannelsArray);
      }, platformInitChannelsArray);
    });
    define("cordova/init_b", function(require, exports, module) {
      var channel = require("cordova/channel");
      var cordova = require("cordova");
      var platform = require("cordova/platform");
      var platformInitChannelsArray = [channel.onDOMContentLoaded, channel.onNativeReady];
      cordova.exec = require("cordova/exec");
      function logUnfiredChannels(arr) {
        for (var i = 0; i < arr.length; ++i) {
          if (arr[i].state != 2) {
            console.log('Channel not fired: ' + arr[i].type);
          }
        }
      }
      window.setTimeout(function() {
        if (channel.onDeviceReady.state != 2) {
          console.log('deviceready has not fired after 5 seconds.');
          logUnfiredChannels(platformInitChannelsArray);
          logUnfiredChannels(channel.deviceReadyChannelsArray);
        }
      }, 5000);
      function replaceNavigator(origNavigator) {
        var CordovaNavigator = function() {};
        CordovaNavigator.prototype = origNavigator;
        var newNavigator = new CordovaNavigator();
        if (CordovaNavigator.bind) {
          for (var key in origNavigator) {
            if (typeof origNavigator[key] == 'function') {
              newNavigator[key] = origNavigator[key].bind(origNavigator);
            }
          }
        }
        return newNavigator;
      }
      if (window.navigator) {
        window.navigator = replaceNavigator(window.navigator);
      }
      if (!window.console) {
        window.console = {log: function() {}};
      }
      if (!window.console.warn) {
        window.console.warn = function(msg) {
          this.log("warn: " + msg);
        };
      }
      channel.onPause = cordova.addDocumentEventHandler('pause');
      channel.onResume = cordova.addDocumentEventHandler('resume');
      channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');
      if (document.readyState == 'complete' || document.readyState == 'interactive') {
        channel.onDOMContentLoaded.fire();
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          channel.onDOMContentLoaded.fire();
        }, false);
      }
      if (window._nativeReady) {
        channel.onNativeReady.fire();
      }
      platform.bootstrap && platform.bootstrap();
      channel.join(function() {
        platform.initialize && platform.initialize();
        channel.onCordovaReady.fire();
        channel.join(function() {
          require("cordova").fireDocumentEvent('deviceready');
        }, channel.deviceReadyChannelsArray);
      }, platformInitChannelsArray);
    });
    define("cordova/modulemapper", function(require, exports, module) {
      var builder = require("cordova/builder"),
          moduleMap = define.moduleMap,
          symbolList,
          deprecationMap;
      exports.reset = function() {
        symbolList = [];
        deprecationMap = {};
      };
      function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
        if (!(moduleName in moduleMap)) {
          throw new Error('Module ' + moduleName + ' does not exist.');
        }
        symbolList.push(strategy, moduleName, symbolPath);
        if (opt_deprecationMessage) {
          deprecationMap[symbolPath] = opt_deprecationMessage;
        }
      }
      exports.clobbers = function(moduleName, symbolPath, opt_deprecationMessage) {
        addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
      };
      exports.merges = function(moduleName, symbolPath, opt_deprecationMessage) {
        addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
      };
      exports.defaults = function(moduleName, symbolPath, opt_deprecationMessage) {
        addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
      };
      exports.runs = function(moduleName) {
        addEntry('r', moduleName, null);
      };
      function prepareNamespace(symbolPath, context) {
        if (!symbolPath) {
          return context;
        }
        var parts = symbolPath.split('.');
        var cur = context;
        for (var i = 0,
            part; part = parts[i]; ++i) {
          cur = cur[part] = cur[part] || {};
        }
        return cur;
      }
      exports.mapModules = function(context) {
        var origSymbols = {};
        context.CDV_origSymbols = origSymbols;
        for (var i = 0,
            len = symbolList.length; i < len; i += 3) {
          var strategy = symbolList[i];
          var moduleName = symbolList[i + 1];
          var module = require(moduleName);
          if (strategy == 'r') {
            continue;
          }
          var symbolPath = symbolList[i + 2];
          var lastDot = symbolPath.lastIndexOf('.');
          var namespace = symbolPath.substr(0, lastDot);
          var lastName = symbolPath.substr(lastDot + 1);
          var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
          var parentObj = prepareNamespace(namespace, context);
          var target = parentObj[lastName];
          if (strategy == 'm' && target) {
            builder.recursiveMerge(target, module);
          } else if ((strategy == 'd' && !target) || (strategy != 'd')) {
            if (!(symbolPath in origSymbols)) {
              origSymbols[symbolPath] = target;
            }
            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
          }
        }
      };
      exports.getOriginalSymbol = function(context, symbolPath) {
        var origSymbols = context.CDV_origSymbols;
        if (origSymbols && (symbolPath in origSymbols)) {
          return origSymbols[symbolPath];
        }
        var parts = symbolPath.split('.');
        var obj = context;
        for (var i = 0; i < parts.length; ++i) {
          obj = obj && obj[parts[i]];
        }
        return obj;
      };
      exports.reset();
    });
    define("cordova/platform", function(require, exports, module) {
      module.exports = {
        id: 'ios',
        bootstrap: function() {
          require("cordova/channel").onNativeReady.fire();
        }
      };
    });
    define("cordova/pluginloader", function(require, exports, module) {
      var modulemapper = require("cordova/modulemapper");
      var urlutil = require("cordova/urlutil");
      exports.injectScript = function(url, onload, onerror) {
        var script = document.createElement("script");
        script.onload = onload;
        script.onerror = onerror;
        script.src = url;
        document.head.appendChild(script);
      };
      function injectIfNecessary(id, url, onload, onerror) {
        onerror = onerror || onload;
        if (id in define.moduleMap) {
          onload();
        } else {
          exports.injectScript(url, function() {
            if (id in define.moduleMap) {
              onload();
            } else {
              onerror();
            }
          }, onerror);
        }
      }
      function onScriptLoadingComplete(moduleList, finishPluginLoading) {
        for (var i = 0,
            module; module = moduleList[i]; i++) {
          if (module.clobbers && module.clobbers.length) {
            for (var j = 0; j < module.clobbers.length; j++) {
              modulemapper.clobbers(module.id, module.clobbers[j]);
            }
          }
          if (module.merges && module.merges.length) {
            for (var k = 0; k < module.merges.length; k++) {
              modulemapper.merges(module.id, module.merges[k]);
            }
          }
          if (module.runs) {
            modulemapper.runs(module.id);
          }
        }
        finishPluginLoading();
      }
      function handlePluginsObject(path, moduleList, finishPluginLoading) {
        var scriptCounter = moduleList.length;
        if (!scriptCounter) {
          finishPluginLoading();
          return;
        }
        function scriptLoadedCallback() {
          if (!--scriptCounter) {
            onScriptLoadingComplete(moduleList, finishPluginLoading);
          }
        }
        for (var i = 0; i < moduleList.length; i++) {
          injectIfNecessary(moduleList[i].id, path + moduleList[i].file, scriptLoadedCallback);
        }
      }
      function findCordovaPath() {
        var path = null;
        var scripts = document.getElementsByTagName('script');
        var term = '/cordova.js';
        for (var n = scripts.length - 1; n > -1; n--) {
          var src = scripts[n].src.replace(/\?.*$/, '');
          if (src.indexOf(term) == (src.length - term.length)) {
            path = src.substring(0, src.length - term.length) + '/';
            break;
          }
        }
        return path;
      }
      exports.load = function(callback) {
        var pathPrefix = findCordovaPath();
        if (pathPrefix === null) {
          console.log('Could not find cordova.js script tag. Plugin loading may fail.');
          pathPrefix = '';
        }
        injectIfNecessary('cordova/plugin_list', pathPrefix + 'cordova_plugins.js', function() {
          var moduleList = require("cordova/plugin_list");
          handlePluginsObject(pathPrefix, moduleList, callback);
        }, callback);
      };
    });
    define("cordova/urlutil", function(require, exports, module) {
      exports.makeAbsolute = function makeAbsolute(url) {
        var anchorEl = document.createElement('a');
        anchorEl.href = url;
        return anchorEl.href;
      };
    });
    define("cordova/utils", function(require, exports, module) {
      var utils = exports;
      utils.defineGetterSetter = function(obj, key, getFunc, opt_setFunc) {
        if (Object.defineProperty) {
          var desc = {
            get: getFunc,
            configurable: true
          };
          if (opt_setFunc) {
            desc.set = opt_setFunc;
          }
          Object.defineProperty(obj, key, desc);
        } else {
          obj.__defineGetter__(key, getFunc);
          if (opt_setFunc) {
            obj.__defineSetter__(key, opt_setFunc);
          }
        }
      };
      utils.defineGetter = utils.defineGetterSetter;
      utils.arrayIndexOf = function(a, item) {
        if (a.indexOf) {
          return a.indexOf(item);
        }
        var len = a.length;
        for (var i = 0; i < len; ++i) {
          if (a[i] == item) {
            return i;
          }
        }
        return -1;
      };
      utils.arrayRemove = function(a, item) {
        var index = utils.arrayIndexOf(a, item);
        if (index != -1) {
          a.splice(index, 1);
        }
        return index != -1;
      };
      utils.typeName = function(val) {
        return Object.prototype.toString.call(val).slice(8, -1);
      };
      utils.isArray = function(a) {
        return utils.typeName(a) == 'Array';
      };
      utils.isDate = function(d) {
        return utils.typeName(d) == 'Date';
      };
      utils.clone = function(obj) {
        if (!obj || typeof obj == 'function' || utils.isDate(obj) || typeof obj != 'object') {
          return obj;
        }
        var retVal,
            i;
        if (utils.isArray(obj)) {
          retVal = [];
          for (i = 0; i < obj.length; ++i) {
            retVal.push(utils.clone(obj[i]));
          }
          return retVal;
        }
        retVal = {};
        for (i in obj) {
          if (!(i in retVal) || retVal[i] != obj[i]) {
            retVal[i] = utils.clone(obj[i]);
          }
        }
        return retVal;
      };
      utils.close = function(context, func, params) {
        if (typeof params == 'undefined') {
          return function() {
            return func.apply(context, arguments);
          };
        } else {
          return function() {
            return func.apply(context, params);
          };
        }
      };
      utils.createUUID = function() {
        return UUIDcreatePart(4) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(2) + '-' + UUIDcreatePart(6);
      };
      utils.extend = (function() {
        var F = function() {};
        return function(Child, Parent) {
          F.prototype = Parent.prototype;
          Child.prototype = new F();
          Child.__super__ = Parent.prototype;
          Child.prototype.constructor = Child;
        };
      }());
      utils.alert = function(msg) {
        if (window.alert) {
          window.alert(msg);
        } else if (console && console.log) {
          console.log(msg);
        }
      };
      function UUIDcreatePart(length) {
        var uuidpart = "";
        for (var i = 0; i < length; i++) {
          var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
          if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
          }
          uuidpart += uuidchar;
        }
        return uuidpart;
      }
    });
    window.cordova = require("cordova");
    require("cordova/init");
  })();
})(require("buffer").Buffer, require("process"));
