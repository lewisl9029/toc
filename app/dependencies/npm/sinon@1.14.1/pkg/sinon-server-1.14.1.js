/* */ 
"format cjs";
(function(process) {
  var sinon = (function() {
    "use strict";
    var sinon;
    var isNode = typeof module !== "undefined" && module.exports && typeof require === "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, exports, module) {
      sinon = module.exports = require("./sinon/util/core");
      require("./sinon/extend");
      require("./sinon/typeOf");
      require("./sinon/times_in_words");
      require("./sinon/spy");
      require("./sinon/call");
      require("./sinon/behavior");
      require("./sinon/stub");
      require("./sinon/mock");
      require("./sinon/collection");
      require("./sinon/assert");
      require("./sinon/sandbox");
      require("./sinon/test");
      require("./sinon/test_case");
      require("./sinon/match");
      require("./sinon/format");
      require("./sinon/log_error");
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
      sinon = module.exports;
    } else {
      sinon = {};
    }
    return sinon;
  }());
  (function(sinon) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;
    function isDOMNode(obj) {
      var success = false;
      try {
        obj.appendChild(div);
        success = div.parentNode == obj;
      } catch (e) {
        return false;
      } finally {
        try {
          obj.removeChild(div);
        } catch (e) {}
      }
      return success;
    }
    function isElement(obj) {
      return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }
    function isFunction(obj) {
      return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }
    function isReallyNaN(val) {
      return typeof val === "number" && isNaN(val);
    }
    function mirrorProperties(target, source) {
      for (var prop in source) {
        if (!hasOwn.call(target, prop)) {
          target[prop] = source[prop];
        }
      }
    }
    function isRestorable(obj) {
      return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }
    var hasES5Support = "keys" in Object;
    function makeApi(sinon) {
      sinon.wrapMethod = function wrapMethod(object, property, method) {
        if (!object) {
          throw new TypeError("Should wrap property of object");
        }
        if (typeof method != "function" && typeof method != "object") {
          throw new TypeError("Method wrapper should be a function or a property descriptor");
        }
        function checkWrappedMethod(wrappedMethod) {
          if (!isFunction(wrappedMethod)) {
            error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " + property + " as function");
          } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
            error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
          } else if (wrappedMethod.calledBefore) {
            var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
            error = new TypeError("Attempted to wrap " + property + " which is already " + verb);
          }
          if (error) {
            if (wrappedMethod && wrappedMethod.stackTrace) {
              error.stack += "\n--------------\n" + wrappedMethod.stackTrace;
            }
            throw error;
          }
        }
        var error,
            wrappedMethod;
        var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);
        if (hasES5Support) {
          var methodDesc = (typeof method == "function") ? {value: method} : method,
              wrappedMethodDesc = sinon.getPropertyDescriptor(object, property),
              i;
          if (!wrappedMethodDesc) {
            error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " + property + " as function");
          } else if (wrappedMethodDesc.restore && wrappedMethodDesc.restore.sinon) {
            error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
          }
          if (error) {
            if (wrappedMethodDesc && wrappedMethodDesc.stackTrace) {
              error.stack += "\n--------------\n" + wrappedMethodDesc.stackTrace;
            }
            throw error;
          }
          var types = sinon.objectKeys(methodDesc);
          for (i = 0; i < types.length; i++) {
            wrappedMethod = wrappedMethodDesc[types[i]];
            checkWrappedMethod(wrappedMethod);
          }
          mirrorProperties(methodDesc, wrappedMethodDesc);
          for (i = 0; i < types.length; i++) {
            mirrorProperties(methodDesc[types[i]], wrappedMethodDesc[types[i]]);
          }
          Object.defineProperty(object, property, methodDesc);
        } else {
          wrappedMethod = object[property];
          checkWrappedMethod(wrappedMethod);
          object[property] = method;
          method.displayName = property;
        }
        method.displayName = property;
        method.stackTrace = (new Error("Stack Trace for original")).stack;
        method.restore = function() {
          if (!owned) {
            try {
              delete object[property];
            } catch (e) {}
            if (object[property] === method) {
              object[property] = wrappedMethod;
            }
          } else if (hasES5Support) {
            Object.defineProperty(object, property, wrappedMethodDesc);
          }
          if (!hasES5Support && object[property] === method) {
            object[property] = wrappedMethod;
          }
        };
        method.restore.sinon = true;
        if (!hasES5Support) {
          mirrorProperties(method, wrappedMethod);
        }
        return method;
      };
      sinon.create = function create(proto) {
        var F = function() {};
        F.prototype = proto;
        return new F();
      };
      sinon.deepEqual = function deepEqual(a, b) {
        if (sinon.match && sinon.match.isMatcher(a)) {
          return a.test(b);
        }
        if (typeof a != "object" || typeof b != "object") {
          if (isReallyNaN(a) && isReallyNaN(b)) {
            return true;
          } else {
            return a === b;
          }
        }
        if (isElement(a) || isElement(b)) {
          return a === b;
        }
        if (a === b) {
          return true;
        }
        if ((a === null && b !== null) || (a !== null && b === null)) {
          return false;
        }
        if (a instanceof RegExp && b instanceof RegExp) {
          return (a.source === b.source) && (a.global === b.global) && (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);
        }
        var aString = Object.prototype.toString.call(a);
        if (aString != Object.prototype.toString.call(b)) {
          return false;
        }
        if (aString == "[object Date]") {
          return a.valueOf() === b.valueOf();
        }
        var prop,
            aLength = 0,
            bLength = 0;
        if (aString == "[object Array]" && a.length !== b.length) {
          return false;
        }
        for (prop in a) {
          aLength += 1;
          if (!(prop in b)) {
            return false;
          }
          if (!deepEqual(a[prop], b[prop])) {
            return false;
          }
        }
        for (prop in b) {
          bLength += 1;
        }
        return aLength == bLength;
      };
      sinon.functionName = function functionName(func) {
        var name = func.displayName || func.name;
        if (!name) {
          var matches = func.toString().match(/function ([^\s\(]+)/);
          name = matches && matches[1];
        }
        return name;
      };
      sinon.functionToString = function toString() {
        if (this.getCall && this.callCount) {
          var thisValue,
              prop,
              i = this.callCount;
          while (i--) {
            thisValue = this.getCall(i).thisValue;
            for (prop in thisValue) {
              if (thisValue[prop] === this) {
                return prop;
              }
            }
          }
        }
        return this.displayName || "sinon fake";
      };
      sinon.objectKeys = function objectKeys(obj) {
        if (obj !== Object(obj)) {
          throw new TypeError("sinon.objectKeys called on a non-object");
        }
        var keys = [];
        var key;
        for (key in obj) {
          if (hasOwn.call(obj, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      sinon.getPropertyDescriptor = function getPropertyDescriptor(object, property) {
        var proto = object,
            descriptor;
        while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, property))) {
          proto = Object.getPrototypeOf(proto);
        }
        return descriptor;
      };
      sinon.getConfig = function(custom) {
        var config = {};
        custom = custom || {};
        var defaults = sinon.defaultConfig;
        for (var prop in defaults) {
          if (defaults.hasOwnProperty(prop)) {
            config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
          }
        }
        return config;
      };
      sinon.defaultConfig = {
        injectIntoThis: true,
        injectInto: null,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
      };
      sinon.timesInWords = function timesInWords(count) {
        return count == 1 && "once" || count == 2 && "twice" || count == 3 && "thrice" || (count || 0) + " times";
      };
      sinon.calledInOrder = function(spies) {
        for (var i = 1,
            l = spies.length; i < l; i++) {
          if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
            return false;
          }
        }
        return true;
      };
      sinon.orderByFirstCall = function(spies) {
        return spies.sort(function(a, b) {
          var aCall = a.getCall(0);
          var bCall = b.getCall(0);
          var aId = aCall && aCall.callId || -1;
          var bId = bCall && bCall.callId || -1;
          return aId < bId ? -1 : 1;
        });
      };
      sinon.createStubInstance = function(constructor) {
        if (typeof constructor !== "function") {
          throw new TypeError("The constructor should be a function.");
        }
        return sinon.stub(sinon.create(constructor.prototype));
      };
      sinon.restore = function(object) {
        if (object !== null && typeof object === "object") {
          for (var prop in object) {
            if (isRestorable(object[prop])) {
              object[prop].restore();
            }
          }
        } else if (isRestorable(object)) {
          object.restore();
        }
      };
      return sinon;
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, exports) {
      makeApi(exports);
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports);
    } else if (!sinon) {
      return ;
    } else {
      makeApi(sinon);
    }
  }(typeof sinon == "object" && sinon || null));
  (function(sinon) {
    function makeApi(sinon) {
      var hasDontEnumBug = (function() {
        var obj = {
          constructor: function() {
            return "0";
          },
          toString: function() {
            return "1";
          },
          valueOf: function() {
            return "2";
          },
          toLocaleString: function() {
            return "3";
          },
          prototype: function() {
            return "4";
          },
          isPrototypeOf: function() {
            return "5";
          },
          propertyIsEnumerable: function() {
            return "6";
          },
          hasOwnProperty: function() {
            return "7";
          },
          length: function() {
            return "8";
          },
          unique: function() {
            return "9";
          }
        };
        var result = [];
        for (var prop in obj) {
          result.push(obj[prop]());
        }
        return result.join("") !== "0123456789";
      })();
      function extend(target) {
        var sources = Array.prototype.slice.call(arguments, 1),
            source,
            i,
            prop;
        for (i = 0; i < sources.length; i++) {
          source = sources[i];
          for (prop in source) {
            if (source.hasOwnProperty(prop)) {
              target[prop] = source[prop];
            }
          }
          if (hasDontEnumBug && source.hasOwnProperty("toString") && source.toString !== target.toString) {
            target.toString = source.toString;
          }
        }
        return target;
      }
      ;
      sinon.extend = extend;
      return sinon.extend;
    }
    function loadDependencies(require, exports, module) {
      var sinon = require("./util/core");
      module.exports = makeApi(sinon);
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else if (!sinon) {
      return ;
    } else {
      makeApi(sinon);
    }
  }(typeof sinon == "object" && sinon || null));
  if (typeof sinon == "undefined") {
    this.sinon = {};
  }
  (function() {
    var push = [].push;
    function makeApi(sinon) {
      sinon.Event = function Event(type, bubbles, cancelable, target) {
        this.initEvent(type, bubbles, cancelable, target);
      };
      sinon.Event.prototype = {
        initEvent: function(type, bubbles, cancelable, target) {
          this.type = type;
          this.bubbles = bubbles;
          this.cancelable = cancelable;
          this.target = target;
        },
        stopPropagation: function() {},
        preventDefault: function() {
          this.defaultPrevented = true;
        }
      };
      sinon.ProgressEvent = function ProgressEvent(type, progressEventRaw, target) {
        this.initEvent(type, false, false, target);
        this.loaded = progressEventRaw.loaded || null;
        this.total = progressEventRaw.total || null;
        this.lengthComputable = !!progressEventRaw.total;
      };
      sinon.ProgressEvent.prototype = new sinon.Event();
      sinon.ProgressEvent.prototype.constructor = sinon.ProgressEvent;
      sinon.CustomEvent = function CustomEvent(type, customData, target) {
        this.initEvent(type, false, false, target);
        this.detail = customData.detail || null;
      };
      sinon.CustomEvent.prototype = new sinon.Event();
      sinon.CustomEvent.prototype.constructor = sinon.CustomEvent;
      sinon.EventTarget = {
        addEventListener: function addEventListener(event, listener) {
          this.eventListeners = this.eventListeners || {};
          this.eventListeners[event] = this.eventListeners[event] || [];
          push.call(this.eventListeners[event], listener);
        },
        removeEventListener: function removeEventListener(event, listener) {
          var listeners = this.eventListeners && this.eventListeners[event] || [];
          for (var i = 0,
              l = listeners.length; i < l; ++i) {
            if (listeners[i] == listener) {
              return listeners.splice(i, 1);
            }
          }
        },
        dispatchEvent: function dispatchEvent(event) {
          var type = event.type;
          var listeners = this.eventListeners && this.eventListeners[type] || [];
          for (var i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] == "function") {
              listeners[i].call(this, event);
            } else {
              listeners[i].handleEvent(event);
            }
          }
          return !!event.defaultPrevented;
        }
      };
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require) {
      var sinon = require("./core");
      makeApi(sinon);
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require);
    } else {
      makeApi(sinon);
    }
  }());
  (function(sinon) {
    var realSetTimeout = setTimeout;
    function makeApi(sinon) {
      function log() {}
      function logError(label, err) {
        var msg = label + " threw exception: ";
        sinon.log(msg + "[" + err.name + "] " + err.message);
        if (err.stack) {
          sinon.log(err.stack);
        }
        logError.setTimeout(function() {
          err.message = msg + err.message;
          throw err;
        }, 0);
      }
      ;
      logError.setTimeout = function(func, timeout) {
        realSetTimeout(func, timeout);
      };
      var exports = {};
      exports.log = sinon.log = log;
      exports.logError = sinon.logError = logError;
      return exports;
    }
    function loadDependencies(require, exports, module) {
      var sinon = require("./util/core");
      module.exports = makeApi(sinon);
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else if (!sinon) {
      return ;
    } else {
      makeApi(sinon);
    }
  }(typeof sinon == "object" && sinon || null));
  if (typeof sinon == "undefined") {
    this.sinon = {};
  }
  (function(global) {
    var xdr = {XDomainRequest: global.XDomainRequest};
    xdr.GlobalXDomainRequest = global.XDomainRequest;
    xdr.supportsXDR = typeof xdr.GlobalXDomainRequest != "undefined";
    xdr.workingXDR = xdr.supportsXDR ? xdr.GlobalXDomainRequest : false;
    function makeApi(sinon) {
      sinon.xdr = xdr;
      function FakeXDomainRequest() {
        this.readyState = FakeXDomainRequest.UNSENT;
        this.requestBody = null;
        this.requestHeaders = {};
        this.status = 0;
        this.timeout = null;
        if (typeof FakeXDomainRequest.onCreate == "function") {
          FakeXDomainRequest.onCreate(this);
        }
      }
      function verifyState(xdr) {
        if (xdr.readyState !== FakeXDomainRequest.OPENED) {
          throw new Error("INVALID_STATE_ERR");
        }
        if (xdr.sendFlag) {
          throw new Error("INVALID_STATE_ERR");
        }
      }
      function verifyRequestSent(xdr) {
        if (xdr.readyState == FakeXDomainRequest.UNSENT) {
          throw new Error("Request not sent");
        }
        if (xdr.readyState == FakeXDomainRequest.DONE) {
          throw new Error("Request done");
        }
      }
      function verifyResponseBodyType(body) {
        if (typeof body != "string") {
          var error = new Error("Attempted to respond to fake XDomainRequest with " + body + ", which is not a string.");
          error.name = "InvalidBodyException";
          throw error;
        }
      }
      sinon.extend(FakeXDomainRequest.prototype, sinon.EventTarget, {
        open: function open(method, url) {
          this.method = method;
          this.url = url;
          this.responseText = null;
          this.sendFlag = false;
          this.readyStateChange(FakeXDomainRequest.OPENED);
        },
        readyStateChange: function readyStateChange(state) {
          this.readyState = state;
          var eventName = "";
          switch (this.readyState) {
            case FakeXDomainRequest.UNSENT:
              break;
            case FakeXDomainRequest.OPENED:
              break;
            case FakeXDomainRequest.LOADING:
              if (this.sendFlag) {
                eventName = "onprogress";
              }
              break;
            case FakeXDomainRequest.DONE:
              if (this.isTimeout) {
                eventName = "ontimeout";
              } else if (this.errorFlag || (this.status < 200 || this.status > 299)) {
                eventName = "onerror";
              } else {
                eventName = "onload";
              }
              break;
          }
          if (eventName) {
            if (typeof this[eventName] == "function") {
              try {
                this[eventName]();
              } catch (e) {
                sinon.logError("Fake XHR " + eventName + " handler", e);
              }
            }
          }
        },
        send: function send(data) {
          verifyState(this);
          if (!/^(get|head)$/i.test(this.method)) {
            this.requestBody = data;
          }
          this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
          this.errorFlag = false;
          this.sendFlag = true;
          this.readyStateChange(FakeXDomainRequest.OPENED);
          if (typeof this.onSend == "function") {
            this.onSend(this);
          }
        },
        abort: function abort() {
          this.aborted = true;
          this.responseText = null;
          this.errorFlag = true;
          if (this.readyState > sinon.FakeXDomainRequest.UNSENT && this.sendFlag) {
            this.readyStateChange(sinon.FakeXDomainRequest.DONE);
            this.sendFlag = false;
          }
        },
        setResponseBody: function setResponseBody(body) {
          verifyRequestSent(this);
          verifyResponseBodyType(body);
          var chunkSize = this.chunkSize || 10;
          var index = 0;
          this.responseText = "";
          do {
            this.readyStateChange(FakeXDomainRequest.LOADING);
            this.responseText += body.substring(index, index + chunkSize);
            index += chunkSize;
          } while (index < body.length);
          this.readyStateChange(FakeXDomainRequest.DONE);
        },
        respond: function respond(status, contentType, body) {
          this.status = typeof status == "number" ? status : 200;
          this.setResponseBody(body || "");
        },
        simulatetimeout: function simulatetimeout() {
          this.status = 0;
          this.isTimeout = true;
          this.responseText = undefined;
          this.readyStateChange(FakeXDomainRequest.DONE);
        }
      });
      sinon.extend(FakeXDomainRequest, {
        UNSENT: 0,
        OPENED: 1,
        LOADING: 3,
        DONE: 4
      });
      sinon.useFakeXDomainRequest = function useFakeXDomainRequest() {
        sinon.FakeXDomainRequest.restore = function restore(keepOnCreate) {
          if (xdr.supportsXDR) {
            global.XDomainRequest = xdr.GlobalXDomainRequest;
          }
          delete sinon.FakeXDomainRequest.restore;
          if (keepOnCreate !== true) {
            delete sinon.FakeXDomainRequest.onCreate;
          }
        };
        if (xdr.supportsXDR) {
          global.XDomainRequest = sinon.FakeXDomainRequest;
        }
        return sinon.FakeXDomainRequest;
      };
      sinon.FakeXDomainRequest = FakeXDomainRequest;
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, exports, module) {
      var sinon = require("./core");
      require("../extend");
      require("./event");
      require("../log_error");
      makeApi(sinon);
      module.exports = sinon;
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else {
      makeApi(sinon);
    }
  })(this);
  (function(global) {
    var supportsProgress = typeof ProgressEvent !== "undefined";
    var supportsCustomEvent = typeof CustomEvent !== "undefined";
    var sinonXhr = {XMLHttpRequest: global.XMLHttpRequest};
    sinonXhr.GlobalXMLHttpRequest = global.XMLHttpRequest;
    sinonXhr.GlobalActiveXObject = global.ActiveXObject;
    sinonXhr.supportsActiveX = typeof sinonXhr.GlobalActiveXObject != "undefined";
    sinonXhr.supportsXHR = typeof sinonXhr.GlobalXMLHttpRequest != "undefined";
    sinonXhr.workingXHR = sinonXhr.supportsXHR ? sinonXhr.GlobalXMLHttpRequest : sinonXhr.supportsActiveX ? function() {
      return new sinonXhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0");
    } : false;
    sinonXhr.supportsCORS = sinonXhr.supportsXHR && "withCredentials" in (new sinonXhr.GlobalXMLHttpRequest());
    var unsafeHeaders = {
      "Accept-Charset": true,
      "Accept-Encoding": true,
      Connection: true,
      "Content-Length": true,
      Cookie: true,
      Cookie2: true,
      "Content-Transfer-Encoding": true,
      Date: true,
      Expect: true,
      Host: true,
      "Keep-Alive": true,
      Referer: true,
      TE: true,
      Trailer: true,
      "Transfer-Encoding": true,
      Upgrade: true,
      "User-Agent": true,
      Via: true
    };
    function FakeXMLHttpRequest() {
      this.readyState = FakeXMLHttpRequest.UNSENT;
      this.requestHeaders = {};
      this.requestBody = null;
      this.status = 0;
      this.statusText = "";
      this.upload = new UploadProgress();
      if (sinonXhr.supportsCORS) {
        this.withCredentials = false;
      }
      var xhr = this;
      var events = ["loadstart", "load", "abort", "loadend"];
      function addEventListener(eventName) {
        xhr.addEventListener(eventName, function(event) {
          var listener = xhr["on" + eventName];
          if (listener && typeof listener == "function") {
            listener.call(this, event);
          }
        });
      }
      for (var i = events.length - 1; i >= 0; i--) {
        addEventListener(events[i]);
      }
      if (typeof FakeXMLHttpRequest.onCreate == "function") {
        FakeXMLHttpRequest.onCreate(this);
      }
    }
    function UploadProgress() {
      this.eventListeners = {
        progress: [],
        load: [],
        abort: [],
        error: []
      };
    }
    UploadProgress.prototype.addEventListener = function addEventListener(event, listener) {
      this.eventListeners[event].push(listener);
    };
    UploadProgress.prototype.removeEventListener = function removeEventListener(event, listener) {
      var listeners = this.eventListeners[event] || [];
      for (var i = 0,
          l = listeners.length; i < l; ++i) {
        if (listeners[i] == listener) {
          return listeners.splice(i, 1);
        }
      }
    };
    UploadProgress.prototype.dispatchEvent = function dispatchEvent(event) {
      var listeners = this.eventListeners[event.type] || [];
      for (var i = 0,
          listener; (listener = listeners[i]) != null; i++) {
        listener(event);
      }
    };
    function verifyState(xhr) {
      if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
        throw new Error("INVALID_STATE_ERR");
      }
      if (xhr.sendFlag) {
        throw new Error("INVALID_STATE_ERR");
      }
    }
    function getHeader(headers, header) {
      header = header.toLowerCase();
      for (var h in headers) {
        if (h.toLowerCase() == header) {
          return h;
        }
      }
      return null;
    }
    function each(collection, callback) {
      if (!collection) {
        return ;
      }
      for (var i = 0,
          l = collection.length; i < l; i += 1) {
        callback(collection[i]);
      }
    }
    function some(collection, callback) {
      for (var index = 0; index < collection.length; index++) {
        if (callback(collection[index]) === true) {
          return true;
        }
      }
      return false;
    }
    var apply = function(obj, method, args) {
      switch (args.length) {
        case 0:
          return obj[method]();
        case 1:
          return obj[method](args[0]);
        case 2:
          return obj[method](args[0], args[1]);
        case 3:
          return obj[method](args[0], args[1], args[2]);
        case 4:
          return obj[method](args[0], args[1], args[2], args[3]);
        case 5:
          return obj[method](args[0], args[1], args[2], args[3], args[4]);
      }
    };
    FakeXMLHttpRequest.filters = [];
    FakeXMLHttpRequest.addFilter = function addFilter(fn) {
      this.filters.push(fn);
    };
    var IE6Re = /MSIE 6/;
    FakeXMLHttpRequest.defake = function defake(fakeXhr, xhrArgs) {
      var xhr = new sinonXhr.workingXHR();
      each(["open", "setRequestHeader", "send", "abort", "getResponseHeader", "getAllResponseHeaders", "addEventListener", "overrideMimeType", "removeEventListener"], function(method) {
        fakeXhr[method] = function() {
          return apply(xhr, method, arguments);
        };
      });
      var copyAttrs = function(args) {
        each(args, function(attr) {
          try {
            fakeXhr[attr] = xhr[attr];
          } catch (e) {
            if (!IE6Re.test(navigator.userAgent)) {
              throw e;
            }
          }
        });
      };
      var stateChange = function stateChange() {
        fakeXhr.readyState = xhr.readyState;
        if (xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {
          copyAttrs(["status", "statusText"]);
        }
        if (xhr.readyState >= FakeXMLHttpRequest.LOADING) {
          copyAttrs(["responseText", "response"]);
        }
        if (xhr.readyState === FakeXMLHttpRequest.DONE) {
          copyAttrs(["responseXML"]);
        }
        if (fakeXhr.onreadystatechange) {
          fakeXhr.onreadystatechange.call(fakeXhr, {target: fakeXhr});
        }
      };
      if (xhr.addEventListener) {
        for (var event in fakeXhr.eventListeners) {
          if (fakeXhr.eventListeners.hasOwnProperty(event)) {
            each(fakeXhr.eventListeners[event], function(handler) {
              xhr.addEventListener(event, handler);
            });
          }
        }
        xhr.addEventListener("readystatechange", stateChange);
      } else {
        xhr.onreadystatechange = stateChange;
      }
      apply(xhr, "open", xhrArgs);
    };
    FakeXMLHttpRequest.useFilters = false;
    function verifyRequestOpened(xhr) {
      if (xhr.readyState != FakeXMLHttpRequest.OPENED) {
        throw new Error("INVALID_STATE_ERR - " + xhr.readyState);
      }
    }
    function verifyRequestSent(xhr) {
      if (xhr.readyState == FakeXMLHttpRequest.DONE) {
        throw new Error("Request done");
      }
    }
    function verifyHeadersReceived(xhr) {
      if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
        throw new Error("No headers received");
      }
    }
    function verifyResponseBodyType(body) {
      if (typeof body != "string") {
        var error = new Error("Attempted to respond to fake XMLHttpRequest with " + body + ", which is not a string.");
        error.name = "InvalidBodyException";
        throw error;
      }
    }
    FakeXMLHttpRequest.parseXML = function parseXML(text) {
      var xmlDoc;
      if (typeof DOMParser != "undefined") {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(text, "text/xml");
      } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(text);
      }
      return xmlDoc;
    };
    FakeXMLHttpRequest.statusCodes = {
      100: "Continue",
      101: "Switching Protocols",
      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      300: "Multiple Choice",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Request Entity Too Large",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      422: "Unprocessable Entity",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported"
    };
    function makeApi(sinon) {
      sinon.xhr = sinonXhr;
      sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {
        async: true,
        open: function open(method, url, async, username, password) {
          this.method = method;
          this.url = url;
          this.async = typeof async == "boolean" ? async : true;
          this.username = username;
          this.password = password;
          this.responseText = null;
          this.responseXML = null;
          this.requestHeaders = {};
          this.sendFlag = false;
          if (FakeXMLHttpRequest.useFilters === true) {
            var xhrArgs = arguments;
            var defake = some(FakeXMLHttpRequest.filters, function(filter) {
              return filter.apply(this, xhrArgs);
            });
            if (defake) {
              return FakeXMLHttpRequest.defake(this, arguments);
            }
          }
          this.readyStateChange(FakeXMLHttpRequest.OPENED);
        },
        readyStateChange: function readyStateChange(state) {
          this.readyState = state;
          if (typeof this.onreadystatechange == "function") {
            try {
              this.onreadystatechange();
            } catch (e) {
              sinon.logError("Fake XHR onreadystatechange handler", e);
            }
          }
          this.dispatchEvent(new sinon.Event("readystatechange"));
          switch (this.readyState) {
            case FakeXMLHttpRequest.DONE:
              this.dispatchEvent(new sinon.Event("load", false, false, this));
              this.dispatchEvent(new sinon.Event("loadend", false, false, this));
              this.upload.dispatchEvent(new sinon.Event("load", false, false, this));
              if (supportsProgress) {
                this.upload.dispatchEvent(new sinon.ProgressEvent("progress", {
                  loaded: 100,
                  total: 100
                }));
                this.dispatchEvent(new sinon.ProgressEvent("progress", {
                  loaded: 100,
                  total: 100
                }));
              }
              break;
          }
        },
        setRequestHeader: function setRequestHeader(header, value) {
          verifyState(this);
          if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
            throw new Error("Refused to set unsafe header \"" + header + "\"");
          }
          if (this.requestHeaders[header]) {
            this.requestHeaders[header] += "," + value;
          } else {
            this.requestHeaders[header] = value;
          }
        },
        setResponseHeaders: function setResponseHeaders(headers) {
          verifyRequestOpened(this);
          this.responseHeaders = {};
          for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
              this.responseHeaders[header] = headers[header];
            }
          }
          if (this.async) {
            this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
          } else {
            this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;
          }
        },
        send: function send(data) {
          verifyState(this);
          if (!/^(get|head)$/i.test(this.method)) {
            var contentType = getHeader(this.requestHeaders, "Content-Type");
            if (this.requestHeaders[contentType]) {
              var value = this.requestHeaders[contentType].split(";");
              this.requestHeaders[contentType] = value[0] + ";charset=utf-8";
            } else if (!(data instanceof FormData)) {
              this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
            }
            this.requestBody = data;
          }
          this.errorFlag = false;
          this.sendFlag = this.async;
          this.readyStateChange(FakeXMLHttpRequest.OPENED);
          if (typeof this.onSend == "function") {
            this.onSend(this);
          }
          this.dispatchEvent(new sinon.Event("loadstart", false, false, this));
        },
        abort: function abort() {
          this.aborted = true;
          this.responseText = null;
          this.errorFlag = true;
          this.requestHeaders = {};
          if (this.readyState > FakeXMLHttpRequest.UNSENT && this.sendFlag) {
            this.readyStateChange(FakeXMLHttpRequest.DONE);
            this.sendFlag = false;
          }
          this.readyState = FakeXMLHttpRequest.UNSENT;
          this.dispatchEvent(new sinon.Event("abort", false, false, this));
          this.upload.dispatchEvent(new sinon.Event("abort", false, false, this));
          if (typeof this.onerror === "function") {
            this.onerror();
          }
        },
        getResponseHeader: function getResponseHeader(header) {
          if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
            return null;
          }
          if (/^Set-Cookie2?$/i.test(header)) {
            return null;
          }
          header = getHeader(this.responseHeaders, header);
          return this.responseHeaders[header] || null;
        },
        getAllResponseHeaders: function getAllResponseHeaders() {
          if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
            return "";
          }
          var headers = "";
          for (var header in this.responseHeaders) {
            if (this.responseHeaders.hasOwnProperty(header) && !/^Set-Cookie2?$/i.test(header)) {
              headers += header + ": " + this.responseHeaders[header] + "\r\n";
            }
          }
          return headers;
        },
        setResponseBody: function setResponseBody(body) {
          verifyRequestSent(this);
          verifyHeadersReceived(this);
          verifyResponseBodyType(body);
          var chunkSize = this.chunkSize || 10;
          var index = 0;
          this.responseText = "";
          do {
            if (this.async) {
              this.readyStateChange(FakeXMLHttpRequest.LOADING);
            }
            this.responseText += body.substring(index, index + chunkSize);
            index += chunkSize;
          } while (index < body.length);
          var type = this.getResponseHeader("Content-Type");
          if (this.responseText && (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
            try {
              this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);
            } catch (e) {}
          }
          this.readyStateChange(FakeXMLHttpRequest.DONE);
        },
        respond: function respond(status, headers, body) {
          this.status = typeof status == "number" ? status : 200;
          this.statusText = FakeXMLHttpRequest.statusCodes[this.status];
          this.setResponseHeaders(headers || {});
          this.setResponseBody(body || "");
        },
        uploadProgress: function uploadProgress(progressEventRaw) {
          if (supportsProgress) {
            this.upload.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));
          }
        },
        downloadProgress: function downloadProgress(progressEventRaw) {
          if (supportsProgress) {
            this.dispatchEvent(new sinon.ProgressEvent("progress", progressEventRaw));
          }
        },
        uploadError: function uploadError(error) {
          if (supportsCustomEvent) {
            this.upload.dispatchEvent(new sinon.CustomEvent("error", {detail: error}));
          }
        }
      });
      sinon.extend(FakeXMLHttpRequest, {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
      });
      sinon.useFakeXMLHttpRequest = function() {
        FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
          if (sinonXhr.supportsXHR) {
            global.XMLHttpRequest = sinonXhr.GlobalXMLHttpRequest;
          }
          if (sinonXhr.supportsActiveX) {
            global.ActiveXObject = sinonXhr.GlobalActiveXObject;
          }
          delete FakeXMLHttpRequest.restore;
          if (keepOnCreate !== true) {
            delete FakeXMLHttpRequest.onCreate;
          }
        };
        if (sinonXhr.supportsXHR) {
          global.XMLHttpRequest = FakeXMLHttpRequest;
        }
        if (sinonXhr.supportsActiveX) {
          global.ActiveXObject = function ActiveXObject(objId) {
            if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {
              return new FakeXMLHttpRequest();
            }
            return new sinonXhr.GlobalActiveXObject(objId);
          };
        }
        return FakeXMLHttpRequest;
      };
      sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, exports, module) {
      var sinon = require("./core");
      require("../extend");
      require("./event");
      require("../log_error");
      makeApi(sinon);
      module.exports = sinon;
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else if (typeof sinon === "undefined") {
      return ;
    } else {
      makeApi(sinon);
    }
  })(typeof global !== "undefined" ? global : this);
  (function(sinon, formatio) {
    function makeApi(sinon) {
      function valueFormatter(value) {
        return "" + value;
      }
      function getFormatioFormatter() {
        var formatter = formatio.configure({
          quoteStrings: false,
          limitChildrenCount: 250
        });
        function format() {
          return formatter.ascii.apply(formatter, arguments);
        }
        ;
        return format;
      }
      function getNodeFormatter(value) {
        function format(value) {
          return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
        }
        ;
        try {
          var util = require("util");
        } catch (e) {}
        return util ? format : valueFormatter;
      }
      var isNode = typeof module !== "undefined" && module.exports && typeof require == "function",
          formatter;
      if (isNode) {
        try {
          formatio = require("formatio");
        } catch (e) {}
      }
      if (formatio) {
        formatter = getFormatioFormatter();
      } else if (isNode) {
        formatter = getNodeFormatter();
      } else {
        formatter = valueFormatter;
      }
      sinon.format = formatter;
      return sinon.format;
    }
    function loadDependencies(require, exports, module) {
      var sinon = require("./util/core");
      module.exports = makeApi(sinon);
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else if (!sinon) {
      return ;
    } else {
      makeApi(sinon);
    }
  }((typeof sinon == "object" && sinon || null), (typeof formatio == "object" && formatio)));
  if (typeof sinon == "undefined") {
    var sinon = {};
  }
  (function() {
    var push = [].push;
    function F() {}
    function create(proto) {
      F.prototype = proto;
      return new F();
    }
    function responseArray(handler) {
      var response = handler;
      if (Object.prototype.toString.call(handler) != "[object Array]") {
        response = [200, {}, handler];
      }
      if (typeof response[2] != "string") {
        throw new TypeError("Fake server response body should be string, but was " + typeof response[2]);
      }
      return response;
    }
    var wloc = typeof window !== "undefined" ? window.location : {};
    var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);
    function matchOne(response, reqMethod, reqUrl) {
      var rmeth = response.method;
      var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();
      var url = response.url;
      var matchUrl = !url || url == reqUrl || (typeof url.test == "function" && url.test(reqUrl));
      return matchMethod && matchUrl;
    }
    function match(response, request) {
      var requestUrl = request.url;
      if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {
        requestUrl = requestUrl.replace(rCurrLoc, "");
      }
      if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {
        if (typeof response.response == "function") {
          var ru = response.url;
          var args = [request].concat(ru && typeof ru.exec == "function" ? ru.exec(requestUrl).slice(1) : []);
          return response.response.apply(response, args);
        }
        return true;
      }
      return false;
    }
    function makeApi(sinon) {
      sinon.fakeServer = {
        create: function() {
          var server = create(this);
          if (!sinon.xhr.supportsCORS) {
            this.xhr = sinon.useFakeXDomainRequest();
          } else {
            this.xhr = sinon.useFakeXMLHttpRequest();
          }
          server.requests = [];
          this.xhr.onCreate = function(xhrObj) {
            server.addRequest(xhrObj);
          };
          return server;
        },
        addRequest: function addRequest(xhrObj) {
          var server = this;
          push.call(this.requests, xhrObj);
          xhrObj.onSend = function() {
            server.handleRequest(this);
            if (server.respondImmediately) {
              server.respond();
            } else if (server.autoRespond && !server.responding) {
              setTimeout(function() {
                server.responding = false;
                server.respond();
              }, server.autoRespondAfter || 10);
              server.responding = true;
            }
          };
        },
        getHTTPMethod: function getHTTPMethod(request) {
          if (this.fakeHTTPMethods && /post/i.test(request.method)) {
            var matches = (request.requestBody || "").match(/_method=([^\b;]+)/);
            return !!matches ? matches[1] : request.method;
          }
          return request.method;
        },
        handleRequest: function handleRequest(xhr) {
          if (xhr.async) {
            if (!this.queue) {
              this.queue = [];
            }
            push.call(this.queue, xhr);
          } else {
            this.processRequest(xhr);
          }
        },
        log: function log(response, request) {
          var str;
          str = "Request:\n" + sinon.format(request) + "\n\n";
          str += "Response:\n" + sinon.format(response) + "\n\n";
          sinon.log(str);
        },
        respondWith: function respondWith(method, url, body) {
          if (arguments.length == 1 && typeof method != "function") {
            this.response = responseArray(method);
            return ;
          }
          if (!this.responses) {
            this.responses = [];
          }
          if (arguments.length == 1) {
            body = method;
            url = method = null;
          }
          if (arguments.length == 2) {
            body = url;
            url = method;
            method = null;
          }
          push.call(this.responses, {
            method: method,
            url: url,
            response: typeof body == "function" ? body : responseArray(body)
          });
        },
        respond: function respond() {
          if (arguments.length > 0) {
            this.respondWith.apply(this, arguments);
          }
          var queue = this.queue || [];
          var requests = queue.splice(0, queue.length);
          var request;
          while (request = requests.shift()) {
            this.processRequest(request);
          }
        },
        processRequest: function processRequest(request) {
          try {
            if (request.aborted) {
              return ;
            }
            var response = this.response || [404, {}, ""];
            if (this.responses) {
              for (var l = this.responses.length,
                  i = l - 1; i >= 0; i--) {
                if (match.call(this, this.responses[i], request)) {
                  response = this.responses[i].response;
                  break;
                }
              }
            }
            if (request.readyState != 4) {
              this.log(response, request);
              request.respond(response[0], response[1], response[2]);
            }
          } catch (e) {
            sinon.logError("Fake server request processing", e);
          }
        },
        restore: function restore() {
          return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
        }
      };
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, exports, module) {
      var sinon = require("./core");
      require("./fake_xdomain_request");
      require("./fake_xml_http_request");
      require("../format");
      makeApi(sinon);
      module.exports = sinon;
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module);
    } else {
      makeApi(sinon);
    }
  }());
  if (typeof sinon == "undefined") {
    var sinon = {};
  }
  (function(global) {
    function makeApi(sinon, lol) {
      var llx = typeof lolex !== "undefined" ? lolex : lol;
      sinon.useFakeTimers = function() {
        var now,
            methods = Array.prototype.slice.call(arguments);
        if (typeof methods[0] === "string") {
          now = 0;
        } else {
          now = methods.shift();
        }
        var clock = llx.install(now || 0, methods);
        clock.restore = clock.uninstall;
        return clock;
      };
      sinon.clock = {create: function(now) {
          return llx.createClock(now);
        }};
      sinon.timers = {
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
        clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate : undefined),
        setInterval: setInterval,
        clearInterval: clearInterval,
        Date: Date
      };
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require, epxorts, module, lolex) {
      var sinon = require("./core");
      makeApi(sinon, lolex);
      module.exports = sinon;
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require, module.exports, module, require("lolex"));
    } else {
      makeApi(sinon);
    }
  }(typeof global != "undefined" && typeof global !== "function" ? global : this));
  (function() {
    function makeApi(sinon) {
      function Server() {}
      Server.prototype = sinon.fakeServer;
      sinon.fakeServerWithClock = new Server();
      sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
        if (xhr.async) {
          if (typeof setTimeout.clock == "object") {
            this.clock = setTimeout.clock;
          } else {
            this.clock = sinon.useFakeTimers();
            this.resetClock = true;
          }
          if (!this.longestTimeout) {
            var clockSetTimeout = this.clock.setTimeout;
            var clockSetInterval = this.clock.setInterval;
            var server = this;
            this.clock.setTimeout = function(fn, timeout) {
              server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);
              return clockSetTimeout.apply(this, arguments);
            };
            this.clock.setInterval = function(fn, timeout) {
              server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);
              return clockSetInterval.apply(this, arguments);
            };
          }
        }
        return sinon.fakeServer.addRequest.call(this, xhr);
      };
      sinon.fakeServerWithClock.respond = function respond() {
        var returnVal = sinon.fakeServer.respond.apply(this, arguments);
        if (this.clock) {
          this.clock.tick(this.longestTimeout || 0);
          this.longestTimeout = 0;
          if (this.resetClock) {
            this.clock.restore();
            this.resetClock = false;
          }
        }
        return returnVal;
      };
      sinon.fakeServerWithClock.restore = function restore() {
        if (this.clock) {
          this.clock.restore();
        }
        return sinon.fakeServer.restore.apply(this, arguments);
      };
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
    var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
    function loadDependencies(require) {
      var sinon = require("./core");
      require("./fake_server");
      require("./fake_timers");
      makeApi(sinon);
    }
    if (isAMD) {
      define(loadDependencies);
    } else if (isNode) {
      loadDependencies(require);
    } else {
      makeApi(sinon);
    }
  }());
})(require("process"));
