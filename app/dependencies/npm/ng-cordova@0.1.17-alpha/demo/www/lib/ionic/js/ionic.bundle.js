/* */ 
(function(process) {
  (function() {
    window.ionic = window.ionic || {};
    window.ionic.views = {};
    window.ionic.version = '1.0.0-beta.14';
    (function(ionic) {
      ionic.DelegateService = function(methodNames) {
        if (methodNames.indexOf('$getByHandle') > -1) {
          throw new Error("Method '$getByHandle' is implicitly added to each delegate service. Do not list it as a method.");
        }
        function trueFn() {
          return true;
        }
        return ['$log', function($log) {
          function DelegateInstance(instances, handle) {
            this._instances = instances;
            this.handle = handle;
          }
          methodNames.forEach(function(methodName) {
            DelegateInstance.prototype[methodName] = instanceMethodCaller(methodName);
          });
          function DelegateService() {
            this._instances = [];
          }
          DelegateService.prototype = DelegateInstance.prototype;
          DelegateService.prototype._registerInstance = function(instance, handle, filterFn) {
            var instances = this._instances;
            instance.$$delegateHandle = handle;
            instance.$$filterFn = filterFn || trueFn;
            instances.push(instance);
            return function deregister() {
              var index = instances.indexOf(instance);
              if (index !== -1) {
                instances.splice(index, 1);
              }
            };
          };
          DelegateService.prototype.$getByHandle = function(handle) {
            return new DelegateInstance(this._instances, handle);
          };
          return new DelegateService();
          function instanceMethodCaller(methodName) {
            return function caller() {
              var handle = this.handle;
              var args = arguments;
              var foundInstancesCount = 0;
              var returnValue;
              this._instances.forEach(function(instance) {
                if ((!handle || handle == instance.$$delegateHandle) && instance.$$filterFn(instance)) {
                  foundInstancesCount++;
                  var ret = instance[methodName].apply(instance, args);
                  if (foundInstancesCount === 1) {
                    returnValue = ret;
                  }
                }
              });
              if (!foundInstancesCount && handle) {
                return $log.warn('Delegate for handle "' + handle + '" could not find a ' + 'corresponding element with delegate-handle="' + handle + '"! ' + methodName + '() was not called!\n' + 'Possible cause: If you are calling ' + methodName + '() immediately, and ' + 'your element with delegate-handle="' + handle + '" is a child of your ' + 'controller, then your element may not be compiled yet. Put a $timeout ' + 'around your call to ' + methodName + '() and try again.');
              }
              return returnValue;
            };
          }
        }];
      };
    })(window.ionic);
    (function(window, document, ionic) {
      var readyCallbacks = [];
      var isDomReady = document.readyState === 'complete' || document.readyState === 'interactive';
      function domReady() {
        isDomReady = true;
        for (var x = 0; x < readyCallbacks.length; x++) {
          ionic.requestAnimationFrame(readyCallbacks[x]);
        }
        readyCallbacks = [];
        document.removeEventListener('DOMContentLoaded', domReady);
      }
      if (!isDomReady) {
        document.addEventListener('DOMContentLoaded', domReady);
      }
      window._rAF = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 16);
        };
      })();
      var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
      ionic.DomUtil = {
        requestAnimationFrame: function(cb) {
          return window._rAF(cb);
        },
        cancelAnimationFrame: function(requestId) {
          cancelAnimationFrame(requestId);
        },
        animationFrameThrottle: function(cb) {
          var args,
              isQueued,
              context;
          return function() {
            args = arguments;
            context = this;
            if (!isQueued) {
              isQueued = true;
              ionic.requestAnimationFrame(function() {
                cb.apply(context, args);
                isQueued = false;
              });
            }
          };
        },
        getPositionInParent: function(el) {
          return {
            left: el.offsetLeft,
            top: el.offsetTop
          };
        },
        ready: function(cb) {
          if (isDomReady) {
            ionic.requestAnimationFrame(cb);
          } else {
            readyCallbacks.push(cb);
          }
        },
        getTextBounds: function(textNode) {
          if (document.createRange) {
            var range = document.createRange();
            range.selectNodeContents(textNode);
            if (range.getBoundingClientRect) {
              var rect = range.getBoundingClientRect();
              if (rect) {
                var sx = window.scrollX;
                var sy = window.scrollY;
                return {
                  top: rect.top + sy,
                  left: rect.left + sx,
                  right: rect.left + sx + rect.width,
                  bottom: rect.top + sy + rect.height,
                  width: rect.width,
                  height: rect.height
                };
              }
            }
          }
          return null;
        },
        getChildIndex: function(element, type) {
          if (type) {
            var ch = element.parentNode.children;
            var c;
            for (var i = 0,
                k = 0,
                j = ch.length; i < j; i++) {
              c = ch[i];
              if (c.nodeName && c.nodeName.toLowerCase() == type) {
                if (c == element) {
                  return k;
                }
                k++;
              }
            }
          }
          return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
        },
        swapNodes: function(src, dest) {
          dest.parentNode.insertBefore(src, dest);
        },
        elementIsDescendant: function(el, parent, stopAt) {
          var current = el;
          do {
            if (current === parent)
              return true;
            current = current.parentNode;
          } while (current && current !== stopAt);
          return false;
        },
        getParentWithClass: function(e, className, depth) {
          depth = depth || 10;
          while (e.parentNode && depth--) {
            if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
              return e.parentNode;
            }
            e = e.parentNode;
          }
          return null;
        },
        getParentOrSelfWithClass: function(e, className, depth) {
          depth = depth || 10;
          while (e && depth--) {
            if (e.classList && e.classList.contains(className)) {
              return e;
            }
            e = e.parentNode;
          }
          return null;
        },
        rectContains: function(x, y, x1, y1, x2, y2) {
          if (x < x1 || x > x2)
            return false;
          if (y < y1 || y > y2)
            return false;
          return true;
        },
        blurAll: function() {
          if (document.activeElement && document.activeElement != document.body) {
            document.activeElement.blur();
            return document.activeElement;
          }
          return null;
        },
        cachedAttr: function(ele, key, value) {
          ele = ele && ele.length && ele[0] || ele;
          if (ele && ele.setAttribute) {
            var dataKey = '$attr-' + key;
            if (arguments.length > 2) {
              if (ele[dataKey] !== value) {
                ele.setAttribute(key, value);
                ele[dataKey] = value;
              }
            } else if (typeof ele[dataKey] == 'undefined') {
              ele[dataKey] = ele.getAttribute(key);
            }
            return ele[dataKey];
          }
        },
        cachedStyles: function(ele, styles) {
          ele = ele && ele.length && ele[0] || ele;
          if (ele && ele.style) {
            for (var prop in styles) {
              if (ele['$style-' + prop] !== styles[prop]) {
                ele.style[prop] = ele['$style-' + prop] = styles[prop];
              }
            }
          }
        }
      };
      ionic.requestAnimationFrame = ionic.DomUtil.requestAnimationFrame;
      ionic.cancelAnimationFrame = ionic.DomUtil.cancelAnimationFrame;
      ionic.animationFrameThrottle = ionic.DomUtil.animationFrameThrottle;
    })(window, document, ionic);
    (function(ionic) {
      ionic.CustomEvent = (function() {
        if (typeof window.CustomEvent === 'function')
          return CustomEvent;
        var customEvent = function(event, params) {
          var evt;
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          try {
            evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          } catch (error) {
            evt = document.createEvent("Event");
            for (var param in params) {
              evt[param] = params[param];
            }
            evt.initEvent(event, params.bubbles, params.cancelable);
          }
          return evt;
        };
        customEvent.prototype = window.Event.prototype;
        return customEvent;
      })();
      ionic.EventController = {
        VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],
        trigger: function(eventType, data, bubbles, cancelable) {
          var event = new ionic.CustomEvent(eventType, {
            detail: data,
            bubbles: !!bubbles,
            cancelable: !!cancelable
          });
          data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event);
        },
        on: function(type, callback, element) {
          var e = element || window;
          for (var i = 0,
              j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
            if (type == this.VIRTUALIZED_EVENTS[i]) {
              var gesture = new ionic.Gesture(element);
              gesture.on(type, callback);
              return gesture;
            }
          }
          e.addEventListener(type, callback);
        },
        off: function(type, callback, element) {
          element.removeEventListener(type, callback);
        },
        onGesture: function(type, callback, element, options) {
          var gesture = new ionic.Gesture(element, options);
          gesture.on(type, callback);
          return gesture;
        },
        offGesture: function(gesture, type, callback) {
          gesture.off(type, callback);
        },
        handlePopState: function(event) {}
      };
      ionic.on = function() {
        ionic.EventController.on.apply(ionic.EventController, arguments);
      };
      ionic.off = function() {
        ionic.EventController.off.apply(ionic.EventController, arguments);
      };
      ionic.trigger = ionic.EventController.trigger;
      ionic.onGesture = function() {
        return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments);
      };
      ionic.offGesture = function() {
        return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments);
      };
    })(window.ionic);
    (function(ionic) {
      ionic.Gesture = function(element, options) {
        return new ionic.Gestures.Instance(element, options || {});
      };
      ionic.Gestures = {};
      ionic.Gestures.defaults = {stop_browser_behavior: 'disable-user-behavior'};
      ionic.Gestures.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
      ionic.Gestures.HAS_TOUCHEVENTS = ('ontouchstart' in window);
      ionic.Gestures.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
      ionic.Gestures.NO_MOUSEEVENTS = ionic.Gestures.HAS_TOUCHEVENTS && window.navigator.userAgent.match(ionic.Gestures.MOBILE_REGEX);
      ionic.Gestures.EVENT_TYPES = {};
      ionic.Gestures.DIRECTION_DOWN = 'down';
      ionic.Gestures.DIRECTION_LEFT = 'left';
      ionic.Gestures.DIRECTION_UP = 'up';
      ionic.Gestures.DIRECTION_RIGHT = 'right';
      ionic.Gestures.POINTER_MOUSE = 'mouse';
      ionic.Gestures.POINTER_TOUCH = 'touch';
      ionic.Gestures.POINTER_PEN = 'pen';
      ionic.Gestures.EVENT_START = 'start';
      ionic.Gestures.EVENT_MOVE = 'move';
      ionic.Gestures.EVENT_END = 'end';
      ionic.Gestures.DOCUMENT = window.document;
      ionic.Gestures.plugins = {};
      ionic.Gestures.READY = false;
      function setup() {
        if (ionic.Gestures.READY) {
          return;
        }
        ionic.Gestures.event.determineEventTypes();
        for (var name in ionic.Gestures.gestures) {
          if (ionic.Gestures.gestures.hasOwnProperty(name)) {
            ionic.Gestures.detection.register(ionic.Gestures.gestures[name]);
          }
        }
        ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_MOVE, ionic.Gestures.detection.detect);
        ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_END, ionic.Gestures.detection.detect);
        ionic.Gestures.READY = true;
      }
      ionic.Gestures.Instance = function(element, options) {
        var self = this;
        if (element === null) {
          void 0;
          return;
        }
        setup();
        this.element = element;
        this.enabled = true;
        this.options = ionic.Gestures.utils.extend(ionic.Gestures.utils.extend({}, ionic.Gestures.defaults), options || {});
        if (this.options.stop_browser_behavior) {
          ionic.Gestures.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
        }
        ionic.Gestures.event.onTouch(element, ionic.Gestures.EVENT_START, function(ev) {
          if (self.enabled) {
            ionic.Gestures.detection.startDetect(self, ev);
          }
        });
        return this;
      };
      ionic.Gestures.Instance.prototype = {
        on: function onEvent(gesture, handler) {
          var gestures = gesture.split(' ');
          for (var t = 0; t < gestures.length; t++) {
            this.element.addEventListener(gestures[t], handler, false);
          }
          return this;
        },
        off: function offEvent(gesture, handler) {
          var gestures = gesture.split(' ');
          for (var t = 0; t < gestures.length; t++) {
            this.element.removeEventListener(gestures[t], handler, false);
          }
          return this;
        },
        trigger: function triggerEvent(gesture, eventData) {
          var event = ionic.Gestures.DOCUMENT.createEvent('Event');
          event.initEvent(gesture, true, true);
          event.gesture = eventData;
          var element = this.element;
          if (ionic.Gestures.utils.hasParent(eventData.target, element)) {
            element = eventData.target;
          }
          element.dispatchEvent(event);
          return this;
        },
        enable: function enable(state) {
          this.enabled = state;
          return this;
        }
      };
      var last_move_event = null;
      var enable_detect = false;
      var touch_triggered = false;
      ionic.Gestures.event = {
        bindDom: function(element, type, handler) {
          var types = type.split(' ');
          for (var t = 0; t < types.length; t++) {
            element.addEventListener(types[t], handler, false);
          }
        },
        onTouch: function onTouch(element, eventType, handler) {
          var self = this;
          this.bindDom(element, ionic.Gestures.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
            var sourceEventType = ev.type.toLowerCase();
            if (sourceEventType.match(/mouse/) && touch_triggered) {
              return;
            } else if (sourceEventType.match(/touch/) || sourceEventType.match(/pointerdown/) || (sourceEventType.match(/mouse/) && ev.which === 1)) {
              enable_detect = true;
            } else if (sourceEventType.match(/mouse/) && ev.which !== 1) {
              enable_detect = false;
            }
            if (sourceEventType.match(/touch|pointer/)) {
              touch_triggered = true;
            }
            var count_touches = 0;
            if (enable_detect) {
              if (ionic.Gestures.HAS_POINTEREVENTS && eventType != ionic.Gestures.EVENT_END) {
                count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
              } else if (sourceEventType.match(/touch/)) {
                count_touches = ev.touches.length;
              } else if (!touch_triggered) {
                count_touches = sourceEventType.match(/up/) ? 0 : 1;
              }
              if (count_touches > 0 && eventType == ionic.Gestures.EVENT_END) {
                eventType = ionic.Gestures.EVENT_MOVE;
              } else if (!count_touches) {
                eventType = ionic.Gestures.EVENT_END;
              }
              if (count_touches || last_move_event === null) {
                last_move_event = ev;
              }
              handler.call(ionic.Gestures.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));
              if (ionic.Gestures.HAS_POINTEREVENTS && eventType == ionic.Gestures.EVENT_END) {
                count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
              }
            }
            if (!count_touches) {
              last_move_event = null;
              enable_detect = false;
              touch_triggered = false;
              ionic.Gestures.PointerEvent.reset();
            }
          });
        },
        determineEventTypes: function determineEventTypes() {
          var types;
          if (ionic.Gestures.HAS_POINTEREVENTS) {
            types = ionic.Gestures.PointerEvent.getEvents();
          } else if (ionic.Gestures.NO_MOUSEEVENTS) {
            types = ['touchstart', 'touchmove', 'touchend touchcancel'];
          } else {
            types = ['touchstart mousedown', 'touchmove mousemove', 'touchend touchcancel mouseup'];
          }
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_START] = types[0];
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_MOVE] = types[1];
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_END] = types[2];
        },
        getTouchList: function getTouchList(ev) {
          if (ionic.Gestures.HAS_POINTEREVENTS) {
            return ionic.Gestures.PointerEvent.getTouchList();
          } else if (ev.touches) {
            return ev.touches;
          } else {
            ev.identifier = 1;
            return [ev];
          }
        },
        collectEventData: function collectEventData(element, eventType, touches, ev) {
          var pointerType = ionic.Gestures.POINTER_TOUCH;
          if (ev.type.match(/mouse/) || ionic.Gestures.PointerEvent.matchType(ionic.Gestures.POINTER_MOUSE, ev)) {
            pointerType = ionic.Gestures.POINTER_MOUSE;
          }
          return {
            center: ionic.Gestures.utils.getCenter(touches),
            timeStamp: new Date().getTime(),
            target: ev.target,
            touches: touches,
            eventType: eventType,
            pointerType: pointerType,
            srcEvent: ev,
            preventDefault: function() {
              if (this.srcEvent.preventManipulation) {
                this.srcEvent.preventManipulation();
              }
              if (this.srcEvent.preventDefault) {}
            },
            stopPropagation: function() {
              this.srcEvent.stopPropagation();
            },
            stopDetect: function() {
              return ionic.Gestures.detection.stopDetect();
            }
          };
        }
      };
      ionic.Gestures.PointerEvent = {
        pointers: {},
        getTouchList: function() {
          var self = this;
          var touchlist = [];
          Object.keys(self.pointers).sort().forEach(function(id) {
            touchlist.push(self.pointers[id]);
          });
          return touchlist;
        },
        updatePointer: function(type, pointerEvent) {
          if (type == ionic.Gestures.EVENT_END) {
            this.pointers = {};
          } else {
            pointerEvent.identifier = pointerEvent.pointerId;
            this.pointers[pointerEvent.pointerId] = pointerEvent;
          }
          return Object.keys(this.pointers).length;
        },
        matchType: function(pointerType, ev) {
          if (!ev.pointerType) {
            return false;
          }
          var types = {};
          types[ionic.Gestures.POINTER_MOUSE] = (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == ionic.Gestures.POINTER_MOUSE);
          types[ionic.Gestures.POINTER_TOUCH] = (ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == ionic.Gestures.POINTER_TOUCH);
          types[ionic.Gestures.POINTER_PEN] = (ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == ionic.Gestures.POINTER_PEN);
          return types[pointerType];
        },
        getEvents: function() {
          return ['pointerdown MSPointerDown', 'pointermove MSPointerMove', 'pointerup pointercancel MSPointerUp MSPointerCancel'];
        },
        reset: function() {
          this.pointers = {};
        }
      };
      ionic.Gestures.utils = {
        extend: function extend(dest, src, merge) {
          for (var key in src) {
            if (dest[key] !== undefined && merge) {
              continue;
            }
            dest[key] = src[key];
          }
          return dest;
        },
        hasParent: function(node, parent) {
          while (node) {
            if (node == parent) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        },
        getCenter: function getCenter(touches) {
          var valuesX = [],
              valuesY = [];
          for (var t = 0,
              len = touches.length; t < len; t++) {
            valuesX.push(touches[t].pageX);
            valuesY.push(touches[t].pageY);
          }
          return {
            pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
            pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
          };
        },
        getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
          return {
            x: Math.abs(delta_x / delta_time) || 0,
            y: Math.abs(delta_y / delta_time) || 0
          };
        },
        getAngle: function getAngle(touch1, touch2) {
          var y = touch2.pageY - touch1.pageY,
              x = touch2.pageX - touch1.pageX;
          return Math.atan2(y, x) * 180 / Math.PI;
        },
        getDirection: function getDirection(touch1, touch2) {
          var x = Math.abs(touch1.pageX - touch2.pageX),
              y = Math.abs(touch1.pageY - touch2.pageY);
          if (x >= y) {
            return touch1.pageX - touch2.pageX > 0 ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
          } else {
            return touch1.pageY - touch2.pageY > 0 ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
          }
        },
        getDistance: function getDistance(touch1, touch2) {
          var x = touch2.pageX - touch1.pageX,
              y = touch2.pageY - touch1.pageY;
          return Math.sqrt((x * x) + (y * y));
        },
        getScale: function getScale(start, end) {
          if (start.length >= 2 && end.length >= 2) {
            return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
          }
          return 1;
        },
        getRotation: function getRotation(start, end) {
          if (start.length >= 2 && end.length >= 2) {
            return this.getAngle(end[1], end[0]) - this.getAngle(start[1], start[0]);
          }
          return 0;
        },
        isVertical: function isVertical(direction) {
          return (direction == ionic.Gestures.DIRECTION_UP || direction == ionic.Gestures.DIRECTION_DOWN);
        },
        stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_class) {
          if (element && element.classList) {
            element.classList.add(css_class);
            element.onselectstart = function() {
              return false;
            };
          }
        }
      };
      ionic.Gestures.detection = {
        gestures: [],
        current: null,
        previous: null,
        stopped: false,
        startDetect: function startDetect(inst, eventData) {
          if (this.current) {
            return;
          }
          this.stopped = false;
          this.current = {
            inst: inst,
            startEvent: ionic.Gestures.utils.extend({}, eventData),
            lastEvent: false,
            name: ''
          };
          this.detect(eventData);
        },
        detect: function detect(eventData) {
          if (!this.current || this.stopped) {
            return;
          }
          eventData = this.extendEventData(eventData);
          var inst_options = this.current.inst.options;
          for (var g = 0,
              len = this.gestures.length; g < len; g++) {
            var gesture = this.gestures[g];
            if (!this.stopped && inst_options[gesture.name] !== false) {
              if (gesture.handler.call(gesture, eventData, this.current.inst) === false) {
                this.stopDetect();
                break;
              }
            }
          }
          if (this.current) {
            this.current.lastEvent = eventData;
          }
          if (eventData.eventType == ionic.Gestures.EVENT_END && !eventData.touches.length - 1) {
            this.stopDetect();
          }
          return eventData;
        },
        stopDetect: function stopDetect() {
          this.previous = ionic.Gestures.utils.extend({}, this.current);
          this.current = null;
          this.stopped = true;
        },
        extendEventData: function extendEventData(ev) {
          var startEv = this.current.startEvent;
          if (startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
            startEv.touches = [];
            for (var i = 0,
                len = ev.touches.length; i < len; i++) {
              startEv.touches.push(ionic.Gestures.utils.extend({}, ev.touches[i]));
            }
          }
          var delta_time = ev.timeStamp - startEv.timeStamp,
              delta_x = ev.center.pageX - startEv.center.pageX,
              delta_y = ev.center.pageY - startEv.center.pageY,
              velocity = ionic.Gestures.utils.getVelocity(delta_time, delta_x, delta_y);
          ionic.Gestures.utils.extend(ev, {
            deltaTime: delta_time,
            deltaX: delta_x,
            deltaY: delta_y,
            velocityX: velocity.x,
            velocityY: velocity.y,
            distance: ionic.Gestures.utils.getDistance(startEv.center, ev.center),
            angle: ionic.Gestures.utils.getAngle(startEv.center, ev.center),
            direction: ionic.Gestures.utils.getDirection(startEv.center, ev.center),
            scale: ionic.Gestures.utils.getScale(startEv.touches, ev.touches),
            rotation: ionic.Gestures.utils.getRotation(startEv.touches, ev.touches),
            startEvent: startEv
          });
          return ev;
        },
        register: function register(gesture) {
          var options = gesture.defaults || {};
          if (options[gesture.name] === undefined) {
            options[gesture.name] = true;
          }
          ionic.Gestures.utils.extend(ionic.Gestures.defaults, options, true);
          gesture.index = gesture.index || 1000;
          this.gestures.push(gesture);
          this.gestures.sort(function(a, b) {
            if (a.index < b.index) {
              return -1;
            }
            if (a.index > b.index) {
              return 1;
            }
            return 0;
          });
          return this.gestures;
        }
      };
      ionic.Gestures.gestures = ionic.Gestures.gestures || {};
      ionic.Gestures.gestures.Hold = {
        name: 'hold',
        index: 10,
        defaults: {
          hold_timeout: 500,
          hold_threshold: 1
        },
        timer: null,
        handler: function holdGesture(ev, inst) {
          switch (ev.eventType) {
            case ionic.Gestures.EVENT_START:
              clearTimeout(this.timer);
              ionic.Gestures.detection.current.name = this.name;
              this.timer = setTimeout(function() {
                if (ionic.Gestures.detection.current.name == 'hold') {
                  ionic.tap.cancelClick();
                  inst.trigger('hold', ev);
                }
              }, inst.options.hold_timeout);
              break;
            case ionic.Gestures.EVENT_MOVE:
              if (ev.distance > inst.options.hold_threshold) {
                clearTimeout(this.timer);
              }
              break;
            case ionic.Gestures.EVENT_END:
              clearTimeout(this.timer);
              break;
          }
        }
      };
      ionic.Gestures.gestures.Tap = {
        name: 'tap',
        index: 100,
        defaults: {
          tap_max_touchtime: 250,
          tap_max_distance: 10,
          tap_always: true,
          doubletap_distance: 20,
          doubletap_interval: 300
        },
        handler: function tapGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END && ev.srcEvent.type != 'touchcancel') {
            var prev = ionic.Gestures.detection.previous,
                did_doubletap = false;
            if (ev.deltaTime > inst.options.tap_max_touchtime || ev.distance > inst.options.tap_max_distance) {
              return;
            }
            if (prev && prev.name == 'tap' && (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval && ev.distance < inst.options.doubletap_distance) {
              inst.trigger('doubletap', ev);
              did_doubletap = true;
            }
            if (!did_doubletap || inst.options.tap_always) {
              ionic.Gestures.detection.current.name = 'tap';
              inst.trigger('tap', ev);
            }
          }
        }
      };
      ionic.Gestures.gestures.Swipe = {
        name: 'swipe',
        index: 40,
        defaults: {
          swipe_max_touches: 1,
          swipe_velocity: 0.7
        },
        handler: function swipeGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END) {
            if (inst.options.swipe_max_touches > 0 && ev.touches.length > inst.options.swipe_max_touches) {
              return;
            }
            if (ev.velocityX > inst.options.swipe_velocity || ev.velocityY > inst.options.swipe_velocity) {
              inst.trigger(this.name, ev);
              inst.trigger(this.name + ev.direction, ev);
            }
          }
        }
      };
      ionic.Gestures.gestures.Drag = {
        name: 'drag',
        index: 50,
        defaults: {
          drag_min_distance: 10,
          correct_for_drag_min_distance: true,
          drag_max_touches: 1,
          drag_block_horizontal: true,
          drag_block_vertical: true,
          drag_lock_to_axis: false,
          drag_lock_min_distance: 25
        },
        triggered: false,
        handler: function dragGesture(ev, inst) {
          if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name + 'end', ev);
            this.triggered = false;
            return;
          }
          if (inst.options.drag_max_touches > 0 && ev.touches.length > inst.options.drag_max_touches) {
            return;
          }
          switch (ev.eventType) {
            case ionic.Gestures.EVENT_START:
              this.triggered = false;
              break;
            case ionic.Gestures.EVENT_MOVE:
              if (ev.distance < inst.options.drag_min_distance && ionic.Gestures.detection.current.name != this.name) {
                return;
              }
              if (ionic.Gestures.detection.current.name != this.name) {
                ionic.Gestures.detection.current.name = this.name;
                if (inst.options.correct_for_drag_min_distance) {
                  var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
                  ionic.Gestures.detection.current.startEvent.center.pageX += ev.deltaX * factor;
                  ionic.Gestures.detection.current.startEvent.center.pageY += ev.deltaY * factor;
                  ev = ionic.Gestures.detection.extendEventData(ev);
                }
              }
              if (ionic.Gestures.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
                ev.drag_locked_to_axis = true;
              }
              var last_direction = ionic.Gestures.detection.current.lastEvent.direction;
              if (ev.drag_locked_to_axis && last_direction !== ev.direction) {
                if (ionic.Gestures.utils.isVertical(last_direction)) {
                  ev.direction = (ev.deltaY < 0) ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
                } else {
                  ev.direction = (ev.deltaX < 0) ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
                }
              }
              if (!this.triggered) {
                inst.trigger(this.name + 'start', ev);
                this.triggered = true;
              }
              inst.trigger(this.name, ev);
              inst.trigger(this.name + ev.direction, ev);
              if ((inst.options.drag_block_vertical && ionic.Gestures.utils.isVertical(ev.direction)) || (inst.options.drag_block_horizontal && !ionic.Gestures.utils.isVertical(ev.direction))) {
                ev.preventDefault();
              }
              break;
            case ionic.Gestures.EVENT_END:
              if (this.triggered) {
                inst.trigger(this.name + 'end', ev);
              }
              this.triggered = false;
              break;
          }
        }
      };
      ionic.Gestures.gestures.Transform = {
        name: 'transform',
        index: 45,
        defaults: {
          transform_min_scale: 0.01,
          transform_min_rotation: 1,
          transform_always_block: false
        },
        triggered: false,
        handler: function transformGesture(ev, inst) {
          if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name + 'end', ev);
            this.triggered = false;
            return;
          }
          if (ev.touches.length < 2) {
            return;
          }
          if (inst.options.transform_always_block) {
            ev.preventDefault();
          }
          switch (ev.eventType) {
            case ionic.Gestures.EVENT_START:
              this.triggered = false;
              break;
            case ionic.Gestures.EVENT_MOVE:
              var scale_threshold = Math.abs(1 - ev.scale);
              var rotation_threshold = Math.abs(ev.rotation);
              if (scale_threshold < inst.options.transform_min_scale && rotation_threshold < inst.options.transform_min_rotation) {
                return;
              }
              ionic.Gestures.detection.current.name = this.name;
              if (!this.triggered) {
                inst.trigger(this.name + 'start', ev);
                this.triggered = true;
              }
              inst.trigger(this.name, ev);
              if (rotation_threshold > inst.options.transform_min_rotation) {
                inst.trigger('rotate', ev);
              }
              if (scale_threshold > inst.options.transform_min_scale) {
                inst.trigger('pinch', ev);
                inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);
              }
              break;
            case ionic.Gestures.EVENT_END:
              if (this.triggered) {
                inst.trigger(this.name + 'end', ev);
              }
              this.triggered = false;
              break;
          }
        }
      };
      ionic.Gestures.gestures.Touch = {
        name: 'touch',
        index: -Infinity,
        defaults: {
          prevent_default: false,
          prevent_mouseevents: false
        },
        handler: function touchGesture(ev, inst) {
          if (inst.options.prevent_mouseevents && ev.pointerType == ionic.Gestures.POINTER_MOUSE) {
            ev.stopDetect();
            return;
          }
          if (inst.options.prevent_default) {
            ev.preventDefault();
          }
          if (ev.eventType == ionic.Gestures.EVENT_START) {
            inst.trigger(this.name, ev);
          }
        }
      };
      ionic.Gestures.gestures.Release = {
        name: 'release',
        index: Infinity,
        handler: function releaseGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END) {
            inst.trigger(this.name, ev);
          }
        }
      };
    })(window.ionic);
    (function(window, document, ionic) {
      function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      }
      var IOS = 'ios';
      var ANDROID = 'android';
      var WINDOWS_PHONE = 'windowsphone';
      ionic.Platform = {
        navigator: window.navigator,
        isReady: false,
        isFullScreen: false,
        platforms: null,
        grade: null,
        ua: navigator.userAgent,
        ready: function(cb) {
          if (this.isReady) {
            cb();
          } else {
            readyCallbacks.push(cb);
          }
        },
        detect: function() {
          ionic.Platform._checkPlatforms();
          ionic.requestAnimationFrame(function() {
            for (var i = 0; i < ionic.Platform.platforms.length; i++) {
              document.body.classList.add('platform-' + ionic.Platform.platforms[i]);
            }
          });
        },
        setGrade: function(grade) {
          var oldGrade = this.grade;
          this.grade = grade;
          ionic.requestAnimationFrame(function() {
            if (oldGrade) {
              document.body.classList.remove('grade-' + oldGrade);
            }
            document.body.classList.add('grade-' + grade);
          });
        },
        device: function() {
          return window.device || {};
        },
        _checkPlatforms: function(platforms) {
          this.platforms = [];
          var grade = 'a';
          if (this.isWebView()) {
            this.platforms.push('webview');
            this.platforms.push('cordova');
          } else {
            this.platforms.push('browser');
          }
          if (this.isIPad())
            this.platforms.push('ipad');
          var platform = this.platform();
          if (platform) {
            this.platforms.push(platform);
            var version = this.version();
            if (version) {
              var v = version.toString();
              if (v.indexOf('.') > 0) {
                v = v.replace('.', '_');
              } else {
                v += '_0';
              }
              this.platforms.push(platform + v.split('_')[0]);
              this.platforms.push(platform + v);
              if (this.isAndroid() && version < 4.4) {
                grade = (version < 4 ? 'c' : 'b');
              } else if (this.isWindowsPhone()) {
                grade = 'b';
              }
            }
          }
          this.setGrade(grade);
        },
        isWebView: function() {
          return !(!window.cordova && !window.PhoneGap && !window.phonegap);
        },
        isIPad: function() {
          if (/iPad/i.test(ionic.Platform.navigator.platform)) {
            return true;
          }
          return /iPad/i.test(this.ua);
        },
        isIOS: function() {
          return this.is(IOS);
        },
        isAndroid: function() {
          return this.is(ANDROID);
        },
        isWindowsPhone: function() {
          return this.is(WINDOWS_PHONE);
        },
        platform: function() {
          if (platformName === null)
            this.setPlatform(this.device().platform);
          return platformName;
        },
        setPlatform: function(n) {
          if (typeof n != 'undefined' && n !== null && n.length) {
            platformName = n.toLowerCase();
          } else if (getParameterByName('ionicplatform')) {
            platformName = getParameterByName('ionicplatform');
          } else if (this.ua.indexOf('Android') > 0) {
            platformName = ANDROID;
          } else if (this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
            platformName = IOS;
          } else if (this.ua.indexOf('Windows Phone') > -1) {
            platformName = WINDOWS_PHONE;
          } else {
            platformName = ionic.Platform.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
          }
        },
        version: function() {
          if (platformVersion === null)
            this.setVersion(this.device().version);
          return platformVersion;
        },
        setVersion: function(v) {
          if (typeof v != 'undefined' && v !== null) {
            v = v.split('.');
            v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
            if (!isNaN(v)) {
              platformVersion = v;
              return;
            }
          }
          platformVersion = 0;
          var pName = this.platform();
          var versionMatch = {
            'android': /Android (\d+).(\d+)?/,
            'ios': /OS (\d+)_(\d+)?/,
            'windowsphone': /Windows Phone (\d+).(\d+)?/
          };
          if (versionMatch[pName]) {
            v = this.ua.match(versionMatch[pName]);
            if (v && v.length > 2) {
              platformVersion = parseFloat(v[1] + '.' + v[2]);
            }
          }
        },
        is: function(type) {
          type = type.toLowerCase();
          if (this.platforms) {
            for (var x = 0; x < this.platforms.length; x++) {
              if (this.platforms[x] === type)
                return true;
            }
          }
          var pName = this.platform();
          if (pName) {
            return pName === type.toLowerCase();
          }
          return this.ua.toLowerCase().indexOf(type) >= 0;
        },
        exitApp: function() {
          this.ready(function() {
            navigator.app && navigator.app.exitApp && navigator.app.exitApp();
          });
        },
        showStatusBar: function(val) {
          this._showStatusBar = val;
          this.ready(function() {
            ionic.requestAnimationFrame(function() {
              if (ionic.Platform._showStatusBar) {
                window.StatusBar && window.StatusBar.show();
                document.body.classList.remove('status-bar-hide');
              } else {
                window.StatusBar && window.StatusBar.hide();
                document.body.classList.add('status-bar-hide');
              }
            });
          });
        },
        fullScreen: function(showFullScreen, showStatusBar) {
          this.isFullScreen = (showFullScreen !== false);
          ionic.DomUtil.ready(function() {
            ionic.requestAnimationFrame(function() {
              panes = document.getElementsByClassName('pane');
              for (var i = 0; i < panes.length; i++) {
                panes[i].style.height = panes[i].offsetHeight + "px";
              }
              if (ionic.Platform.isFullScreen) {
                document.body.classList.add('fullscreen');
              } else {
                document.body.classList.remove('fullscreen');
              }
            });
            ionic.Platform.showStatusBar((showStatusBar === true));
          });
        }
      };
      var platformName = null,
          platformVersion = null,
          readyCallbacks = [],
          windowLoadListenderAttached;
      function onWindowLoad() {
        if (ionic.Platform.isWebView()) {
          document.addEventListener("deviceready", onPlatformReady, false);
        } else {
          onPlatformReady();
        }
        if (windowLoadListenderAttached) {
          window.removeEventListener("load", onWindowLoad, false);
        }
      }
      if (document.readyState === 'complete') {
        onWindowLoad();
      } else {
        windowLoadListenderAttached = true;
        window.addEventListener("load", onWindowLoad, false);
      }
      window.addEventListener("load", onWindowLoad, false);
      function onPlatformReady() {
        ionic.Platform.isReady = true;
        ionic.Platform.detect();
        for (var x = 0; x < readyCallbacks.length; x++) {
          readyCallbacks[x]();
        }
        readyCallbacks = [];
        ionic.trigger('platformready', {target: document});
        ionic.requestAnimationFrame(function() {
          document.body.classList.add('platform-ready');
        });
      }
    })(this, document, ionic);
    (function(document, ionic) {
      'use strict';
      ionic.CSS = {};
      (function() {
        var i,
            keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform', '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];
        for (i = 0; i < keys.length; i++) {
          if (document.documentElement.style[keys[i]] !== undefined) {
            ionic.CSS.TRANSFORM = keys[i];
            break;
          }
        }
        keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
        for (i = 0; i < keys.length; i++) {
          if (document.documentElement.style[keys[i]] !== undefined) {
            ionic.CSS.TRANSITION = keys[i];
            break;
          }
        }
        var isWebkit = ionic.CSS.TRANSITION.indexOf('webkit') > -1;
        ionic.CSS.TRANSITION_DURATION = (isWebkit ? '-webkit-' : '') + 'transition-duration';
        ionic.CSS.TRANSITIONEND = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
      })();
      if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
        Object.defineProperty(HTMLElement.prototype, 'classList', {get: function() {
            var self = this;
            function update(fn) {
              return function() {
                var x,
                    classes = self.className.split(/\s+/);
                for (x = 0; x < arguments.length; x++) {
                  fn(classes, classes.indexOf(arguments[x]), arguments[x]);
                }
                self.className = classes.join(" ");
              };
            }
            return {
              add: update(function(classes, index, value) {
                ~index || classes.push(value);
              }),
              remove: update(function(classes, index) {
                ~index && classes.splice(index, 1);
              }),
              toggle: update(function(classes, index, value) {
                ~index ? classes.splice(index, 1) : classes.push(value);
              }),
              contains: function(value) {
                return !!~self.className.split(/\s+/).indexOf(value);
              },
              item: function(i) {
                return self.className.split(/\s+/)[i] || null;
              }
            };
          }});
      }
    })(document, ionic);
    var tapDoc;
    var tapActiveEle;
    var tapEnabledTouchEvents;
    var tapMouseResetTimer;
    var tapPointerMoved;
    var tapPointerStart;
    var tapTouchFocusedInput;
    var tapLastTouchTarget;
    var tapTouchMoveListener = 'touchmove';
    var TAP_RELEASE_TOLERANCE = 12;
    var TAP_RELEASE_BUTTON_TOLERANCE = 50;
    var tapEventListeners = {
      'click': tapClickGateKeeper,
      'mousedown': tapMouseDown,
      'mouseup': tapMouseUp,
      'mousemove': tapMouseMove,
      'touchstart': tapTouchStart,
      'touchend': tapTouchEnd,
      'touchcancel': tapTouchCancel,
      'touchmove': tapTouchMove,
      'pointerdown': tapTouchStart,
      'pointerup': tapTouchEnd,
      'pointercancel': tapTouchCancel,
      'pointermove': tapTouchMove,
      'MSPointerDown': tapTouchStart,
      'MSPointerUp': tapTouchEnd,
      'MSPointerCancel': tapTouchCancel,
      'MSPointerMove': tapTouchMove,
      'focusin': tapFocusIn,
      'focusout': tapFocusOut
    };
    ionic.tap = {
      register: function(ele) {
        tapDoc = ele;
        tapEventListener('click', true, true);
        tapEventListener('mouseup');
        tapEventListener('mousedown');
        if (window.navigator.pointerEnabled) {
          tapEventListener('pointerdown');
          tapEventListener('pointerup');
          tapEventListener('pointcancel');
          tapTouchMoveListener = 'pointermove';
        } else if (window.navigator.msPointerEnabled) {
          tapEventListener('MSPointerDown');
          tapEventListener('MSPointerUp');
          tapEventListener('MSPointerCancel');
          tapTouchMoveListener = 'MSPointerMove';
        } else {
          tapEventListener('touchstart');
          tapEventListener('touchend');
          tapEventListener('touchcancel');
        }
        tapEventListener('focusin');
        tapEventListener('focusout');
        return function() {
          for (var type in tapEventListeners) {
            tapEventListener(type, false);
          }
          tapDoc = null;
          tapActiveEle = null;
          tapEnabledTouchEvents = false;
          tapPointerMoved = false;
          tapPointerStart = null;
        };
      },
      ignoreScrollStart: function(e) {
        return (e.defaultPrevented) || (/^(file|range)$/i).test(e.target.type) || (e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-scroll')) == 'true' || (!!(/^(object|embed)$/i).test(e.target.tagName)) || ionic.tap.isElementTapDisabled(e.target);
      },
      isTextInput: function(ele) {
        return !!ele && (ele.tagName == 'TEXTAREA' || ele.contentEditable === 'true' || (ele.tagName == 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset)$/i).test(ele.type)));
      },
      isDateInput: function(ele) {
        return !!ele && (ele.tagName == 'INPUT' && (/^(date|time|datetime-local|month|week)$/i).test(ele.type));
      },
      isLabelWithTextInput: function(ele) {
        var container = tapContainingElement(ele, false);
        return !!container && ionic.tap.isTextInput(tapTargetElement(container));
      },
      containsOrIsTextInput: function(ele) {
        return ionic.tap.isTextInput(ele) || ionic.tap.isLabelWithTextInput(ele);
      },
      cloneFocusedInput: function(container, scrollIntance) {
        if (ionic.tap.hasCheckedClone)
          return;
        ionic.tap.hasCheckedClone = true;
        ionic.requestAnimationFrame(function() {
          var focusInput = container.querySelector(':focus');
          if (ionic.tap.isTextInput(focusInput)) {
            var clonedInput = focusInput.parentElement.querySelector('.cloned-text-input');
            if (!clonedInput) {
              clonedInput = document.createElement(focusInput.tagName);
              clonedInput.placeholder = focusInput.placeholder;
              clonedInput.type = focusInput.type;
              clonedInput.value = focusInput.value;
              clonedInput.style = focusInput.style;
              clonedInput.className = focusInput.className;
              clonedInput.classList.add('cloned-text-input');
              clonedInput.readOnly = true;
              if (focusInput.isContentEditable) {
                clonedInput.contentEditable = focusInput.contentEditable;
                clonedInput.innerHTML = focusInput.innerHTML;
              }
              focusInput.parentElement.insertBefore(clonedInput, focusInput);
              focusInput.style.top = focusInput.offsetTop;
              focusInput.classList.add('previous-input-focus');
            }
          }
        });
      },
      hasCheckedClone: false,
      removeClonedInputs: function(container, scrollIntance) {
        ionic.tap.hasCheckedClone = false;
        ionic.requestAnimationFrame(function() {
          var clonedInputs = container.querySelectorAll('.cloned-text-input');
          var previousInputFocus = container.querySelectorAll('.previous-input-focus');
          var x;
          for (x = 0; x < clonedInputs.length; x++) {
            clonedInputs[x].parentElement.removeChild(clonedInputs[x]);
          }
          for (x = 0; x < previousInputFocus.length; x++) {
            previousInputFocus[x].classList.remove('previous-input-focus');
            previousInputFocus[x].style.top = '';
            previousInputFocus[x].focus();
          }
        });
      },
      requiresNativeClick: function(ele) {
        if (!ele || ele.disabled || (/^(file|range)$/i).test(ele.type) || (/^(object|video)$/i).test(ele.tagName) || ionic.tap.isLabelContainingFileInput(ele)) {
          return true;
        }
        return ionic.tap.isElementTapDisabled(ele);
      },
      isLabelContainingFileInput: function(ele) {
        var lbl = tapContainingElement(ele);
        if (lbl.tagName !== 'LABEL')
          return false;
        var fileInput = lbl.querySelector('input[type=file]');
        if (fileInput && fileInput.disabled === false)
          return true;
        return false;
      },
      isElementTapDisabled: function(ele) {
        if (ele && ele.nodeType === 1) {
          var element = ele;
          while (element) {
            if ((element.dataset ? element.dataset.tapDisabled : element.getAttribute('data-tap-disabled')) == 'true') {
              return true;
            }
            element = element.parentElement;
          }
        }
        return false;
      },
      setTolerance: function(releaseTolerance, releaseButtonTolerance) {
        TAP_RELEASE_TOLERANCE = releaseTolerance;
        TAP_RELEASE_BUTTON_TOLERANCE = releaseButtonTolerance;
      },
      cancelClick: function() {
        tapPointerMoved = true;
      },
      pointerCoord: function(event) {
        var c = {
          x: 0,
          y: 0
        };
        if (event) {
          var touches = event.touches && event.touches.length ? event.touches : [event];
          var e = (event.changedTouches && event.changedTouches[0]) || touches[0];
          if (e) {
            c.x = e.clientX || e.pageX || 0;
            c.y = e.clientY || e.pageY || 0;
          }
        }
        return c;
      }
    };
    function tapEventListener(type, enable, useCapture) {
      if (enable !== false) {
        tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
      } else {
        tapDoc.removeEventListener(type, tapEventListeners[type]);
      }
    }
    function tapClick(e) {
      var container = tapContainingElement(e.target);
      var ele = tapTargetElement(container);
      if (ionic.tap.requiresNativeClick(ele) || tapPointerMoved)
        return false;
      var c = ionic.tap.pointerCoord(e);
      triggerMouseEvent('click', ele, c.x, c.y);
      tapHandleFocus(ele);
    }
    function triggerMouseEvent(type, ele, x, y) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initMouseEvent(type, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      ele.dispatchEvent(clickEvent);
    }
    function tapClickGateKeeper(e) {
      if (e.target.type == 'submit' && e.detail === 0) {
        return;
      }
      if ((ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) || (!e.isIonicTap && !ionic.tap.requiresNativeClick(e.target))) {
        e.stopPropagation();
        if (!ionic.tap.isLabelWithTextInput(e.target)) {
          e.preventDefault();
        }
        return false;
      }
    }
    function tapMouseDown(e) {
      if (e.isIonicTap || tapIgnoreEvent(e))
        return;
      if (tapEnabledTouchEvents) {
        void 0;
        e.stopPropagation();
        if ((!ionic.tap.isTextInput(e.target) || tapLastTouchTarget !== e.target) && !(/^(select|option)$/i).test(e.target.tagName)) {
          e.preventDefault();
        }
        return false;
      }
      tapPointerMoved = false;
      tapPointerStart = ionic.tap.pointerCoord(e);
      tapEventListener('mousemove');
      ionic.activator.start(e);
    }
    function tapMouseUp(e) {
      if (tapEnabledTouchEvents) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      if (tapIgnoreEvent(e) || (/^(select|option)$/i).test(e.target.tagName))
        return false;
      if (!tapHasPointerMoved(e)) {
        tapClick(e);
      }
      tapEventListener('mousemove', false);
      ionic.activator.end();
      tapPointerMoved = false;
    }
    function tapMouseMove(e) {
      if (tapHasPointerMoved(e)) {
        tapEventListener('mousemove', false);
        ionic.activator.end();
        tapPointerMoved = true;
        return false;
      }
    }
    function tapTouchStart(e) {
      if (tapIgnoreEvent(e))
        return;
      tapPointerMoved = false;
      tapEnableTouchEvents();
      tapPointerStart = ionic.tap.pointerCoord(e);
      tapEventListener(tapTouchMoveListener);
      ionic.activator.start(e);
      if (ionic.Platform.isIOS() && ionic.tap.isLabelWithTextInput(e.target)) {
        var textInput = tapTargetElement(tapContainingElement(e.target));
        if (textInput !== tapActiveEle) {
          e.preventDefault();
        }
      }
    }
    function tapTouchEnd(e) {
      if (tapIgnoreEvent(e))
        return;
      tapEnableTouchEvents();
      if (!tapHasPointerMoved(e)) {
        tapClick(e);
        if ((/^(select|option)$/i).test(e.target.tagName)) {
          e.preventDefault();
        }
      }
      tapLastTouchTarget = e.target;
      tapTouchCancel();
    }
    function tapTouchMove(e) {
      if (tapHasPointerMoved(e)) {
        tapPointerMoved = true;
        tapEventListener(tapTouchMoveListener, false);
        ionic.activator.end();
        return false;
      }
    }
    function tapTouchCancel(e) {
      tapEventListener(tapTouchMoveListener, false);
      ionic.activator.end();
      tapPointerMoved = false;
    }
    function tapEnableTouchEvents() {
      tapEnabledTouchEvents = true;
      clearTimeout(tapMouseResetTimer);
      tapMouseResetTimer = setTimeout(function() {
        tapEnabledTouchEvents = false;
      }, 2000);
    }
    function tapIgnoreEvent(e) {
      if (e.isTapHandled)
        return true;
      e.isTapHandled = true;
      if (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) {
        e.preventDefault();
        return true;
      }
    }
    function tapHandleFocus(ele) {
      tapTouchFocusedInput = null;
      var triggerFocusIn = false;
      if (ele.tagName == 'SELECT') {
        triggerMouseEvent('mousedown', ele, 0, 0);
        ele.focus && ele.focus();
        triggerFocusIn = true;
      } else if (tapActiveElement() === ele) {
        triggerFocusIn = true;
      } else if ((/^(input|textarea)$/i).test(ele.tagName) || ele.isContentEditable) {
        triggerFocusIn = true;
        ele.focus && ele.focus();
        ele.value = ele.value;
        if (tapEnabledTouchEvents) {
          tapTouchFocusedInput = ele;
        }
      } else {
        tapFocusOutActive();
      }
      if (triggerFocusIn) {
        tapActiveElement(ele);
        ionic.trigger('ionic.focusin', {target: ele}, true);
      }
    }
    function tapFocusOutActive() {
      var ele = tapActiveElement();
      if (ele && ((/^(input|textarea|select)$/i).test(ele.tagName) || ele.isContentEditable)) {
        void 0;
        ele.blur();
      }
      tapActiveElement(null);
    }
    function tapFocusIn(e) {
      if (tapEnabledTouchEvents && ionic.tap.isTextInput(tapActiveElement()) && ionic.tap.isTextInput(tapTouchFocusedInput) && tapTouchFocusedInput !== e.target) {
        void 0;
        tapTouchFocusedInput.focus();
        tapTouchFocusedInput = null;
      }
      ionic.scroll.isScrolling = false;
    }
    function tapFocusOut() {
      tapActiveElement(null);
    }
    function tapActiveElement(ele) {
      if (arguments.length) {
        tapActiveEle = ele;
      }
      return tapActiveEle || document.activeElement;
    }
    function tapHasPointerMoved(endEvent) {
      if (!endEvent || endEvent.target.nodeType !== 1 || !tapPointerStart || (tapPointerStart.x === 0 && tapPointerStart.y === 0)) {
        return false;
      }
      var endCoordinates = ionic.tap.pointerCoord(endEvent);
      var hasClassList = !!(endEvent.target.classList && endEvent.target.classList.contains && typeof endEvent.target.classList.contains === 'function');
      var releaseTolerance = hasClassList && endEvent.target.classList.contains('button') ? TAP_RELEASE_BUTTON_TOLERANCE : TAP_RELEASE_TOLERANCE;
      return Math.abs(tapPointerStart.x - endCoordinates.x) > releaseTolerance || Math.abs(tapPointerStart.y - endCoordinates.y) > releaseTolerance;
    }
    function tapContainingElement(ele, allowSelf) {
      var climbEle = ele;
      for (var x = 0; x < 6; x++) {
        if (!climbEle)
          break;
        if (climbEle.tagName === 'LABEL')
          return climbEle;
        climbEle = climbEle.parentElement;
      }
      if (allowSelf !== false)
        return ele;
    }
    function tapTargetElement(ele) {
      if (ele && ele.tagName === 'LABEL') {
        if (ele.control)
          return ele.control;
        if (ele.querySelector) {
          var control = ele.querySelector('input,textarea,select');
          if (control)
            return control;
        }
      }
      return ele;
    }
    ionic.DomUtil.ready(function() {
      var ng = typeof angular !== 'undefined' ? angular : null;
      if (!ng || (ng && !ng.scenario)) {
        ionic.tap.register(document);
      }
    });
    (function(document, ionic) {
      'use strict';
      var queueElements = {};
      var activeElements = {};
      var keyId = 0;
      var ACTIVATED_CLASS = 'activated';
      ionic.activator = {
        start: function(e) {
          var self = this;
          ionic.requestAnimationFrame(function() {
            if ((ionic.scroll && ionic.scroll.isScrolling) || ionic.tap.requiresNativeClick(e.target))
              return;
            var ele = e.target;
            var eleToActivate;
            for (var x = 0; x < 6; x++) {
              if (!ele || ele.nodeType !== 1)
                break;
              if (eleToActivate && ele.classList.contains('item')) {
                eleToActivate = ele;
                break;
              }
              if (ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click')) {
                eleToActivate = ele;
                break;
              }
              if (ele.classList.contains('button')) {
                eleToActivate = ele;
                break;
              }
              if (ele.tagName == 'ION-CONTENT' || ele.classList.contains('pane') || ele.tagName == 'BODY') {
                break;
              }
              ele = ele.parentElement;
            }
            if (eleToActivate) {
              queueElements[keyId] = eleToActivate;
              ionic.requestAnimationFrame(activateElements);
              keyId = (keyId > 29 ? 0 : keyId + 1);
            }
          });
        },
        end: function() {
          setTimeout(clear, 200);
        }
      };
      function clear() {
        queueElements = {};
        ionic.requestAnimationFrame(deactivateElements);
      }
      function activateElements() {
        for (var key in queueElements) {
          if (queueElements[key]) {
            queueElements[key].classList.add(ACTIVATED_CLASS);
            activeElements[key] = queueElements[key];
          }
        }
        queueElements = {};
      }
      function deactivateElements() {
        if (ionic.transition && ionic.transition.isActive) {
          setTimeout(deactivateElements, 400);
          return;
        }
        for (var key in activeElements) {
          if (activeElements[key]) {
            activeElements[key].classList.remove(ACTIVATED_CLASS);
            delete activeElements[key];
          }
        }
      }
    })(document, ionic);
    (function(ionic) {
      var uid = ['0', '0', '0'];
      ionic.Utils = {
        arrayMove: function(arr, old_index, new_index) {
          if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
              arr.push(undefined);
            }
          }
          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return arr;
        },
        proxy: function(func, context) {
          var args = Array.prototype.slice.call(arguments, 2);
          return function() {
            return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
          };
        },
        debounce: function(func, wait, immediate) {
          var timeout,
              args,
              context,
              timestamp,
              result;
          return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
              var last = (new Date()) - timestamp;
              if (last < wait) {
                timeout = setTimeout(later, wait - last);
              } else {
                timeout = null;
                if (!immediate)
                  result = func.apply(context, args);
              }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
              timeout = setTimeout(later, wait);
            }
            if (callNow)
              result = func.apply(context, args);
            return result;
          };
        },
        throttle: function(func, wait, options) {
          var context,
              args,
              result;
          var timeout = null;
          var previous = 0;
          options || (options = {});
          var later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
          };
          return function() {
            var now = Date.now();
            if (!previous && options.leading === false)
              previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
              clearTimeout(timeout);
              timeout = null;
              previous = now;
              result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        },
        inherit: function(protoProps, staticProps) {
          var parent = this;
          var child;
          if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
          } else {
            child = function() {
              return parent.apply(this, arguments);
            };
          }
          ionic.extend(child, parent, staticProps);
          var Surrogate = function() {
            this.constructor = child;
          };
          Surrogate.prototype = parent.prototype;
          child.prototype = new Surrogate();
          if (protoProps)
            ionic.extend(child.prototype, protoProps);
          child.__super__ = parent.prototype;
          return child;
        },
        extend: function(obj) {
          var args = Array.prototype.slice.call(arguments, 1);
          for (var i = 0; i < args.length; i++) {
            var source = args[i];
            if (source) {
              for (var prop in source) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        },
        nextUid: function() {
          var index = uid.length;
          var digit;
          while (index) {
            index--;
            digit = uid[index].charCodeAt(0);
            if (digit == 57) {
              uid[index] = 'A';
              return uid.join('');
            }
            if (digit == 90) {
              uid[index] = '0';
            } else {
              uid[index] = String.fromCharCode(digit + 1);
              return uid.join('');
            }
          }
          uid.unshift('0');
          return uid.join('');
        },
        disconnectScope: function disconnectScope(scope) {
          if (!scope)
            return;
          if (scope.$root === scope) {
            return;
          }
          var parent = scope.$parent;
          scope.$$disconnected = true;
          scope.$broadcast('$ionic.disconnectScope');
          if (parent.$$childHead === scope) {
            parent.$$childHead = scope.$$nextSibling;
          }
          if (parent.$$childTail === scope) {
            parent.$$childTail = scope.$$prevSibling;
          }
          if (scope.$$prevSibling) {
            scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
          }
          if (scope.$$nextSibling) {
            scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
          }
          scope.$$nextSibling = scope.$$prevSibling = null;
        },
        reconnectScope: function reconnectScope(scope) {
          if (!scope)
            return;
          if (scope.$root === scope) {
            return;
          }
          if (!scope.$$disconnected) {
            return;
          }
          var parent = scope.$parent;
          scope.$$disconnected = false;
          scope.$broadcast('$ionic.reconnectScope');
          scope.$$prevSibling = parent.$$childTail;
          if (parent.$$childHead) {
            parent.$$childTail.$$nextSibling = scope;
            parent.$$childTail = scope;
          } else {
            parent.$$childHead = parent.$$childTail = scope;
          }
        },
        isScopeDisconnected: function(scope) {
          var climbScope = scope;
          while (climbScope) {
            if (climbScope.$$disconnected)
              return true;
            climbScope = climbScope.$parent;
          }
          return false;
        }
      };
      ionic.inherit = ionic.Utils.inherit;
      ionic.extend = ionic.Utils.extend;
      ionic.throttle = ionic.Utils.throttle;
      ionic.proxy = ionic.Utils.proxy;
      ionic.debounce = ionic.Utils.debounce;
    })(window.ionic);
    var keyboardViewportHeight = getViewportHeight();
    var keyboardIsOpen;
    var keyboardActiveElement;
    var keyboardFocusOutTimer;
    var keyboardFocusInTimer;
    var keyboardPollHeightTimer;
    var keyboardLastShow = 0;
    var KEYBOARD_OPEN_CSS = 'keyboard-open';
    var SCROLL_CONTAINER_CSS = 'scroll';
    ionic.keyboard = {
      isOpen: false,
      height: null,
      landscape: false,
      hide: function() {
        clearTimeout(keyboardFocusInTimer);
        clearTimeout(keyboardFocusOutTimer);
        clearTimeout(keyboardPollHeightTimer);
        ionic.keyboard.isOpen = false;
        ionic.trigger('resetScrollView', {target: keyboardActiveElement}, true);
        ionic.requestAnimationFrame(function() {
          document.body.classList.remove(KEYBOARD_OPEN_CSS);
        });
        if (window.navigator.msPointerEnabled) {
          document.removeEventListener("MSPointerMove", keyboardPreventDefault);
        } else {
          document.removeEventListener('touchmove', keyboardPreventDefault);
        }
        document.removeEventListener('keydown', keyboardOnKeyDown);
        if (keyboardHasPlugin()) {
          cordova.plugins.Keyboard.close();
        }
      },
      show: function() {
        if (keyboardHasPlugin()) {
          cordova.plugins.Keyboard.show();
        }
      }
    };
    function keyboardInit() {
      if (keyboardHasPlugin()) {
        window.addEventListener('native.keyboardshow', keyboardNativeShow);
        window.addEventListener('native.keyboardhide', keyboardFocusOut);
        window.addEventListener('native.showkeyboard', keyboardNativeShow);
        window.addEventListener('native.hidekeyboard', keyboardFocusOut);
      } else {
        document.body.addEventListener('focusout', keyboardFocusOut);
      }
      document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
      document.body.addEventListener('focusin', keyboardBrowserFocusIn);
      document.body.addEventListener('orientationchange', keyboardOrientationChange);
      if (window.navigator.msPointerEnabled) {
        document.removeEventListener("MSPointerDown", keyboardInit);
      } else {
        document.removeEventListener('touchstart', keyboardInit);
      }
    }
    function keyboardNativeShow(e) {
      clearTimeout(keyboardFocusOutTimer);
      ionic.keyboard.height = e.keyboardHeight;
    }
    function keyboardBrowserFocusIn(e) {
      if (!e.target || e.target.readOnly || !ionic.tap.isTextInput(e.target) || ionic.tap.isDateInput(e.target) || !keyboardIsWithinScroll(e.target))
        return;
      document.addEventListener('keydown', keyboardOnKeyDown, false);
      document.body.scrollTop = 0;
      document.body.querySelector('.scroll-content').scrollTop = 0;
      keyboardActiveElement = e.target;
      keyboardSetShow(e);
    }
    function keyboardSetShow(e) {
      clearTimeout(keyboardFocusInTimer);
      clearTimeout(keyboardFocusOutTimer);
      keyboardFocusInTimer = setTimeout(function() {
        if (keyboardLastShow + 350 > Date.now())
          return;
        void 0;
        keyboardLastShow = Date.now();
        var keyboardHeight;
        var elementBounds = keyboardActiveElement.getBoundingClientRect();
        var count = 0;
        keyboardPollHeightTimer = setInterval(function() {
          keyboardHeight = keyboardGetHeight();
          if (count > 10) {
            clearInterval(keyboardPollHeightTimer);
            keyboardHeight = 275;
          }
          if (keyboardHeight) {
            clearInterval(keyboardPollHeightTimer);
            keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
          }
          count++;
        }, 100);
      }, 32);
    }
    function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
      var details = {
        target: element,
        elementTop: Math.round(elementTop),
        elementBottom: Math.round(elementBottom),
        keyboardHeight: keyboardHeight,
        viewportHeight: viewportHeight
      };
      details.hasPlugin = keyboardHasPlugin();
      details.contentHeight = viewportHeight - keyboardHeight;
      void 0;
      details.isElementUnderKeyboard = (details.elementBottom > details.contentHeight);
      ionic.keyboard.isOpen = true;
      keyboardActiveElement = element;
      ionic.trigger('scrollChildIntoView', details, true);
      ionic.requestAnimationFrame(function() {
        document.body.classList.add(KEYBOARD_OPEN_CSS);
      });
      if (window.navigator.msPointerEnabled) {
        document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
      } else {
        document.addEventListener('touchmove', keyboardPreventDefault, false);
      }
      return details;
    }
    function keyboardFocusOut(e) {
      clearTimeout(keyboardFocusOutTimer);
      keyboardFocusOutTimer = setTimeout(ionic.keyboard.hide, 350);
    }
    function keyboardUpdateViewportHeight() {
      if (getViewportHeight() > keyboardViewportHeight) {
        keyboardViewportHeight = getViewportHeight();
      }
    }
    function keyboardOnKeyDown(e) {
      if (ionic.scroll.isScrolling) {
        keyboardPreventDefault(e);
      }
    }
    function keyboardPreventDefault(e) {
      if (e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
    function keyboardOrientationChange() {
      var updatedViewportHeight = getViewportHeight();
      if (updatedViewportHeight === keyboardViewportHeight) {
        var count = 0;
        var pollViewportHeight = setInterval(function() {
          if (count > 10) {
            clearInterval(pollViewportHeight);
          }
          updatedViewportHeight = getViewportHeight();
          if (updatedViewportHeight !== keyboardViewportHeight) {
            if (updatedViewportHeight < keyboardViewportHeight) {
              ionic.keyboard.landscape = true;
            } else {
              ionic.keyboard.landscape = false;
            }
            keyboardViewportHeight = updatedViewportHeight;
            clearInterval(pollViewportHeight);
          }
          count++;
        }, 50);
      } else {
        keyboardViewportHeight = updatedViewportHeight;
      }
    }
    function keyboardGetHeight() {
      if (ionic.keyboard.height) {
        return ionic.keyboard.height;
      }
      if (ionic.Platform.isAndroid()) {
        if (ionic.Platform.isFullScreen) {
          return 275;
        }
        if (getViewportHeight() < keyboardViewportHeight) {
          return keyboardViewportHeight - getViewportHeight();
        } else {
          return 0;
        }
      }
      if (ionic.Platform.isIOS()) {
        if (ionic.keyboard.landscape) {
          return 206;
        }
        if (!ionic.Platform.isWebView()) {
          return 216;
        }
        return 260;
      }
      return 275;
    }
    function getViewportHeight() {
      return window.innerHeight || screen.height;
    }
    function keyboardIsWithinScroll(ele) {
      while (ele) {
        if (ele.classList.contains(SCROLL_CONTAINER_CSS)) {
          return true;
        }
        ele = ele.parentElement;
      }
      return false;
    }
    function keyboardHasPlugin() {
      return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
    }
    ionic.Platform.ready(function() {
      keyboardUpdateViewportHeight();
      setTimeout(keyboardUpdateViewportHeight, 999);
      if (window.navigator.msPointerEnabled) {
        document.addEventListener("MSPointerDown", keyboardInit, false);
      } else {
        document.addEventListener('touchstart', keyboardInit, false);
      }
    });
    var viewportTag;
    var viewportProperties = {};
    ionic.viewport = {orientation: function() {
        return (window.innerWidth > window.innerHeight ? 90 : 0);
      }};
    function viewportLoadTag() {
      var x;
      for (x = 0; x < document.head.children.length; x++) {
        if (document.head.children[x].name == 'viewport') {
          viewportTag = document.head.children[x];
          break;
        }
      }
      if (viewportTag) {
        var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
        var keyValue;
        for (x = 0; x < props.length; x++) {
          if (props[x]) {
            keyValue = props[x].split('=');
            viewportProperties[keyValue[0]] = (keyValue.length > 1 ? keyValue[1] : '_');
          }
        }
        viewportUpdate();
      }
    }
    function viewportUpdate() {
      var initWidth = viewportProperties.width;
      var initHeight = viewportProperties.height;
      var p = ionic.Platform;
      var version = p.version();
      var DEVICE_WIDTH = 'device-width';
      var DEVICE_HEIGHT = 'device-height';
      var orientation = ionic.viewport.orientation();
      delete viewportProperties.height;
      viewportProperties.width = DEVICE_WIDTH;
      if (p.isIPad()) {
        if (version > 7) {
          delete viewportProperties.width;
        } else {
          if (p.isWebView()) {
            if (orientation == 90) {
              viewportProperties.height = '0';
            } else if (version == 7) {
              viewportProperties.height = DEVICE_HEIGHT;
            }
          } else {
            if (version < 7) {
              viewportProperties.height = '0';
            }
          }
        }
      } else if (p.isIOS()) {
        if (p.isWebView()) {
          if (version > 7) {
            delete viewportProperties.width;
          } else if (version < 7) {
            if (initHeight)
              viewportProperties.height = '0';
          } else if (version == 7) {
            viewportProperties.height = DEVICE_HEIGHT;
          }
        } else {
          if (version < 7) {
            if (initHeight)
              viewportProperties.height = '0';
          }
        }
      }
      if (initWidth !== viewportProperties.width || initHeight !== viewportProperties.height) {
        viewportTagUpdate();
      }
    }
    function viewportTagUpdate() {
      var key,
          props = [];
      for (key in viewportProperties) {
        if (viewportProperties[key]) {
          props.push(key + (viewportProperties[key] == '_' ? '' : '=' + viewportProperties[key]));
        }
      }
      viewportTag.content = props.join(', ');
    }
    ionic.Platform.ready(function() {
      viewportLoadTag();
      window.addEventListener("orientationchange", function() {
        setTimeout(viewportUpdate, 1000);
      }, false);
    });
    (function(ionic) {
      'use strict';
      ionic.views.View = function() {
        this.initialize.apply(this, arguments);
      };
      ionic.views.View.inherit = ionic.inherit;
      ionic.extend(ionic.views.View.prototype, {initialize: function() {}});
    })(window.ionic);
    var zyngaCore = {effect: {}};
    (function(global) {
      var time = Date.now || function() {
        return +new Date();
      };
      var desiredFrames = 60;
      var millisecondsPerSecond = 1000;
      var running = {};
      var counter = 1;
      zyngaCore.effect.Animate = {
        requestAnimationFrame: (function() {
          var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
          var isNative = !!requestFrame;
          if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
            isNative = false;
          }
          if (isNative) {
            return function(callback, root) {
              requestFrame(callback, root);
            };
          }
          var TARGET_FPS = 60;
          var requests = {};
          var requestCount = 0;
          var rafHandle = 1;
          var intervalHandle = null;
          var lastActive = +new Date();
          return function(callback, root) {
            var callbackHandle = rafHandle++;
            requests[callbackHandle] = callback;
            requestCount++;
            if (intervalHandle === null) {
              intervalHandle = setInterval(function() {
                var time = +new Date();
                var currentRequests = requests;
                requests = {};
                requestCount = 0;
                for (var key in currentRequests) {
                  if (currentRequests.hasOwnProperty(key)) {
                    currentRequests[key](time);
                    lastActive = time;
                  }
                }
                if (time - lastActive > 2500) {
                  clearInterval(intervalHandle);
                  intervalHandle = null;
                }
              }, 1000 / TARGET_FPS);
            }
            return callbackHandle;
          };
        })(),
        stop: function(id) {
          var cleared = running[id] != null;
          if (cleared) {
            running[id] = null;
          }
          return cleared;
        },
        isRunning: function(id) {
          return running[id] != null;
        },
        start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
          var start = time();
          var lastFrame = start;
          var percent = 0;
          var dropCounter = 0;
          var id = counter++;
          if (!root) {
            root = document.body;
          }
          if (id % 20 === 0) {
            var newRunning = {};
            for (var usedId in running) {
              newRunning[usedId] = true;
            }
            running = newRunning;
          }
          var step = function(virtual) {
            var render = virtual !== true;
            var now = time();
            if (!running[id] || (verifyCallback && !verifyCallback(id))) {
              running[id] = null;
              completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
              return;
            }
            if (render) {
              var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
              for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                step(true);
                dropCounter++;
              }
            }
            if (duration) {
              percent = (now - start) / duration;
              if (percent > 1) {
                percent = 1;
              }
            }
            var value = easingMethod ? easingMethod(percent) : percent;
            if ((stepCallback(value, now, render) === false || percent === 1) && render) {
              running[id] = null;
              completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
            } else if (render) {
              lastFrame = now;
              zyngaCore.effect.Animate.requestAnimationFrame(step, root);
            }
          };
          running[id] = true;
          zyngaCore.effect.Animate.requestAnimationFrame(step, root);
          return id;
        }
      };
    })(this);
    var Scroller;
    (function(ionic) {
      var NOOP = function() {};
      var easeOutCubic = function(pos) {
        return (Math.pow((pos - 1), 3) + 1);
      };
      var easeInOutCubic = function(pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 3);
        }
        return 0.5 * (Math.pow((pos - 2), 3) + 2);
      };
      ionic.views.Scroll = ionic.views.View.inherit({
        initialize: function(options) {
          var self = this;
          self.__container = options.el;
          self.__content = options.el.firstElementChild;
          setTimeout(function() {
            if (self.__container && self.__content) {
              self.__container.scrollTop = 0;
              self.__content.scrollTop = 0;
            }
          });
          self.options = {
            scrollingX: false,
            scrollbarX: true,
            scrollingY: true,
            scrollbarY: true,
            startX: 0,
            startY: 0,
            wheelDampen: 6,
            minScrollbarSizeX: 5,
            minScrollbarSizeY: 5,
            scrollbarsFade: true,
            scrollbarFadeDelay: 300,
            scrollbarResizeFadeDelay: 1000,
            animating: true,
            animationDuration: 250,
            bouncing: true,
            locking: true,
            paging: false,
            snapping: false,
            zooming: false,
            minZoom: 0.5,
            maxZoom: 3,
            speedMultiplier: 1,
            deceleration: 0.97,
            preventDefault: false,
            scrollingComplete: NOOP,
            penetrationDeceleration: 0.03,
            penetrationAcceleration: 0.08,
            scrollEventInterval: 10,
            getContentWidth: function() {
              return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
            },
            getContentHeight: function() {
              return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + (self.__content.offsetTop * 2));
            }
          };
          for (var key in options) {
            self.options[key] = options[key];
          }
          self.hintResize = ionic.debounce(function() {
            self.resize();
          }, 1000, true);
          self.onScroll = function() {
            if (!ionic.scroll.isScrolling) {
              setTimeout(self.setScrollStart, 50);
            } else {
              clearTimeout(self.scrollTimer);
              self.scrollTimer = setTimeout(self.setScrollStop, 80);
            }
          };
          self.setScrollStart = function() {
            ionic.scroll.isScrolling = Math.abs(ionic.scroll.lastTop - self.__scrollTop) > 1;
            clearTimeout(self.scrollTimer);
            self.scrollTimer = setTimeout(self.setScrollStop, 80);
          };
          self.setScrollStop = function() {
            ionic.scroll.isScrolling = false;
            ionic.scroll.lastTop = self.__scrollTop;
          };
          self.triggerScrollEvent = ionic.throttle(function() {
            self.onScroll();
            ionic.trigger('scroll', {
              scrollTop: self.__scrollTop,
              scrollLeft: self.__scrollLeft,
              target: self.__container
            });
          }, self.options.scrollEventInterval);
          self.triggerScrollEndEvent = function() {
            ionic.trigger('scrollend', {
              scrollTop: self.__scrollTop,
              scrollLeft: self.__scrollLeft,
              target: self.__container
            });
          };
          self.__scrollLeft = self.options.startX;
          self.__scrollTop = self.options.startY;
          self.__callback = self.getRenderFn();
          self.__initEventHandlers();
          self.__createScrollbars();
        },
        run: function() {
          this.resize();
          this.__fadeScrollbars('out', this.options.scrollbarResizeFadeDelay);
        },
        __isSingleTouch: false,
        __isTracking: false,
        __didDecelerationComplete: false,
        __isGesturing: false,
        __isDragging: false,
        __isDecelerating: false,
        __isAnimating: false,
        __clientLeft: 0,
        __clientTop: 0,
        __clientWidth: 0,
        __clientHeight: 0,
        __contentWidth: 0,
        __contentHeight: 0,
        __snapWidth: 100,
        __snapHeight: 100,
        __refreshHeight: null,
        __refreshActive: false,
        __refreshActivate: null,
        __refreshDeactivate: null,
        __refreshStart: null,
        __zoomLevel: 1,
        __scrollLeft: 0,
        __scrollTop: 0,
        __maxScrollLeft: 0,
        __maxScrollTop: 0,
        __scheduledLeft: 0,
        __scheduledTop: 0,
        __scheduledZoom: 0,
        __lastTouchLeft: null,
        __lastTouchTop: null,
        __lastTouchMove: null,
        __positions: null,
        __minDecelerationScrollLeft: null,
        __minDecelerationScrollTop: null,
        __maxDecelerationScrollLeft: null,
        __maxDecelerationScrollTop: null,
        __decelerationVelocityX: null,
        __decelerationVelocityY: null,
        __transformProperty: null,
        __perspectiveProperty: null,
        __indicatorX: null,
        __indicatorY: null,
        __scrollbarFadeTimeout: null,
        __didWaitForSize: null,
        __sizerTimeout: null,
        __initEventHandlers: function() {
          var self = this;
          var container = self.__container;
          self.scrollChildIntoView = function(e) {
            var scrollBottomOffsetToTop;
            if (!self.isScrolledIntoView) {
              if ((ionic.Platform.isIOS() || ionic.Platform.isFullScreen)) {
                scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
                var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;
                var keyboardOffset = Math.max(0, e.detail.keyboardHeight - scrollBottomOffsetToBottom);
                container.style.height = (container.clientHeight - keyboardOffset) + "px";
                container.style.overflow = "visible";
                self.resize();
              }
              self.isScrolledIntoView = true;
            }
            if (e.detail.isElementUnderKeyboard) {
              var delay;
              if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                if (ionic.Platform.version() < 4.4) {
                  delay = 500;
                } else {
                  delay = 350;
                }
              } else {
                delay = 80;
              }
              ionic.scroll.isScrolling = true;
              setTimeout(function() {
                var scrollMidpointOffset = container.clientHeight * 0.5;
                scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
                var elementTopOffsetToScrollBottom = e.detail.elementTop - scrollBottomOffsetToTop;
                var scrollTop = elementTopOffsetToScrollBottom + scrollMidpointOffset;
                if (scrollTop > 0) {
                  ionic.tap.cloneFocusedInput(container, self);
                  self.scrollBy(0, scrollTop, true);
                  self.onScroll();
                }
              }, delay);
            }
            e.stopPropagation();
          };
          self.resetScrollView = function(e) {
            if (self.isScrolledIntoView) {
              self.isScrolledIntoView = false;
              container.style.height = "";
              container.style.overflow = "";
              self.resize();
              ionic.scroll.isScrolling = false;
            }
          };
          container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);
          container.addEventListener('resetScrollView', self.resetScrollView);
          function getEventTouches(e) {
            return e.touches && e.touches.length ? e.touches : [{
              pageX: e.pageX,
              pageY: e.pageY
            }];
          }
          self.touchStart = function(e) {
            self.startCoordinates = ionic.tap.pointerCoord(e);
            if (ionic.tap.ignoreScrollStart(e)) {
              return;
            }
            self.__isDown = true;
            if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
              self.__hasStarted = false;
              return;
            }
            self.__isSelectable = true;
            self.__enableScrollY = true;
            self.__hasStarted = true;
            self.doTouchStart(getEventTouches(e), e.timeStamp);
            e.preventDefault();
          };
          self.touchMove = function(e) {
            if (!self.__isDown || (!self.__isDown && e.defaultPrevented) || (e.target.tagName === 'TEXTAREA' && e.target.parentElement.querySelector(':focus'))) {
              return;
            }
            if (!self.__hasStarted && (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT')) {
              self.__hasStarted = true;
              self.doTouchStart(getEventTouches(e), e.timeStamp);
              e.preventDefault();
              return;
            }
            if (self.startCoordinates) {
              var currentCoordinates = ionic.tap.pointerCoord(e);
              if (self.__isSelectable && ionic.tap.isTextInput(e.target) && Math.abs(self.startCoordinates.x - currentCoordinates.x) > 20) {
                self.__enableScrollY = false;
                self.__isSelectable = true;
              }
              if (self.__enableScrollY && Math.abs(self.startCoordinates.y - currentCoordinates.y) > 10) {
                self.__isSelectable = false;
                ionic.tap.cloneFocusedInput(container, self);
              }
            }
            self.doTouchMove(getEventTouches(e), e.timeStamp, e.scale);
            self.__isDown = true;
          };
          self.touchMoveBubble = function(e) {
            if (self.__isDown && self.options.preventDefault) {
              e.preventDefault();
            }
          };
          self.touchEnd = function(e) {
            if (!self.__isDown)
              return;
            self.doTouchEnd(e.timeStamp);
            self.__isDown = false;
            self.__hasStarted = false;
            self.__isSelectable = true;
            self.__enableScrollY = true;
            if (!self.__isDragging && !self.__isDecelerating && !self.__isAnimating) {
              ionic.tap.removeClonedInputs(container, self);
            }
          };
          if ('ontouchstart' in window) {
            container.addEventListener("touchstart", self.touchStart, false);
            if (self.options.preventDefault)
              container.addEventListener("touchmove", self.touchMoveBubble, false);
            document.addEventListener("touchmove", self.touchMove, false);
            document.addEventListener("touchend", self.touchEnd, false);
            document.addEventListener("touchcancel", self.touchEnd, false);
          } else if (window.navigator.pointerEnabled) {
            container.addEventListener("pointerdown", self.touchStart, false);
            if (self.options.preventDefault)
              container.addEventListener("pointermove", self.touchMoveBubble, false);
            document.addEventListener("pointermove", self.touchMove, false);
            document.addEventListener("pointerup", self.touchEnd, false);
            document.addEventListener("pointercancel", self.touchEnd, false);
          } else if (window.navigator.msPointerEnabled) {
            container.addEventListener("MSPointerDown", self.touchStart, false);
            if (self.options.preventDefault)
              container.addEventListener("MSPointerMove", self.touchMoveBubble, false);
            document.addEventListener("MSPointerMove", self.touchMove, false);
            document.addEventListener("MSPointerUp", self.touchEnd, false);
            document.addEventListener("MSPointerCancel", self.touchEnd, false);
          } else {
            var mousedown = false;
            self.mouseDown = function(e) {
              if (ionic.tap.ignoreScrollStart(e) || e.target.tagName === 'SELECT') {
                return;
              }
              self.doTouchStart(getEventTouches(e), e.timeStamp);
              if (!ionic.tap.isTextInput(e.target)) {
                e.preventDefault();
              }
              mousedown = true;
            };
            self.mouseMove = function(e) {
              if (!mousedown || (!mousedown && e.defaultPrevented)) {
                return;
              }
              self.doTouchMove(getEventTouches(e), e.timeStamp);
              mousedown = true;
            };
            self.mouseMoveBubble = function(e) {
              if (mousedown && self.options.preventDefault) {
                e.preventDefault();
              }
            };
            self.mouseUp = function(e) {
              if (!mousedown) {
                return;
              }
              self.doTouchEnd(e.timeStamp);
              mousedown = false;
            };
            self.mouseWheel = ionic.animationFrameThrottle(function(e) {
              var scrollParent = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'ionic-scroll');
              if (scrollParent === self.__container) {
                self.hintResize();
                self.scrollBy((e.wheelDeltaX || e.deltaX || 0) / self.options.wheelDampen, (-e.wheelDeltaY || e.deltaY || 0) / self.options.wheelDampen);
                self.__fadeScrollbars('in');
                clearTimeout(self.__wheelHideBarTimeout);
                self.__wheelHideBarTimeout = setTimeout(function() {
                  self.__fadeScrollbars('out');
                }, 100);
              }
            });
            container.addEventListener("mousedown", self.mouseDown, false);
            if (self.options.preventDefault)
              container.addEventListener("mousemove", self.mouseMoveBubble, false);
            document.addEventListener("mousemove", self.mouseMove, false);
            document.addEventListener("mouseup", self.mouseUp, false);
            document.addEventListener('mousewheel', self.mouseWheel, false);
            document.addEventListener('wheel', self.mouseWheel, false);
          }
        },
        __cleanup: function() {
          var self = this;
          var container = self.__container;
          container.removeEventListener('touchstart', self.touchStart);
          container.removeEventListener('touchmove', self.touchMoveBubble);
          document.removeEventListener('touchmove', self.touchMove);
          document.removeEventListener('touchend', self.touchEnd);
          document.removeEventListener('touchcancel', self.touchCancel);
          container.removeEventListener("pointerdown", self.touchStart);
          container.removeEventListener("pointermove", self.touchMoveBubble);
          document.removeEventListener("pointermove", self.touchMove);
          document.removeEventListener("pointerup", self.touchEnd);
          document.removeEventListener("pointercancel", self.touchEnd);
          container.removeEventListener("MSPointerDown", self.touchStart);
          container.removeEventListener("MSPointerMove", self.touchMoveBubble);
          document.removeEventListener("MSPointerMove", self.touchMove);
          document.removeEventListener("MSPointerUp", self.touchEnd);
          document.removeEventListener("MSPointerCancel", self.touchEnd);
          container.removeEventListener("mousedown", self.mouseDown);
          container.removeEventListener("mousemove", self.mouseMoveBubble);
          document.removeEventListener("mousemove", self.mouseMove);
          document.removeEventListener("mouseup", self.mouseUp);
          document.removeEventListener('mousewheel', self.mouseWheel);
          document.removeEventListener('wheel', self.mouseWheel);
          container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
          container.removeEventListener('resetScrollView', self.resetScrollView);
          ionic.tap.removeClonedInputs(container, self);
          delete self.__container;
          delete self.__content;
          delete self.__indicatorX;
          delete self.__indicatorY;
          delete self.options.el;
          self.__callback = self.scrollChildIntoView = self.resetScrollView = angular.noop;
          self.mouseMove = self.mouseDown = self.mouseUp = self.mouseWheel = self.touchStart = self.touchMove = self.touchEnd = self.touchCancel = angular.noop;
          self.resize = self.scrollTo = self.zoomTo = self.__scrollingComplete = angular.noop;
          container = null;
        },
        __createScrollbar: function(direction) {
          var bar = document.createElement('div'),
              indicator = document.createElement('div');
          indicator.className = 'scroll-bar-indicator scroll-bar-fade-out';
          if (direction == 'h') {
            bar.className = 'scroll-bar scroll-bar-h';
          } else {
            bar.className = 'scroll-bar scroll-bar-v';
          }
          bar.appendChild(indicator);
          return bar;
        },
        __createScrollbars: function() {
          var self = this;
          var indicatorX,
              indicatorY;
          if (self.options.scrollingX) {
            indicatorX = {
              el: self.__createScrollbar('h'),
              sizeRatio: 1
            };
            indicatorX.indicator = indicatorX.el.children[0];
            if (self.options.scrollbarX) {
              self.__container.appendChild(indicatorX.el);
            }
            self.__indicatorX = indicatorX;
          }
          if (self.options.scrollingY) {
            indicatorY = {
              el: self.__createScrollbar('v'),
              sizeRatio: 1
            };
            indicatorY.indicator = indicatorY.el.children[0];
            if (self.options.scrollbarY) {
              self.__container.appendChild(indicatorY.el);
            }
            self.__indicatorY = indicatorY;
          }
        },
        __resizeScrollbars: function() {
          var self = this;
          if (self.__indicatorX) {
            var width = Math.max(Math.round(self.__clientWidth * self.__clientWidth / (self.__contentWidth)), 20);
            if (width > self.__contentWidth) {
              width = 0;
            }
            if (width !== self.__indicatorX.size) {
              ionic.requestAnimationFrame(function() {
                self.__indicatorX.indicator.style.width = width + 'px';
              });
            }
            self.__indicatorX.size = width;
            self.__indicatorX.minScale = self.options.minScrollbarSizeX / width;
            self.__indicatorX.maxPos = self.__clientWidth - width;
            self.__indicatorX.sizeRatio = self.__maxScrollLeft ? self.__indicatorX.maxPos / self.__maxScrollLeft : 1;
          }
          if (self.__indicatorY) {
            var height = Math.max(Math.round(self.__clientHeight * self.__clientHeight / (self.__contentHeight)), 20);
            if (height > self.__contentHeight) {
              height = 0;
            }
            if (height !== self.__indicatorY.size) {
              ionic.requestAnimationFrame(function() {
                self.__indicatorY && (self.__indicatorY.indicator.style.height = height + 'px');
              });
            }
            self.__indicatorY.size = height;
            self.__indicatorY.minScale = self.options.minScrollbarSizeY / height;
            self.__indicatorY.maxPos = self.__clientHeight - height;
            self.__indicatorY.sizeRatio = self.__maxScrollTop ? self.__indicatorY.maxPos / self.__maxScrollTop : 1;
          }
        },
        __repositionScrollbars: function() {
          var self = this,
              width,
              heightScale,
              widthDiff,
              heightDiff,
              x,
              y,
              xstop = 0,
              ystop = 0;
          if (self.__indicatorX) {
            if (self.__indicatorY)
              xstop = 10;
            x = Math.round(self.__indicatorX.sizeRatio * self.__scrollLeft) || 0, widthDiff = self.__scrollLeft - (self.__maxScrollLeft - xstop);
            if (self.__scrollLeft < 0) {
              widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - Math.abs(self.__scrollLeft)) / self.__indicatorX.size);
              x = 0;
              self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'left center';
            } else if (widthDiff > 0) {
              widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - widthDiff) / self.__indicatorX.size);
              x = self.__indicatorX.maxPos - xstop;
              self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'right center';
            } else {
              x = Math.min(self.__maxScrollLeft, Math.max(0, x));
              widthScale = 1;
            }
            var translate3dX = 'translate3d(' + x + 'px, 0, 0) scaleX(' + widthScale + ')';
            if (self.__indicatorX.transformProp !== translate3dX) {
              self.__indicatorX.indicator.style[self.__transformProperty] = translate3dX;
              self.__indicatorX.transformProp = translate3dX;
            }
          }
          if (self.__indicatorY) {
            y = Math.round(self.__indicatorY.sizeRatio * self.__scrollTop) || 0;
            if (self.__indicatorX)
              ystop = 10;
            heightDiff = self.__scrollTop - (self.__maxScrollTop - ystop);
            if (self.__scrollTop < 0) {
              heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - Math.abs(self.__scrollTop)) / self.__indicatorY.size);
              y = 0;
              if (self.__indicatorY.originProp !== 'center top') {
                self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center top';
                self.__indicatorY.originProp = 'center top';
              }
            } else if (heightDiff > 0) {
              heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - heightDiff) / self.__indicatorY.size);
              y = self.__indicatorY.maxPos - ystop;
              if (self.__indicatorY.originProp !== 'center bottom') {
                self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center bottom';
                self.__indicatorY.originProp = 'center bottom';
              }
            } else {
              y = Math.min(self.__maxScrollTop, Math.max(0, y));
              heightScale = 1;
            }
            var translate3dY = 'translate3d(0,' + y + 'px, 0) scaleY(' + heightScale + ')';
            if (self.__indicatorY.transformProp !== translate3dY) {
              self.__indicatorY.indicator.style[self.__transformProperty] = translate3dY;
              self.__indicatorY.transformProp = translate3dY;
            }
          }
        },
        __fadeScrollbars: function(direction, delay) {
          var self = this;
          if (!self.options.scrollbarsFade) {
            return;
          }
          var className = 'scroll-bar-fade-out';
          if (self.options.scrollbarsFade === true) {
            clearTimeout(self.__scrollbarFadeTimeout);
            if (direction == 'in') {
              if (self.__indicatorX) {
                self.__indicatorX.indicator.classList.remove(className);
              }
              if (self.__indicatorY) {
                self.__indicatorY.indicator.classList.remove(className);
              }
            } else {
              self.__scrollbarFadeTimeout = setTimeout(function() {
                if (self.__indicatorX) {
                  self.__indicatorX.indicator.classList.add(className);
                }
                if (self.__indicatorY) {
                  self.__indicatorY.indicator.classList.add(className);
                }
              }, delay || self.options.scrollbarFadeDelay);
            }
          }
        },
        __scrollingComplete: function() {
          this.options.scrollingComplete();
          ionic.tap.removeClonedInputs(this.__container, this);
          this.__fadeScrollbars('out');
        },
        resize: function() {
          var self = this;
          if (!self.__container || !self.options)
            return;
          self.setDimensions(self.__container.clientWidth, self.__container.clientHeight, self.options.getContentWidth(), self.options.getContentHeight());
        },
        getRenderFn: function() {
          var self = this;
          var content = self.__content;
          var docStyle = document.documentElement.style;
          var engine;
          if ('MozAppearance' in docStyle) {
            engine = 'gecko';
          } else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit';
          } else if (typeof navigator.cpuClass === 'string') {
            engine = 'trident';
          }
          var vendorPrefix = {
            trident: 'ms',
            gecko: 'Moz',
            webkit: 'Webkit',
            presto: 'O'
          }[engine];
          var helperElem = document.createElement("div");
          var undef;
          var perspectiveProperty = vendorPrefix + "Perspective";
          var transformProperty = vendorPrefix + "Transform";
          var transformOriginProperty = vendorPrefix + 'TransformOrigin';
          self.__perspectiveProperty = transformProperty;
          self.__transformProperty = transformProperty;
          self.__transformOriginProperty = transformOriginProperty;
          if (helperElem.style[perspectiveProperty] !== undef) {
            return function(left, top, zoom, wasResize) {
              var translate3d = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
              if (translate3d !== self.contentTransform) {
                content.style[transformProperty] = translate3d;
                self.contentTransform = translate3d;
              }
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          } else if (helperElem.style[transformProperty] !== undef) {
            return function(left, top, zoom, wasResize) {
              content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          } else {
            return function(left, top, zoom, wasResize) {
              content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
              content.style.marginTop = top ? (-top / zoom) + 'px' : '';
              content.style.zoom = zoom || '';
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          }
        },
        setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {
          var self = this;
          if (!clientWidth && !clientHeight && !contentWidth && !contentHeight) {
            return;
          }
          if (clientWidth === +clientWidth) {
            self.__clientWidth = clientWidth;
          }
          if (clientHeight === +clientHeight) {
            self.__clientHeight = clientHeight;
          }
          if (contentWidth === +contentWidth) {
            self.__contentWidth = contentWidth;
          }
          if (contentHeight === +contentHeight) {
            self.__contentHeight = contentHeight;
          }
          self.__computeScrollMax();
          self.__resizeScrollbars();
          self.scrollTo(self.__scrollLeft, self.__scrollTop, true, null, true);
        },
        setPosition: function(left, top) {
          this.__clientLeft = left || 0;
          this.__clientTop = top || 0;
        },
        setSnapSize: function(width, height) {
          this.__snapWidth = width;
          this.__snapHeight = height;
        },
        activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback, showCallback, hideCallback, tailCallback) {
          var self = this;
          self.__refreshHeight = height;
          self.__refreshActivate = function() {
            ionic.requestAnimationFrame(activateCallback);
          };
          self.__refreshDeactivate = function() {
            ionic.requestAnimationFrame(deactivateCallback);
          };
          self.__refreshStart = function() {
            ionic.requestAnimationFrame(startCallback);
          };
          self.__refreshShow = function() {
            ionic.requestAnimationFrame(showCallback);
          };
          self.__refreshHide = function() {
            ionic.requestAnimationFrame(hideCallback);
          };
          self.__refreshTail = function() {
            ionic.requestAnimationFrame(tailCallback);
          };
          self.__refreshTailTime = 100;
          self.__minSpinTime = 600;
        },
        triggerPullToRefresh: function() {
          this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);
          var d = new Date();
          this.refreshStartTime = d.getTime();
          if (this.__refreshStart) {
            this.__refreshStart();
          }
        },
        finishPullToRefresh: function() {
          var self = this;
          var d = new Date();
          var delay = 0;
          if (self.refreshStartTime + self.__minSpinTime > d.getTime()) {
            delay = self.refreshStartTime + self.__minSpinTime - d.getTime();
          }
          setTimeout(function() {
            if (self.__refreshTail) {
              self.__refreshTail();
            }
            setTimeout(function() {
              self.__refreshActive = false;
              if (self.__refreshDeactivate) {
                self.__refreshDeactivate();
              }
              if (self.__refreshHide) {
                self.__refreshHide();
              }
              self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
            }, self.__refreshTailTime);
          }, delay);
        },
        getValues: function() {
          return {
            left: this.__scrollLeft,
            top: this.__scrollTop,
            zoom: this.__zoomLevel
          };
        },
        getScrollMax: function() {
          return {
            left: this.__maxScrollLeft,
            top: this.__maxScrollTop
          };
        },
        zoomTo: function(level, animate, originLeft, originTop) {
          var self = this;
          if (!self.options.zooming) {
            throw new Error("Zooming is not enabled!");
          }
          if (self.__isDecelerating) {
            zyngaCore.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
          }
          var oldLevel = self.__zoomLevel;
          if (originLeft == null) {
            originLeft = self.__clientWidth / 2;
          }
          if (originTop == null) {
            originTop = self.__clientHeight / 2;
          }
          level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
          self.__computeScrollMax(level);
          var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
          var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;
          if (left > self.__maxScrollLeft) {
            left = self.__maxScrollLeft;
          } else if (left < 0) {
            left = 0;
          }
          if (top > self.__maxScrollTop) {
            top = self.__maxScrollTop;
          } else if (top < 0) {
            top = 0;
          }
          self.__publish(left, top, level, animate);
        },
        zoomBy: function(factor, animate, originLeft, originTop) {
          this.zoomTo(this.__zoomLevel * factor, animate, originLeft, originTop);
        },
        scrollTo: function(left, top, animate, zoom, wasResize) {
          var self = this;
          if (self.__isDecelerating) {
            zyngaCore.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
          }
          if (zoom != null && zoom !== self.__zoomLevel) {
            if (!self.options.zooming) {
              throw new Error("Zooming is not enabled!");
            }
            left *= zoom;
            top *= zoom;
            self.__computeScrollMax(zoom);
          } else {
            zoom = self.__zoomLevel;
          }
          if (!self.options.scrollingX) {
            left = self.__scrollLeft;
          } else {
            if (self.options.paging) {
              left = Math.round(left / self.__clientWidth) * self.__clientWidth;
            } else if (self.options.snapping) {
              left = Math.round(left / self.__snapWidth) * self.__snapWidth;
            }
          }
          if (!self.options.scrollingY) {
            top = self.__scrollTop;
          } else {
            if (self.options.paging) {
              top = Math.round(top / self.__clientHeight) * self.__clientHeight;
            } else if (self.options.snapping) {
              top = Math.round(top / self.__snapHeight) * self.__snapHeight;
            }
          }
          left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
          top = Math.max(Math.min(self.__maxScrollTop, top), 0);
          if (left === self.__scrollLeft && top === self.__scrollTop) {
            animate = false;
          }
          self.__publish(left, top, zoom, animate, wasResize);
        },
        scrollBy: function(left, top, animate) {
          var self = this;
          var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
          var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;
          self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
        },
        doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {
          var change = wheelDelta > 0 ? 0.97 : 1.03;
          return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
        },
        doTouchStart: function(touches, timeStamp) {
          var self = this;
          self.hintResize();
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== "number") {
            timeStamp = Date.now();
          }
          self.__interruptedAnimation = true;
          if (self.__isDecelerating) {
            zyngaCore.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
            self.__interruptedAnimation = true;
          }
          if (self.__isAnimating) {
            zyngaCore.effect.Animate.stop(self.__isAnimating);
            self.__isAnimating = false;
            self.__interruptedAnimation = true;
          }
          var currentTouchLeft,
              currentTouchTop;
          var isSingleTouch = touches.length === 1;
          if (isSingleTouch) {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
          } else {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
          }
          self.__initialTouchLeft = currentTouchLeft;
          self.__initialTouchTop = currentTouchTop;
          self.__initialTouches = touches;
          self.__zoomLevelStart = self.__zoomLevel;
          self.__lastTouchLeft = currentTouchLeft;
          self.__lastTouchTop = currentTouchTop;
          self.__lastTouchMove = timeStamp;
          self.__lastScale = 1;
          self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
          self.__enableScrollY = !isSingleTouch && self.options.scrollingY;
          self.__isTracking = true;
          self.__didDecelerationComplete = false;
          self.__isDragging = !isSingleTouch;
          self.__isSingleTouch = isSingleTouch;
          self.__positions = [];
        },
        doTouchMove: function(touches, timeStamp, scale) {
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== "number") {
            timeStamp = Date.now();
          }
          var self = this;
          if (!self.__isTracking) {
            return;
          }
          var currentTouchLeft,
              currentTouchTop;
          if (touches.length === 2) {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            if (!scale && self.options.zooming) {
              scale = self.__getScale(self.__initialTouches, touches);
            }
          } else {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
          }
          var positions = self.__positions;
          if (self.__isDragging) {
            var moveX = currentTouchLeft - self.__lastTouchLeft;
            var moveY = currentTouchTop - self.__lastTouchTop;
            var scrollLeft = self.__scrollLeft;
            var scrollTop = self.__scrollTop;
            var level = self.__zoomLevel;
            if (scale != null && self.options.zooming) {
              var oldLevel = level;
              level = level / self.__lastScale * scale;
              level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
              if (oldLevel !== level) {
                var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
                var currentTouchTopRel = currentTouchTop - self.__clientTop;
                scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
                scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;
                self.__computeScrollMax(level);
              }
            }
            if (self.__enableScrollX) {
              scrollLeft -= moveX * self.options.speedMultiplier;
              var maxScrollLeft = self.__maxScrollLeft;
              if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                if (self.options.bouncing) {
                  scrollLeft += (moveX / 2 * self.options.speedMultiplier);
                } else if (scrollLeft > maxScrollLeft) {
                  scrollLeft = maxScrollLeft;
                } else {
                  scrollLeft = 0;
                }
              }
            }
            if (self.__enableScrollY) {
              scrollTop -= moveY * self.options.speedMultiplier;
              var maxScrollTop = self.__maxScrollTop;
              if (scrollTop > maxScrollTop || scrollTop < 0) {
                if (self.options.bouncing || (self.__refreshHeight && scrollTop < 0)) {
                  scrollTop += (moveY / 2 * self.options.speedMultiplier);
                  if (!self.__enableScrollX && self.__refreshHeight != null) {
                    if (scrollTop < 0) {
                      self.__refreshHidden = false;
                      self.__refreshShow();
                    } else {
                      self.__refreshHide();
                      self.__refreshHidden = true;
                    }
                    if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
                      self.__refreshActive = true;
                      if (self.__refreshActivate) {
                        self.__refreshActivate();
                      }
                    } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
                      self.__refreshActive = false;
                      if (self.__refreshDeactivate) {
                        self.__refreshDeactivate();
                      }
                    }
                  }
                } else if (scrollTop > maxScrollTop) {
                  scrollTop = maxScrollTop;
                } else {
                  scrollTop = 0;
                }
              } else if (self.__refreshHeight && !self.__refreshHidden) {
                self.__refreshHide();
                self.__refreshHidden = true;
              }
            }
            if (positions.length > 60) {
              positions.splice(0, 30);
            }
            positions.push(scrollLeft, scrollTop, timeStamp);
            self.__publish(scrollLeft, scrollTop, level);
          } else {
            var minimumTrackingForScroll = self.options.locking ? 3 : 0;
            var minimumTrackingForDrag = 5;
            var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
            var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
            self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
            self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
            positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);
            self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
            if (self.__isDragging) {
              self.__interruptedAnimation = false;
              self.__fadeScrollbars('in');
            }
          }
          self.__lastTouchLeft = currentTouchLeft;
          self.__lastTouchTop = currentTouchTop;
          self.__lastTouchMove = timeStamp;
          self.__lastScale = scale;
        },
        doTouchEnd: function(timeStamp) {
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== "number") {
            timeStamp = Date.now();
          }
          var self = this;
          if (!self.__isTracking) {
            return;
          }
          self.__isTracking = false;
          if (self.__isDragging) {
            self.__isDragging = false;
            if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {
              var positions = self.__positions;
              var endPos = positions.length - 1;
              var startPos = endPos;
              for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
                startPos = i;
              }
              if (startPos !== endPos) {
                var timeOffset = positions[endPos] - positions[startPos];
                var movedLeft = self.__scrollLeft - positions[startPos - 2];
                var movedTop = self.__scrollTop - positions[startPos - 1];
                self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
                var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;
                if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                  if (!self.__refreshActive) {
                    self.__startDeceleration(timeStamp);
                  }
                }
              } else {
                self.__scrollingComplete();
              }
            } else if ((timeStamp - self.__lastTouchMove) > 100) {
              self.__scrollingComplete();
            }
          }
          if (!self.__isDecelerating) {
            if (self.__refreshActive && self.__refreshStart) {
              self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);
              var d = new Date();
              self.refreshStartTime = d.getTime();
              if (self.__refreshStart) {
                self.__refreshStart();
              }
              if (!ionic.Platform.isAndroid())
                self.__startDeceleration();
            } else {
              if (self.__interruptedAnimation || self.__isDragging) {
                self.__scrollingComplete();
              }
              self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
              if (self.__refreshActive) {
                self.__refreshActive = false;
                if (self.__refreshDeactivate) {
                  self.__refreshDeactivate();
                }
              }
            }
          }
          self.__positions.length = 0;
        },
        __publish: function(left, top, zoom, animate, wasResize) {
          var self = this;
          var wasAnimating = self.__isAnimating;
          if (wasAnimating) {
            zyngaCore.effect.Animate.stop(wasAnimating);
            self.__isAnimating = false;
          }
          if (animate && self.options.animating) {
            self.__scheduledLeft = left;
            self.__scheduledTop = top;
            self.__scheduledZoom = zoom;
            var oldLeft = self.__scrollLeft;
            var oldTop = self.__scrollTop;
            var oldZoom = self.__zoomLevel;
            var diffLeft = left - oldLeft;
            var diffTop = top - oldTop;
            var diffZoom = zoom - oldZoom;
            var step = function(percent, now, render) {
              if (render) {
                self.__scrollLeft = oldLeft + (diffLeft * percent);
                self.__scrollTop = oldTop + (diffTop * percent);
                self.__zoomLevel = oldZoom + (diffZoom * percent);
                if (self.__callback) {
                  self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, wasResize);
                }
              }
            };
            var verify = function(id) {
              return self.__isAnimating === id;
            };
            var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
              if (animationId === self.__isAnimating) {
                self.__isAnimating = false;
              }
              if (self.__didDecelerationComplete || wasFinished) {
                self.__scrollingComplete();
              }
              if (self.options.zooming) {
                self.__computeScrollMax();
              }
            };
            self.__isAnimating = zyngaCore.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
          } else {
            self.__scheduledLeft = self.__scrollLeft = left;
            self.__scheduledTop = self.__scrollTop = top;
            self.__scheduledZoom = self.__zoomLevel = zoom;
            if (self.__callback) {
              self.__callback(left, top, zoom, wasResize);
            }
            if (self.options.zooming) {
              self.__computeScrollMax();
            }
          }
        },
        __computeScrollMax: function(zoomLevel) {
          var self = this;
          if (zoomLevel == null) {
            zoomLevel = self.__zoomLevel;
          }
          self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
          self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);
          if (!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
            self.__didWaitForSize = true;
            self.__waitForSize();
          }
        },
        __waitForSize: function() {
          var self = this;
          clearTimeout(self.__sizerTimeout);
          var sizer = function() {
            self.resize();
          };
          sizer();
          self.__sizerTimeout = setTimeout(sizer, 1000);
        },
        __startDeceleration: function(timeStamp) {
          var self = this;
          if (self.options.paging) {
            var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
            var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
            var clientWidth = self.__clientWidth;
            var clientHeight = self.__clientHeight;
            self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
            self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
            self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
            self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
          } else {
            self.__minDecelerationScrollLeft = 0;
            self.__minDecelerationScrollTop = 0;
            self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
            self.__maxDecelerationScrollTop = self.__maxScrollTop;
            if (self.__refreshActive)
              self.__minDecelerationScrollTop = self.__refreshHeight * -1;
          }
          var step = function(percent, now, render) {
            self.__stepThroughDeceleration(render);
          };
          self.__minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;
          var verify = function() {
            var shouldContinue = Math.abs(self.__decelerationVelocityX) >= self.__minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= self.__minVelocityToKeepDecelerating;
            if (!shouldContinue) {
              self.__didDecelerationComplete = true;
              if (self.options.bouncing && !self.__refreshActive) {
                self.scrollTo(Math.min(Math.max(self.__scrollLeft, 0), self.__maxScrollLeft), Math.min(Math.max(self.__scrollTop, 0), self.__maxScrollTop), self.__refreshActive);
              }
            }
            return shouldContinue;
          };
          var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
            self.__isDecelerating = false;
            if (self.__didDecelerationComplete) {
              self.__scrollingComplete();
            }
            if (self.options.paging) {
              self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
            }
          };
          self.__isDecelerating = zyngaCore.effect.Animate.start(step, verify, completed);
        },
        __stepThroughDeceleration: function(render) {
          var self = this;
          var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
          var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
          if (!self.options.bouncing) {
            var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
            if (scrollLeftFixed !== scrollLeft) {
              scrollLeft = scrollLeftFixed;
              self.__decelerationVelocityX = 0;
            }
            var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
            if (scrollTopFixed !== scrollTop) {
              scrollTop = scrollTopFixed;
              self.__decelerationVelocityY = 0;
            }
          }
          if (render) {
            self.__publish(scrollLeft, scrollTop, self.__zoomLevel);
          } else {
            self.__scrollLeft = scrollLeft;
            self.__scrollTop = scrollTop;
          }
          if (!self.options.paging) {
            var frictionFactor = self.options.deceleration;
            self.__decelerationVelocityX *= frictionFactor;
            self.__decelerationVelocityY *= frictionFactor;
          }
          if (self.options.bouncing) {
            var scrollOutsideX = 0;
            var scrollOutsideY = 0;
            var penetrationDeceleration = self.options.penetrationDeceleration;
            var penetrationAcceleration = self.options.penetrationAcceleration;
            if (scrollLeft < self.__minDecelerationScrollLeft) {
              scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
            } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
              scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
            }
            if (scrollTop < self.__minDecelerationScrollTop) {
              scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
            } else if (scrollTop > self.__maxDecelerationScrollTop) {
              scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
            }
            if (scrollOutsideX !== 0) {
              var isHeadingOutwardsX = scrollOutsideX * self.__decelerationVelocityX <= self.__minDecelerationScrollLeft;
              if (isHeadingOutwardsX) {
                self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
              }
              var isStoppedX = Math.abs(self.__decelerationVelocityX) <= self.__minVelocityToKeepDecelerating;
              if (!isHeadingOutwardsX || isStoppedX) {
                self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
              }
            }
            if (scrollOutsideY !== 0) {
              var isHeadingOutwardsY = scrollOutsideY * self.__decelerationVelocityY <= self.__minDecelerationScrollTop;
              if (isHeadingOutwardsY) {
                self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
              }
              var isStoppedY = Math.abs(self.__decelerationVelocityY) <= self.__minVelocityToKeepDecelerating;
              if (!isHeadingOutwardsY || isStoppedY) {
                self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
              }
            }
          }
        },
        __getDistance: function getDistance(touch1, touch2) {
          var x = touch2.pageX - touch1.pageX,
              y = touch2.pageY - touch1.pageY;
          return Math.sqrt((x * x) + (y * y));
        },
        __getScale: function getScale(start, end) {
          if (start.length >= 2 && end.length >= 2) {
            return this.__getDistance(end[0], end[1]) / this.__getDistance(start[0], start[1]);
          }
          return 1;
        }
      });
      ionic.scroll = {
        isScrolling: false,
        lastTop: 0
      };
    })(ionic);
    (function(ionic) {
      'use strict';
      var ITEM_CLASS = 'item';
      var ITEM_CONTENT_CLASS = 'item-content';
      var ITEM_SLIDING_CLASS = 'item-sliding';
      var ITEM_OPTIONS_CLASS = 'item-options';
      var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
      var ITEM_REORDERING_CLASS = 'item-reordering';
      var ITEM_REORDER_BTN_CLASS = 'item-reorder';
      var DragOp = function() {};
      DragOp.prototype = {
        start: function(e) {},
        drag: function(e) {},
        end: function(e) {},
        isSameItem: function(item) {
          return false;
        }
      };
      var SlideDrag = function(opts) {
        this.dragThresholdX = opts.dragThresholdX || 10;
        this.el = opts.el;
        this.canSwipe = opts.canSwipe;
      };
      SlideDrag.prototype = new DragOp();
      SlideDrag.prototype.start = function(e) {
        var content,
            buttons,
            offsetX,
            buttonsWidth;
        if (!this.canSwipe()) {
          return;
        }
        if (e.target.classList.contains(ITEM_CONTENT_CLASS)) {
          content = e.target;
        } else if (e.target.classList.contains(ITEM_CLASS)) {
          content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
        } else {
          content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
        }
        if (!content) {
          return;
        }
        content.classList.remove(ITEM_SLIDING_CLASS);
        offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;
        buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
        if (!buttons) {
          return;
        }
        buttons.classList.remove('invisible');
        buttonsWidth = buttons.offsetWidth;
        this._currentDrag = {
          buttons: buttons,
          buttonsWidth: buttonsWidth,
          content: content,
          startOffsetX: offsetX
        };
      };
      SlideDrag.prototype.isSameItem = function(op) {
        if (op._lastDrag && this._currentDrag) {
          return this._currentDrag.content == op._lastDrag.content;
        }
        return false;
      };
      SlideDrag.prototype.clean = function(e) {
        var lastDrag = this._lastDrag;
        if (!lastDrag || !lastDrag.content)
          return;
        lastDrag.content.style[ionic.CSS.TRANSITION] = '';
        lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
        ionic.requestAnimationFrame(function() {
          setTimeout(function() {
            lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
          }, 250);
        });
      };
      SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
        var buttonsWidth;
        if (!this._currentDrag) {
          return;
        }
        if (!this._isDragging && ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) || (Math.abs(this._currentDrag.startOffsetX) > 0))) {
          this._isDragging = true;
        }
        if (this._isDragging) {
          buttonsWidth = this._currentDrag.buttonsWidth;
          var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);
          if (newX < -buttonsWidth) {
            newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
          }
          this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
          this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
        }
      });
      SlideDrag.prototype.end = function(e, doneCallback) {
        var _this = this;
        if (!this._currentDrag) {
          doneCallback && doneCallback();
          return;
        }
        var restingPoint = -this._currentDrag.buttonsWidth;
        if (e.gesture.deltaX > -(this._currentDrag.buttonsWidth / 2)) {
          if (e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
            restingPoint = 0;
          } else if (e.gesture.direction == "right") {
            restingPoint = 0;
          }
        }
        ionic.requestAnimationFrame(function() {
          if (restingPoint === 0) {
            _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
            var buttons = _this._currentDrag.buttons;
            setTimeout(function() {
              buttons && buttons.classList.add('invisible');
            }, 250);
          } else {
            _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px, 0, 0)';
          }
          _this._currentDrag.content.style[ionic.CSS.TRANSITION] = '';
          if (!_this._lastDrag) {
            _this._lastDrag = {};
          }
          angular.extend(_this._lastDrag, _this._currentDrag);
          if (_this._currentDrag) {
            _this._currentDrag.buttons = null;
            _this._currentDrag.content = null;
          }
          _this._currentDrag = null;
          doneCallback && doneCallback();
        });
      };
      var ReorderDrag = function(opts) {
        this.dragThresholdY = opts.dragThresholdY || 0;
        this.onReorder = opts.onReorder;
        this.listEl = opts.listEl;
        this.el = opts.el;
        this.scrollEl = opts.scrollEl;
        this.scrollView = opts.scrollView;
        this.listElTrueTop = 0;
        if (this.listEl.offsetParent) {
          var obj = this.listEl;
          do {
            this.listElTrueTop += obj.offsetTop;
            obj = obj.offsetParent;
          } while (obj);
        }
      };
      ReorderDrag.prototype = new DragOp();
      ReorderDrag.prototype._moveElement = function(e) {
        var y = e.gesture.center.pageY + this.scrollView.getValues().top - (this._currentDrag.elementHeight / 2) - this.listElTrueTop;
        this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
      };
      ReorderDrag.prototype.deregister = function() {
        this.listEl = null;
        this.el = null;
        this.scrollEl = null;
        this.scrollView = null;
      };
      ReorderDrag.prototype.start = function(e) {
        var content;
        var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
        var elementHeight = this.el.scrollHeight;
        var placeholder = this.el.cloneNode(true);
        placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);
        this.el.parentNode.insertBefore(placeholder, this.el);
        this.el.classList.add(ITEM_REORDERING_CLASS);
        this._currentDrag = {
          elementHeight: elementHeight,
          startIndex: startIndex,
          placeholder: placeholder,
          scrollHeight: scroll,
          list: placeholder.parentNode
        };
        this._moveElement(e);
      };
      ReorderDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
        var self = this;
        if (!this._currentDrag) {
          return;
        }
        var scrollY = 0;
        var pageY = e.gesture.center.pageY;
        var offset = this.listElTrueTop;
        if (this.scrollView) {
          var container = this.scrollView.__container;
          scrollY = this.scrollView.getValues().top;
          var containerTop = container.offsetTop;
          var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight / 2;
          var pixelsPastBottom = pageY + this._currentDrag.elementHeight / 2 - containerTop - container.offsetHeight;
          if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
            this.scrollView.scrollBy(null, -pixelsPastTop);
            ionic.requestAnimationFrame(function() {
              self.drag(e);
            });
          }
          if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
            if (scrollY < this.scrollView.getScrollMax().top) {
              this.scrollView.scrollBy(null, pixelsPastBottom);
              ionic.requestAnimationFrame(function() {
                self.drag(e);
              });
            }
          }
        }
        if (!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
          this._isDragging = true;
        }
        if (this._isDragging) {
          this._moveElement(e);
          this._currentDrag.currentY = scrollY + pageY - offset;
        }
      });
      ReorderDrag.prototype._getReorderIndex = function() {
        var self = this;
        var placeholder = this._currentDrag.placeholder;
        var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children).filter(function(el) {
          return el.nodeName === self.el.nodeName && el !== self.el;
        });
        var dragOffsetTop = this._currentDrag.currentY;
        var el;
        for (var i = 0,
            len = siblings.length; i < len; i++) {
          el = siblings[i];
          if (i === len - 1) {
            if (dragOffsetTop > el.offsetTop) {
              return i;
            }
          } else if (i === 0) {
            if (dragOffsetTop < el.offsetTop + el.offsetHeight) {
              return i;
            }
          } else if (dragOffsetTop > el.offsetTop - el.offsetHeight / 2 && dragOffsetTop < el.offsetTop + el.offsetHeight) {
            return i;
          }
        }
        return this._currentDrag.startIndex;
      };
      ReorderDrag.prototype.end = function(e, doneCallback) {
        if (!this._currentDrag) {
          doneCallback && doneCallback();
          return;
        }
        var placeholder = this._currentDrag.placeholder;
        var finalIndex = this._getReorderIndex();
        this.el.classList.remove(ITEM_REORDERING_CLASS);
        this.el.style[ionic.CSS.TRANSFORM] = '';
        placeholder.parentNode.insertBefore(this.el, placeholder);
        placeholder.parentNode.removeChild(placeholder);
        this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalIndex);
        this._currentDrag = {
          placeholder: null,
          content: null
        };
        this._currentDrag = null;
        doneCallback && doneCallback();
      };
      ionic.views.ListView = ionic.views.View.inherit({
        initialize: function(opts) {
          var _this = this;
          opts = ionic.extend({
            onReorder: function(el, oldIndex, newIndex) {},
            virtualRemoveThreshold: -200,
            virtualAddThreshold: 200,
            canSwipe: function() {
              return true;
            }
          }, opts);
          ionic.extend(this, opts);
          if (!this.itemHeight && this.listEl) {
            this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height, 10);
          }
          this.onRefresh = opts.onRefresh || function() {};
          this.onRefreshOpening = opts.onRefreshOpening || function() {};
          this.onRefreshHolding = opts.onRefreshHolding || function() {};
          window.ionic.onGesture('release', function(e) {
            _this._handleEndDrag(e);
          }, this.el);
          window.ionic.onGesture('drag', function(e) {
            _this._handleDrag(e);
          }, this.el);
          this._initDrag();
        },
        deregister: function() {
          this.el = null;
          this.listEl = null;
          this.scrollEl = null;
          this.scrollView = null;
        },
        stopRefreshing: function() {
          var refresher = this.el.querySelector('.list-refresher');
          refresher.style.height = '0';
        },
        didScroll: function(e) {
          if (this.isVirtual) {
            var itemHeight = this.itemHeight;
            var totalItems = this.listEl.children.length;
            var scrollHeight = e.target.scrollHeight;
            var viewportHeight = this.el.parentNode.offsetHeight;
            var scrollTop = e.scrollTop;
            var highWater = Math.max(0, e.scrollTop + this.virtualRemoveThreshold);
            var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + this.virtualAddThreshold);
            var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);
            var first = parseInt(Math.abs(highWater / itemHeight), 10);
            var last = parseInt(Math.abs(lowWater / itemHeight), 10);
            this._virtualItemsToRemove = Array.prototype.slice.call(this.listEl.children, 0, first);
            var nodes = Array.prototype.slice.call(this.listEl.children, first, first + itemsPerViewport);
            this.renderViewport && this.renderViewport(highWater, lowWater, first, last);
          }
        },
        didStopScrolling: function(e) {
          if (this.isVirtual) {
            for (var i = 0; i < this._virtualItemsToRemove.length; i++) {
              var el = this._virtualItemsToRemove[i];
              this.didHideItem && this.didHideItem(i);
            }
          }
        },
        clearDragEffects: function() {
          if (this._lastDragOp) {
            this._lastDragOp.clean && this._lastDragOp.clean();
            this._lastDragOp.deregister && this._lastDragOp.deregister();
            this._lastDragOp = null;
          }
        },
        _initDrag: function() {
          if (this._lastDragOp) {
            this._lastDragOp.deregister && this._lastDragOp.deregister();
          }
          this._lastDragOp = this._dragOp;
          this._dragOp = null;
        },
        _getItem: function(target) {
          while (target) {
            if (target.classList && target.classList.contains(ITEM_CLASS)) {
              return target;
            }
            target = target.parentNode;
          }
          return null;
        },
        _startDrag: function(e) {
          var _this = this;
          var didStart = false;
          this._isDragging = false;
          var lastDragOp = this._lastDragOp;
          var item;
          if (this._didDragUpOrDown && lastDragOp instanceof SlideDrag) {
            lastDragOp.clean && lastDragOp.clean();
          }
          if (ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
            item = this._getItem(e.target);
            if (item) {
              this._dragOp = new ReorderDrag({
                listEl: this.el,
                el: item,
                scrollEl: this.scrollEl,
                scrollView: this.scrollView,
                onReorder: function(el, start, end) {
                  _this.onReorder && _this.onReorder(el, start, end);
                }
              });
              this._dragOp.start(e);
              e.preventDefault();
            }
          } else if (!this._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {
            item = this._getItem(e.target);
            if (item && item.querySelector('.item-options')) {
              this._dragOp = new SlideDrag({
                el: this.el,
                canSwipe: this.canSwipe
              });
              this._dragOp.start(e);
              e.preventDefault();
            }
          }
          if (lastDragOp && this._dragOp && !this._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
            lastDragOp.clean && lastDragOp.clean();
          }
        },
        _handleEndDrag: function(e) {
          var _this = this;
          this._didDragUpOrDown = false;
          if (!this._dragOp) {
            return;
          }
          this._dragOp.end(e, function() {
            _this._initDrag();
          });
        },
        _handleDrag: function(e) {
          var _this = this,
              content,
              buttons;
          if (Math.abs(e.gesture.deltaY) > 5) {
            this._didDragUpOrDown = true;
          }
          if (!this.isDragging && !this._dragOp) {
            this._startDrag(e);
          }
          if (!this._dragOp) {
            return;
          }
          e.gesture.srcEvent.preventDefault();
          this._dragOp.drag(e);
        }
      });
    })(ionic);
    (function(ionic) {
      'use strict';
      ionic.views.Modal = ionic.views.View.inherit({
        initialize: function(opts) {
          opts = ionic.extend({
            focusFirstInput: false,
            unfocusOnHide: true,
            focusFirstDelay: 600,
            backdropClickToClose: true,
            hardwareBackButtonClose: true
          }, opts);
          ionic.extend(this, opts);
          this.el = opts.el;
        },
        show: function() {
          var self = this;
          if (self.focusFirstInput) {
            window.setTimeout(function() {
              var input = self.el.querySelector('input, textarea');
              input && input.focus && input.focus();
            }, self.focusFirstDelay);
          }
        },
        hide: function() {
          if (this.unfocusOnHide) {
            var inputs = this.el.querySelectorAll('input, textarea');
            window.setTimeout(function() {
              for (var i = 0; i < inputs.length; i++) {
                inputs[i].blur && inputs[i].blur();
              }
            });
          }
        }
      });
    })(ionic);
    (function(ionic) {
      'use strict';
      ionic.views.SideMenu = ionic.views.View.inherit({
        initialize: function(opts) {
          this.el = opts.el;
          this.isEnabled = (typeof opts.isEnabled === 'undefined') ? true : opts.isEnabled;
          this.setWidth(opts.width);
        },
        getFullWidth: function() {
          return this.width;
        },
        setWidth: function(width) {
          this.width = width;
          this.el.style.width = width + 'px';
        },
        setIsEnabled: function(isEnabled) {
          this.isEnabled = isEnabled;
        },
        bringUp: function() {
          if (this.el.style.zIndex !== '0') {
            this.el.style.zIndex = '0';
          }
        },
        pushDown: function() {
          if (this.el.style.zIndex !== '-1') {
            this.el.style.zIndex = '-1';
          }
        }
      });
      ionic.views.SideMenuContent = ionic.views.View.inherit({
        initialize: function(opts) {
          ionic.extend(this, {
            animationClass: 'menu-animated',
            onDrag: function(e) {},
            onEndDrag: function(e) {}
          }, opts);
          ionic.onGesture('drag', ionic.proxy(this._onDrag, this), this.el);
          ionic.onGesture('release', ionic.proxy(this._onEndDrag, this), this.el);
        },
        _onDrag: function(e) {
          this.onDrag && this.onDrag(e);
        },
        _onEndDrag: function(e) {
          this.onEndDrag && this.onEndDrag(e);
        },
        disableAnimation: function() {
          this.el.classList.remove(this.animationClass);
        },
        enableAnimation: function() {
          this.el.classList.add(this.animationClass);
        },
        getTranslateX: function() {
          return parseFloat(this.el.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]);
        },
        setTranslateX: ionic.animationFrameThrottle(function(x) {
          this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0, 0)';
        })
      });
    })(ionic);
    (function(ionic) {
      'use strict';
      ionic.views.Slider = ionic.views.View.inherit({initialize: function(options) {
          var slider = this;
          var noop = function() {};
          var offloadFn = function(fn) {
            setTimeout(fn || noop, 0);
          };
          var browser = {
            addEventListener: !!window.addEventListener,
            touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: (function(temp) {
              var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
              for (var i in props)
                if (temp.style[props[i]] !== undefined)
                  return true;
              return false;
            })(document.createElement('swipe'))
          };
          var container = options.el;
          if (!container)
            return;
          var element = container.children[0];
          var slides,
              slidePos,
              width,
              length;
          options = options || {};
          var index = parseInt(options.startSlide, 10) || 0;
          var speed = options.speed || 300;
          options.continuous = options.continuous !== undefined ? options.continuous : true;
          function setup() {
            slides = element.children;
            length = slides.length;
            if (slides.length < 2)
              options.continuous = false;
            if (browser.transitions && options.continuous && slides.length < 3) {
              element.appendChild(slides[0].cloneNode(true));
              element.appendChild(element.children[1].cloneNode(true));
              slides = element.children;
            }
            slidePos = new Array(slides.length);
            width = container.offsetWidth || container.getBoundingClientRect().width;
            element.style.width = (slides.length * width) + 'px';
            var pos = slides.length;
            while (pos--) {
              var slide = slides[pos];
              slide.style.width = width + 'px';
              slide.setAttribute('data-index', pos);
              if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
                move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
              }
            }
            if (options.continuous && browser.transitions) {
              move(circle(index - 1), -width, 0);
              move(circle(index + 1), width, 0);
            }
            if (!browser.transitions)
              element.style.left = (index * -width) + 'px';
            container.style.visibility = 'visible';
            options.slidesChanged && options.slidesChanged();
          }
          function prev() {
            if (options.continuous)
              slide(index - 1);
            else if (index)
              slide(index - 1);
          }
          function next() {
            if (options.continuous)
              slide(index + 1);
            else if (index < slides.length - 1)
              slide(index + 1);
          }
          function circle(index) {
            return (slides.length + (index % slides.length)) % slides.length;
          }
          function slide(to, slideSpeed) {
            if (index == to)
              return;
            if (browser.transitions) {
              var direction = Math.abs(index - to) / (index - to);
              if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;
                if (direction !== natural_direction)
                  to = -direction * slides.length + to;
              }
              var diff = Math.abs(index - to) - 1;
              while (diff--)
                move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
              to = circle(to);
              move(index, width * direction, slideSpeed || speed);
              move(to, 0, slideSpeed || speed);
              if (options.continuous)
                move(circle(to - direction), -(width * direction), 0);
            } else {
              to = circle(to);
              animate(index * -width, to * -width, slideSpeed || speed);
            }
            index = to;
            offloadFn(options.callback && options.callback(index, slides[index]));
          }
          function move(index, dist, speed) {
            translate(index, dist, speed);
            slidePos[index] = dist;
          }
          function translate(index, dist, speed) {
            var slide = slides[index];
            var style = slide && slide.style;
            if (!style)
              return;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
          }
          function animate(from, to, speed) {
            if (!speed) {
              element.style.left = to + 'px';
              return;
            }
            var start = +new Date();
            var timer = setInterval(function() {
              var timeElap = +new Date() - start;
              if (timeElap > speed) {
                element.style.left = to + 'px';
                if (delay)
                  begin();
                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
                clearInterval(timer);
                return;
              }
              element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';
            }, 4);
          }
          var delay = options.auto || 0;
          var interval;
          function begin() {
            interval = setTimeout(next, delay);
          }
          function stop() {
            delay = options.auto || 0;
            clearTimeout(interval);
          }
          var start = {};
          var delta = {};
          var isScrolling;
          var events = {
            handleEvent: function(event) {
              if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
                event.touches = [{
                  pageX: event.pageX,
                  pageY: event.pageY
                }];
              }
              switch (event.type) {
                case 'mousedown':
                  this.start(event);
                  break;
                case 'touchstart':
                  this.start(event);
                  break;
                case 'touchmove':
                  this.touchmove(event);
                  break;
                case 'mousemove':
                  this.touchmove(event);
                  break;
                case 'touchend':
                  offloadFn(this.end(event));
                  break;
                case 'mouseup':
                  offloadFn(this.end(event));
                  break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                  offloadFn(this.transitionEnd(event));
                  break;
                case 'resize':
                  offloadFn(setup);
                  break;
              }
              if (options.stopPropagation)
                event.stopPropagation();
            },
            start: function(event) {
              var touches = event.touches[0];
              start = {
                x: touches.pageX,
                y: touches.pageY,
                time: +new Date()
              };
              isScrolling = undefined;
              delta = {};
              if (browser.touch) {
                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);
              } else {
                element.addEventListener('mousemove', this, false);
                element.addEventListener('mouseup', this, false);
                document.addEventListener('mouseup', this, false);
              }
            },
            touchmove: function(event) {
              if (event.touches.length > 1 || event.scale && event.scale !== 1 || slider.slideIsDisabled) {
                return;
              }
              if (options.disableScroll)
                event.preventDefault();
              var touches = event.touches[0];
              delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
              };
              if (typeof isScrolling == 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
              }
              if (!isScrolling) {
                event.preventDefault();
                stop();
                if (options.continuous) {
                  translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                  translate(index, delta.x + slidePos[index], 0);
                  translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
                } else {
                  delta.x = delta.x / ((!index && delta.x > 0 || index == slides.length - 1 && delta.x < 0) ? (Math.abs(delta.x) / width + 1) : 1);
                  translate(index - 1, delta.x + slidePos[index - 1], 0);
                  translate(index, delta.x + slidePos[index], 0);
                  translate(index + 1, delta.x + slidePos[index + 1], 0);
                }
              }
            },
            end: function(event) {
              var duration = +new Date() - start.time;
              var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2;
              var isPastBounds = (!index && delta.x > 0) || (index == slides.length - 1 && delta.x < 0);
              if (options.continuous)
                isPastBounds = false;
              var direction = delta.x < 0;
              if (!isScrolling) {
                if (isValidSlide && !isPastBounds) {
                  if (direction) {
                    if (options.continuous) {
                      move(circle(index - 1), -width, 0);
                      move(circle(index + 2), width, 0);
                    } else {
                      move(index - 1, -width, 0);
                    }
                    move(index, slidePos[index] - width, speed);
                    move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                    index = circle(index + 1);
                  } else {
                    if (options.continuous) {
                      move(circle(index + 1), width, 0);
                      move(circle(index - 2), -width, 0);
                    } else {
                      move(index + 1, width, 0);
                    }
                    move(index, slidePos[index] + width, speed);
                    move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                    index = circle(index - 1);
                  }
                  options.callback && options.callback(index, slides[index]);
                } else {
                  if (options.continuous) {
                    move(circle(index - 1), -width, speed);
                    move(index, 0, speed);
                    move(circle(index + 1), width, speed);
                  } else {
                    move(index - 1, -width, speed);
                    move(index, 0, speed);
                    move(index + 1, width, speed);
                  }
                }
              }
              if (browser.touch) {
                element.removeEventListener('touchmove', events, false);
                element.removeEventListener('touchend', events, false);
              } else {
                element.removeEventListener('mousemove', events, false);
                element.removeEventListener('mouseup', events, false);
                document.removeEventListener('mouseup', events, false);
              }
            },
            transitionEnd: function(event) {
              if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
                if (delay)
                  begin();
                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
              }
            }
          };
          this.update = function() {
            setTimeout(setup);
          };
          this.setup = function() {
            setup();
          };
          this.loop = function(value) {
            if (arguments.length)
              options.continuous = !!value;
            return options.continuous;
          };
          this.enableSlide = function(shouldEnable) {
            if (arguments.length) {
              this.slideIsDisabled = !shouldEnable;
            }
            return !this.slideIsDisabled;
          }, this.slide = this.select = function(to, speed) {
            stop();
            slide(to, speed);
          };
          this.prev = this.previous = function() {
            stop();
            prev();
          };
          this.next = function() {
            stop();
            next();
          };
          this.stop = function() {
            stop();
          };
          this.start = function() {
            begin();
          };
          this.autoPlay = function(newDelay) {
            if (!delay || delay < 0) {
              stop();
            } else {
              delay = newDelay;
              begin();
            }
          };
          this.currentIndex = this.selected = function() {
            return index;
          };
          this.slidesCount = this.count = function() {
            return length;
          };
          this.kill = function() {
            stop();
            element.style.width = '';
            element.style.left = '';
            var pos = slides.length;
            while (pos--) {
              var slide = slides[pos];
              slide.style.width = '';
              slide.style.left = '';
              if (browser.transitions)
                translate(pos, 0, 0);
            }
            if (browser.addEventListener) {
              element.removeEventListener('touchstart', events, false);
              element.removeEventListener('webkitTransitionEnd', events, false);
              element.removeEventListener('msTransitionEnd', events, false);
              element.removeEventListener('oTransitionEnd', events, false);
              element.removeEventListener('otransitionend', events, false);
              element.removeEventListener('transitionend', events, false);
              window.removeEventListener('resize', events, false);
            } else {
              window.onresize = null;
            }
          };
          this.load = function() {
            setup();
            if (delay)
              begin();
            if (browser.addEventListener) {
              if (browser.touch) {
                element.addEventListener('touchstart', events, false);
              } else {
                element.addEventListener('mousedown', events, false);
              }
              if (browser.transitions) {
                element.addEventListener('webkitTransitionEnd', events, false);
                element.addEventListener('msTransitionEnd', events, false);
                element.addEventListener('oTransitionEnd', events, false);
                element.addEventListener('otransitionend', events, false);
                element.addEventListener('transitionend', events, false);
              }
              window.addEventListener('resize', events, false);
            } else {
              window.onresize = function() {
                setup();
              };
            }
          };
        }});
    })(ionic);
    (function(ionic) {
      'use strict';
      ionic.views.Toggle = ionic.views.View.inherit({
        initialize: function(opts) {
          var self = this;
          this.el = opts.el;
          this.checkbox = opts.checkbox;
          this.track = opts.track;
          this.handle = opts.handle;
          this.openPercent = -1;
          this.onChange = opts.onChange || function() {};
          this.triggerThreshold = opts.triggerThreshold || 20;
          this.dragStartHandler = function(e) {
            self.dragStart(e);
          };
          this.dragHandler = function(e) {
            self.drag(e);
          };
          this.holdHandler = function(e) {
            self.hold(e);
          };
          this.releaseHandler = function(e) {
            self.release(e);
          };
          this.dragStartGesture = ionic.onGesture('dragstart', this.dragStartHandler, this.el);
          this.dragGesture = ionic.onGesture('drag', this.dragHandler, this.el);
          this.dragHoldGesture = ionic.onGesture('hold', this.holdHandler, this.el);
          this.dragReleaseGesture = ionic.onGesture('release', this.releaseHandler, this.el);
        },
        destroy: function() {
          ionic.offGesture(this.dragStartGesture, 'dragstart', this.dragStartGesture);
          ionic.offGesture(this.dragGesture, 'drag', this.dragGesture);
          ionic.offGesture(this.dragHoldGesture, 'hold', this.holdHandler);
          ionic.offGesture(this.dragReleaseGesture, 'release', this.releaseHandler);
        },
        tap: function(e) {
          if (this.el.getAttribute('disabled') !== 'disabled') {
            this.val(!this.checkbox.checked);
          }
        },
        dragStart: function(e) {
          if (this.checkbox.disabled)
            return;
          this._dragInfo = {
            width: this.el.offsetWidth,
            left: this.el.offsetLeft,
            right: this.el.offsetLeft + this.el.offsetWidth,
            triggerX: this.el.offsetWidth / 2,
            initialState: this.checkbox.checked
          };
          e.gesture.srcEvent.preventDefault();
          this.hold(e);
        },
        drag: function(e) {
          var self = this;
          if (!this._dragInfo) {
            return;
          }
          e.gesture.srcEvent.preventDefault();
          ionic.requestAnimationFrame(function(amount) {
            if (!self._dragInfo) {
              return;
            }
            var slidePageLeft = self.track.offsetLeft + (self.handle.offsetWidth / 2);
            var slidePageRight = self.track.offsetLeft + self.track.offsetWidth - (self.handle.offsetWidth / 2);
            var dx = e.gesture.deltaX;
            var px = e.gesture.touches[0].pageX - self._dragInfo.left;
            var mx = self._dragInfo.width - self.triggerThreshold;
            if (self._dragInfo.initialState) {
              if (px < self.triggerThreshold) {
                self.setOpenPercent(0);
              } else if (px > self._dragInfo.triggerX) {
                self.setOpenPercent(100);
              }
            } else {
              if (px < self._dragInfo.triggerX) {
                self.setOpenPercent(0);
              } else if (px > mx) {
                self.setOpenPercent(100);
              }
            }
          });
        },
        endDrag: function(e) {
          this._dragInfo = null;
        },
        hold: function(e) {
          this.el.classList.add('dragging');
        },
        release: function(e) {
          this.el.classList.remove('dragging');
          this.endDrag(e);
        },
        setOpenPercent: function(openPercent) {
          if (this.openPercent < 0 || (openPercent < (this.openPercent - 3) || openPercent > (this.openPercent + 3))) {
            this.openPercent = openPercent;
            if (openPercent === 0) {
              this.val(false);
            } else if (openPercent === 100) {
              this.val(true);
            } else {
              var openPixel = Math.round((openPercent / 100) * this.track.offsetWidth - (this.handle.offsetWidth));
              openPixel = (openPixel < 1 ? 0 : openPixel);
              this.handle.style[ionic.CSS.TRANSFORM] = 'translate3d(' + openPixel + 'px,0,0)';
            }
          }
        },
        val: function(value) {
          if (value === true || value === false) {
            if (this.handle.style[ionic.CSS.TRANSFORM] !== "") {
              this.handle.style[ionic.CSS.TRANSFORM] = "";
            }
            this.checkbox.checked = value;
            this.openPercent = (value ? 100 : 0);
            this.onChange && this.onChange();
          }
          return this.checkbox.checked;
        }
      });
    })(ionic);
  })();
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
  (function(window, angular, undefined) {
    'use strict';
    angular.module('ngAnimate', ['ng']).directive('ngAnimateChildren', function() {
      var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
      return function(scope, element, attrs) {
        var val = attrs.ngAnimateChildren;
        if (angular.isString(val) && val.length === 0) {
          element.data(NG_ANIMATE_CHILDREN, true);
        } else {
          scope.$watch(val, function(value) {
            element.data(NG_ANIMATE_CHILDREN, !!value);
          });
        }
      };
    }).factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
      var bod = $document[0].body;
      return function(fn) {
        return $$rAF(function() {
          var a = bod.offsetWidth + 1;
          fn();
        });
      };
    }]).config(['$provide', '$animateProvider', function($provide, $animateProvider) {
      var noop = angular.noop;
      var forEach = angular.forEach;
      var selectors = $animateProvider.$$selectors;
      var isArray = angular.isArray;
      var isString = angular.isString;
      var isObject = angular.isObject;
      var ELEMENT_NODE = 1;
      var NG_ANIMATE_STATE = '$$ngAnimateState';
      var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
      var NG_ANIMATE_CLASS_NAME = 'ng-animate';
      var rootAnimateState = {running: true};
      function extractElementNode(element) {
        for (var i = 0; i < element.length; i++) {
          var elm = element[i];
          if (elm.nodeType == ELEMENT_NODE) {
            return elm;
          }
        }
      }
      function prepareElement(element) {
        return element && angular.element(element);
      }
      function stripCommentsFromElement(element) {
        return angular.element(extractElementNode(element));
      }
      function isMatchingElement(elm1, elm2) {
        return extractElementNode(elm1) == extractElementNode(elm2);
      }
      var $$jqLite;
      $provide.decorator('$animate', ['$delegate', '$$q', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document', '$templateRequest', '$$jqLite', function($delegate, $$q, $injector, $sniffer, $rootElement, $$asyncCallback, $rootScope, $document, $templateRequest, $$$jqLite) {
        $$jqLite = $$$jqLite;
        $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
        var deregisterWatch = $rootScope.$watch(function() {
          return $templateRequest.totalPendingRequests;
        }, function(val, oldVal) {
          if (val !== 0)
            return;
          deregisterWatch();
          $rootScope.$$postDigest(function() {
            $rootScope.$$postDigest(function() {
              rootAnimateState.running = false;
            });
          });
        });
        var globalAnimationCounter = 0;
        var classNameFilter = $animateProvider.classNameFilter();
        var isAnimatableClassName = !classNameFilter ? function() {
          return true;
        } : function(className) {
          return classNameFilter.test(className);
        };
        function classBasedAnimationsBlocked(element, setter) {
          var data = element.data(NG_ANIMATE_STATE) || {};
          if (setter) {
            data.running = true;
            data.structural = true;
            element.data(NG_ANIMATE_STATE, data);
          }
          return data.disabled || (data.running && data.structural);
        }
        function runAnimationPostDigest(fn) {
          var cancelFn,
              defer = $$q.defer();
          defer.promise.$$cancelFn = function() {
            cancelFn && cancelFn();
          };
          $rootScope.$$postDigest(function() {
            cancelFn = fn(function() {
              defer.resolve();
            });
          });
          return defer.promise;
        }
        function parseAnimateOptions(options) {
          if (isObject(options)) {
            if (options.tempClasses && isString(options.tempClasses)) {
              options.tempClasses = options.tempClasses.split(/\s+/);
            }
            return options;
          }
        }
        function resolveElementClasses(element, cache, runningAnimations) {
          runningAnimations = runningAnimations || {};
          var lookup = {};
          forEach(runningAnimations, function(data, selector) {
            forEach(selector.split(' '), function(s) {
              lookup[s] = data;
            });
          });
          var hasClasses = Object.create(null);
          forEach((element.attr('class') || '').split(/\s+/), function(className) {
            hasClasses[className] = true;
          });
          var toAdd = [],
              toRemove = [];
          forEach((cache && cache.classes) || [], function(status, className) {
            var hasClass = hasClasses[className];
            var matchingAnimation = lookup[className] || {};
            if (status === false) {
              if (hasClass || matchingAnimation.event == 'addClass') {
                toRemove.push(className);
              }
            } else if (status === true) {
              if (!hasClass || matchingAnimation.event == 'removeClass') {
                toAdd.push(className);
              }
            }
          });
          return (toAdd.length + toRemove.length) > 0 && [toAdd.join(' '), toRemove.join(' ')];
        }
        function lookup(name) {
          if (name) {
            var matches = [],
                flagMap = {},
                classes = name.substr(1).split('.');
            if ($sniffer.transitions || $sniffer.animations) {
              matches.push($injector.get(selectors['']));
            }
            for (var i = 0; i < classes.length; i++) {
              var klass = classes[i],
                  selectorFactoryName = selectors[klass];
              if (selectorFactoryName && !flagMap[klass]) {
                matches.push($injector.get(selectorFactoryName));
                flagMap[klass] = true;
              }
            }
            return matches;
          }
        }
        function animationRunner(element, animationEvent, className, options) {
          var node = element[0];
          if (!node) {
            return;
          }
          if (options) {
            options.to = options.to || {};
            options.from = options.from || {};
          }
          var classNameAdd;
          var classNameRemove;
          if (isArray(className)) {
            classNameAdd = className[0];
            classNameRemove = className[1];
            if (!classNameAdd) {
              className = classNameRemove;
              animationEvent = 'removeClass';
            } else if (!classNameRemove) {
              className = classNameAdd;
              animationEvent = 'addClass';
            } else {
              className = classNameAdd + ' ' + classNameRemove;
            }
          }
          var isSetClassOperation = animationEvent == 'setClass';
          var isClassBased = isSetClassOperation || animationEvent == 'addClass' || animationEvent == 'removeClass' || animationEvent == 'animate';
          var currentClassName = element.attr('class');
          var classes = currentClassName + ' ' + className;
          if (!isAnimatableClassName(classes)) {
            return;
          }
          var beforeComplete = noop,
              beforeCancel = [],
              before = [],
              afterComplete = noop,
              afterCancel = [],
              after = [];
          var animationLookup = (' ' + classes).replace(/\s+/g, '.');
          forEach(lookup(animationLookup), function(animationFactory) {
            var created = registerAnimation(animationFactory, animationEvent);
            if (!created && isSetClassOperation) {
              registerAnimation(animationFactory, 'addClass');
              registerAnimation(animationFactory, 'removeClass');
            }
          });
          function registerAnimation(animationFactory, event) {
            var afterFn = animationFactory[event];
            var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
            if (afterFn || beforeFn) {
              if (event == 'leave') {
                beforeFn = afterFn;
                afterFn = null;
              }
              after.push({
                event: event,
                fn: afterFn
              });
              before.push({
                event: event,
                fn: beforeFn
              });
              return true;
            }
          }
          function run(fns, cancellations, allCompleteFn) {
            var animations = [];
            forEach(fns, function(animation) {
              animation.fn && animations.push(animation);
            });
            var count = 0;
            function afterAnimationComplete(index) {
              if (cancellations) {
                (cancellations[index] || noop)();
                if (++count < animations.length)
                  return;
                cancellations = null;
              }
              allCompleteFn();
            }
            forEach(animations, function(animation, index) {
              var progress = function() {
                afterAnimationComplete(index);
              };
              switch (animation.event) {
                case 'setClass':
                  cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                  break;
                case 'animate':
                  cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                  break;
                case 'addClass':
                  cancellations.push(animation.fn(element, classNameAdd || className, progress, options));
                  break;
                case 'removeClass':
                  cancellations.push(animation.fn(element, classNameRemove || className, progress, options));
                  break;
                default:
                  cancellations.push(animation.fn(element, progress, options));
                  break;
              }
            });
            if (cancellations && cancellations.length === 0) {
              allCompleteFn();
            }
          }
          return {
            node: node,
            event: animationEvent,
            className: className,
            isClassBased: isClassBased,
            isSetClassOperation: isSetClassOperation,
            applyStyles: function() {
              if (options) {
                element.css(angular.extend(options.from || {}, options.to || {}));
              }
            },
            before: function(allCompleteFn) {
              beforeComplete = allCompleteFn;
              run(before, beforeCancel, function() {
                beforeComplete = noop;
                allCompleteFn();
              });
            },
            after: function(allCompleteFn) {
              afterComplete = allCompleteFn;
              run(after, afterCancel, function() {
                afterComplete = noop;
                allCompleteFn();
              });
            },
            cancel: function() {
              if (beforeCancel) {
                forEach(beforeCancel, function(cancelFn) {
                  (cancelFn || noop)(true);
                });
                beforeComplete(true);
              }
              if (afterCancel) {
                forEach(afterCancel, function(cancelFn) {
                  (cancelFn || noop)(true);
                });
                afterComplete(true);
              }
            }
          };
        }
        return {
          animate: function(element, from, to, className, options) {
            className = className || 'ng-inline-animate';
            options = parseAnimateOptions(options) || {};
            options.from = to ? from : null;
            options.to = to ? to : from;
            return runAnimationPostDigest(function(done) {
              return performAnimation('animate', className, stripCommentsFromElement(element), null, null, noop, options, done);
            });
          },
          enter: function(element, parentElement, afterElement, options) {
            options = parseAnimateOptions(options);
            element = angular.element(element);
            parentElement = prepareElement(parentElement);
            afterElement = prepareElement(afterElement);
            classBasedAnimationsBlocked(element, true);
            $delegate.enter(element, parentElement, afterElement);
            return runAnimationPostDigest(function(done) {
              return performAnimation('enter', 'ng-enter', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
            });
          },
          leave: function(element, options) {
            options = parseAnimateOptions(options);
            element = angular.element(element);
            cancelChildAnimations(element);
            classBasedAnimationsBlocked(element, true);
            return runAnimationPostDigest(function(done) {
              return performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
                $delegate.leave(element);
              }, options, done);
            });
          },
          move: function(element, parentElement, afterElement, options) {
            options = parseAnimateOptions(options);
            element = angular.element(element);
            parentElement = prepareElement(parentElement);
            afterElement = prepareElement(afterElement);
            cancelChildAnimations(element);
            classBasedAnimationsBlocked(element, true);
            $delegate.move(element, parentElement, afterElement);
            return runAnimationPostDigest(function(done) {
              return performAnimation('move', 'ng-move', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
            });
          },
          addClass: function(element, className, options) {
            return this.setClass(element, className, [], options);
          },
          removeClass: function(element, className, options) {
            return this.setClass(element, [], className, options);
          },
          setClass: function(element, add, remove, options) {
            options = parseAnimateOptions(options);
            var STORAGE_KEY = '$$animateClasses';
            element = angular.element(element);
            element = stripCommentsFromElement(element);
            if (classBasedAnimationsBlocked(element)) {
              return $delegate.$$setClassImmediately(element, add, remove, options);
            }
            var classes,
                cache = element.data(STORAGE_KEY);
            var hasCache = !!cache;
            if (!cache) {
              cache = {};
              cache.classes = {};
            }
            classes = cache.classes;
            add = isArray(add) ? add : add.split(' ');
            forEach(add, function(c) {
              if (c && c.length) {
                classes[c] = true;
              }
            });
            remove = isArray(remove) ? remove : remove.split(' ');
            forEach(remove, function(c) {
              if (c && c.length) {
                classes[c] = false;
              }
            });
            if (hasCache) {
              if (options && cache.options) {
                cache.options = angular.extend(cache.options || {}, options);
              }
              return cache.promise;
            } else {
              element.data(STORAGE_KEY, cache = {
                classes: classes,
                options: options
              });
            }
            return cache.promise = runAnimationPostDigest(function(done) {
              var parentElement = element.parent();
              var elementNode = extractElementNode(element);
              var parentNode = elementNode.parentNode;
              if (!parentNode || parentNode['$$NG_REMOVED'] || elementNode['$$NG_REMOVED']) {
                done();
                return;
              }
              var cache = element.data(STORAGE_KEY);
              element.removeData(STORAGE_KEY);
              var state = element.data(NG_ANIMATE_STATE) || {};
              var classes = resolveElementClasses(element, cache, state.active);
              return !classes ? done() : performAnimation('setClass', classes, element, parentElement, null, function() {
                if (classes[0])
                  $delegate.$$addClassImmediately(element, classes[0]);
                if (classes[1])
                  $delegate.$$removeClassImmediately(element, classes[1]);
              }, cache.options, done);
            });
          },
          cancel: function(promise) {
            promise.$$cancelFn();
          },
          enabled: function(value, element) {
            switch (arguments.length) {
              case 2:
                if (value) {
                  cleanup(element);
                } else {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  data.disabled = true;
                  element.data(NG_ANIMATE_STATE, data);
                }
                break;
              case 1:
                rootAnimateState.disabled = !value;
                break;
              default:
                value = !rootAnimateState.disabled;
                break;
            }
            return !!value;
          }
        };
        function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
          var noopCancel = noop;
          var runner = animationRunner(element, animationEvent, className, options);
          if (!runner) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            closeAnimation();
            return noopCancel;
          }
          animationEvent = runner.event;
          className = runner.className;
          var elementEvents = angular.element._data(runner.node);
          elementEvents = elementEvents && elementEvents.events;
          if (!parentElement) {
            parentElement = afterElement ? afterElement.parent() : element.parent();
          }
          if (animationsDisabled(element, parentElement)) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            closeAnimation();
            return noopCancel;
          }
          var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};
          var runningAnimations = ngAnimateState.active || {};
          var totalActiveAnimations = ngAnimateState.totalActive || 0;
          var lastAnimation = ngAnimateState.last;
          var skipAnimation = false;
          if (totalActiveAnimations > 0) {
            var animationsToCancel = [];
            if (!runner.isClassBased) {
              if (animationEvent == 'leave' && runningAnimations['ng-leave']) {
                skipAnimation = true;
              } else {
                for (var klass in runningAnimations) {
                  animationsToCancel.push(runningAnimations[klass]);
                }
                ngAnimateState = {};
                cleanup(element, true);
              }
            } else if (lastAnimation.event == 'setClass') {
              animationsToCancel.push(lastAnimation);
              cleanup(element, className);
            } else if (runningAnimations[className]) {
              var current = runningAnimations[className];
              if (current.event == animationEvent) {
                skipAnimation = true;
              } else {
                animationsToCancel.push(current);
                cleanup(element, className);
              }
            }
            if (animationsToCancel.length > 0) {
              forEach(animationsToCancel, function(operation) {
                operation.cancel();
              });
            }
          }
          if (runner.isClassBased && !runner.isSetClassOperation && animationEvent != 'animate' && !skipAnimation) {
            skipAnimation = (animationEvent == 'addClass') == element.hasClass(className);
          }
          if (skipAnimation) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            fireDoneCallbackAsync();
            return noopCancel;
          }
          runningAnimations = ngAnimateState.active || {};
          totalActiveAnimations = ngAnimateState.totalActive || 0;
          if (animationEvent == 'leave') {
            element.one('$destroy', function(e) {
              var element = angular.element(this);
              var state = element.data(NG_ANIMATE_STATE);
              if (state) {
                var activeLeaveAnimation = state.active['ng-leave'];
                if (activeLeaveAnimation) {
                  activeLeaveAnimation.cancel();
                  cleanup(element, 'ng-leave');
                }
              }
            });
          }
          $$jqLite.addClass(element, NG_ANIMATE_CLASS_NAME);
          if (options && options.tempClasses) {
            forEach(options.tempClasses, function(className) {
              $$jqLite.addClass(element, className);
            });
          }
          var localAnimationCount = globalAnimationCounter++;
          totalActiveAnimations++;
          runningAnimations[className] = runner;
          element.data(NG_ANIMATE_STATE, {
            last: runner,
            active: runningAnimations,
            index: localAnimationCount,
            totalActive: totalActiveAnimations
          });
          fireBeforeCallbackAsync();
          runner.before(function(cancelled) {
            var data = element.data(NG_ANIMATE_STATE);
            cancelled = cancelled || !data || !data.active[className] || (runner.isClassBased && data.active[className].event != animationEvent);
            fireDOMOperation();
            if (cancelled === true) {
              closeAnimation();
            } else {
              fireAfterCallbackAsync();
              runner.after(closeAnimation);
            }
          });
          return runner.cancel;
          function fireDOMCallback(animationPhase) {
            var eventName = '$animate:' + animationPhase;
            if (elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
              $$asyncCallback(function() {
                element.triggerHandler(eventName, {
                  event: animationEvent,
                  className: className
                });
              });
            }
          }
          function fireBeforeCallbackAsync() {
            fireDOMCallback('before');
          }
          function fireAfterCallbackAsync() {
            fireDOMCallback('after');
          }
          function fireDoneCallbackAsync() {
            fireDOMCallback('close');
            doneCallback();
          }
          function fireDOMOperation() {
            if (!fireDOMOperation.hasBeenRun) {
              fireDOMOperation.hasBeenRun = true;
              domOperation();
            }
          }
          function closeAnimation() {
            if (!closeAnimation.hasBeenRun) {
              if (runner) {
                runner.applyStyles();
              }
              closeAnimation.hasBeenRun = true;
              if (options && options.tempClasses) {
                forEach(options.tempClasses, function(className) {
                  $$jqLite.removeClass(element, className);
                });
              }
              var data = element.data(NG_ANIMATE_STATE);
              if (data) {
                if (runner && runner.isClassBased) {
                  cleanup(element, className);
                } else {
                  $$asyncCallback(function() {
                    var data = element.data(NG_ANIMATE_STATE) || {};
                    if (localAnimationCount == data.index) {
                      cleanup(element, className, animationEvent);
                    }
                  });
                  element.data(NG_ANIMATE_STATE, data);
                }
              }
              fireDoneCallbackAsync();
            }
          }
        }
        function cancelChildAnimations(element) {
          var node = extractElementNode(element);
          if (node) {
            var nodes = angular.isFunction(node.getElementsByClassName) ? node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) : node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
            forEach(nodes, function(element) {
              element = angular.element(element);
              var data = element.data(NG_ANIMATE_STATE);
              if (data && data.active) {
                forEach(data.active, function(runner) {
                  runner.cancel();
                });
              }
            });
          }
        }
        function cleanup(element, className) {
          if (isMatchingElement(element, $rootElement)) {
            if (!rootAnimateState.disabled) {
              rootAnimateState.running = false;
              rootAnimateState.structural = false;
            }
          } else if (className) {
            var data = element.data(NG_ANIMATE_STATE) || {};
            var removeAnimations = className === true;
            if (!removeAnimations && data.active && data.active[className]) {
              data.totalActive--;
              delete data.active[className];
            }
            if (removeAnimations || !data.totalActive) {
              $$jqLite.removeClass(element, NG_ANIMATE_CLASS_NAME);
              element.removeData(NG_ANIMATE_STATE);
            }
          }
        }
        function animationsDisabled(element, parentElement) {
          if (rootAnimateState.disabled) {
            return true;
          }
          if (isMatchingElement(element, $rootElement)) {
            return rootAnimateState.running;
          }
          var allowChildAnimations,
              parentRunningAnimation,
              hasParent;
          do {
            if (parentElement.length === 0)
              break;
            var isRoot = isMatchingElement(parentElement, $rootElement);
            var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
            if (state.disabled) {
              return true;
            }
            if (isRoot) {
              hasParent = true;
            }
            if (allowChildAnimations !== false) {
              var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
              if (angular.isDefined(animateChildrenFlag)) {
                allowChildAnimations = animateChildrenFlag;
              }
            }
            parentRunningAnimation = parentRunningAnimation || state.running || (state.last && !state.last.isClassBased);
          } while (parentElement = parentElement.parent());
          return !hasParent || (!allowChildAnimations && parentRunningAnimation);
        }
      }]);
      $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow', function($window, $sniffer, $timeout, $$animateReflow) {
        var CSS_PREFIX = '',
            TRANSITION_PROP,
            TRANSITIONEND_EVENT,
            ANIMATION_PROP,
            ANIMATIONEND_EVENT;
        if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
          CSS_PREFIX = '-webkit-';
          TRANSITION_PROP = 'WebkitTransition';
          TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
        } else {
          TRANSITION_PROP = 'transition';
          TRANSITIONEND_EVENT = 'transitionend';
        }
        if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
          CSS_PREFIX = '-webkit-';
          ANIMATION_PROP = 'WebkitAnimation';
          ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
        } else {
          ANIMATION_PROP = 'animation';
          ANIMATIONEND_EVENT = 'animationend';
        }
        var DURATION_KEY = 'Duration';
        var PROPERTY_KEY = 'Property';
        var DELAY_KEY = 'Delay';
        var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
        var ANIMATION_PLAYSTATE_KEY = 'PlayState';
        var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
        var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
        var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
        var CLOSING_TIME_BUFFER = 1.5;
        var ONE_SECOND = 1000;
        var lookupCache = {};
        var parentCounter = 0;
        var animationReflowQueue = [];
        var cancelAnimationReflow;
        function clearCacheAfterReflow() {
          if (!cancelAnimationReflow) {
            cancelAnimationReflow = $$animateReflow(function() {
              animationReflowQueue = [];
              cancelAnimationReflow = null;
              lookupCache = {};
            });
          }
        }
        function afterReflow(element, callback) {
          if (cancelAnimationReflow) {
            cancelAnimationReflow();
          }
          animationReflowQueue.push(callback);
          cancelAnimationReflow = $$animateReflow(function() {
            forEach(animationReflowQueue, function(fn) {
              fn();
            });
            animationReflowQueue = [];
            cancelAnimationReflow = null;
            lookupCache = {};
          });
        }
        var closingTimer = null;
        var closingTimestamp = 0;
        var animationElementQueue = [];
        function animationCloseHandler(element, totalTime) {
          var node = extractElementNode(element);
          element = angular.element(node);
          animationElementQueue.push(element);
          var futureTimestamp = Date.now() + totalTime;
          if (futureTimestamp <= closingTimestamp) {
            return;
          }
          $timeout.cancel(closingTimer);
          closingTimestamp = futureTimestamp;
          closingTimer = $timeout(function() {
            closeAllAnimations(animationElementQueue);
            animationElementQueue = [];
          }, totalTime, false);
        }
        function closeAllAnimations(elements) {
          forEach(elements, function(element) {
            var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
            if (elementData) {
              forEach(elementData.closeAnimationFns, function(fn) {
                fn();
              });
            }
          });
        }
        function getElementAnimationDetails(element, cacheKey) {
          var data = cacheKey ? lookupCache[cacheKey] : null;
          if (!data) {
            var transitionDuration = 0;
            var transitionDelay = 0;
            var animationDuration = 0;
            var animationDelay = 0;
            forEach(element, function(element) {
              if (element.nodeType == ELEMENT_NODE) {
                var elementStyles = $window.getComputedStyle(element) || {};
                var transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                var animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];
                animationDelay = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);
                var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                if (aDuration > 0) {
                  aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
                }
                animationDuration = Math.max(aDuration, animationDuration);
              }
            });
            data = {
              total: 0,
              transitionDelay: transitionDelay,
              transitionDuration: transitionDuration,
              animationDelay: animationDelay,
              animationDuration: animationDuration
            };
            if (cacheKey) {
              lookupCache[cacheKey] = data;
            }
          }
          return data;
        }
        function parseMaxTime(str) {
          var maxValue = 0;
          var values = isString(str) ? str.split(/\s*,\s*/) : [];
          forEach(values, function(value) {
            maxValue = Math.max(parseFloat(value) || 0, maxValue);
          });
          return maxValue;
        }
        function getCacheKey(element) {
          var parentElement = element.parent();
          var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
          if (!parentID) {
            parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
            parentID = parentCounter;
          }
          return parentID + '-' + extractElementNode(element).getAttribute('class');
        }
        function animateSetup(animationEvent, element, className, styles) {
          var structural = ['ng-enter', 'ng-leave', 'ng-move'].indexOf(className) >= 0;
          var cacheKey = getCacheKey(element);
          var eventCacheKey = cacheKey + ' ' + className;
          var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;
          var stagger = {};
          if (itemIndex > 0) {
            var staggerClassName = className + '-stagger';
            var staggerCacheKey = cacheKey + ' ' + staggerClassName;
            var applyClasses = !lookupCache[staggerCacheKey];
            applyClasses && $$jqLite.addClass(element, staggerClassName);
            stagger = getElementAnimationDetails(element, staggerCacheKey);
            applyClasses && $$jqLite.removeClass(element, staggerClassName);
          }
          $$jqLite.addClass(element, className);
          var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};
          var timings = getElementAnimationDetails(element, eventCacheKey);
          var transitionDuration = timings.transitionDuration;
          var animationDuration = timings.animationDuration;
          if (structural && transitionDuration === 0 && animationDuration === 0) {
            $$jqLite.removeClass(element, className);
            return false;
          }
          var blockTransition = styles || (structural && transitionDuration > 0);
          var blockAnimation = animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0;
          var closeAnimationFns = formerData.closeAnimationFns || [];
          element.data(NG_ANIMATE_CSS_DATA_KEY, {
            stagger: stagger,
            cacheKey: eventCacheKey,
            running: formerData.running || 0,
            itemIndex: itemIndex,
            blockTransition: blockTransition,
            closeAnimationFns: closeAnimationFns
          });
          var node = extractElementNode(element);
          if (blockTransition) {
            blockTransitions(node, true);
            if (styles) {
              element.css(styles);
            }
          }
          if (blockAnimation) {
            blockAnimations(node, true);
          }
          return true;
        }
        function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
          var node = extractElementNode(element);
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if (node.getAttribute('class').indexOf(className) == -1 || !elementData) {
            activeAnimationComplete();
            return;
          }
          var activeClassName = '';
          var pendingClassName = '';
          forEach(className.split(' '), function(klass, i) {
            var prefix = (i > 0 ? ' ' : '') + klass;
            activeClassName += prefix + '-active';
            pendingClassName += prefix + '-pending';
          });
          var style = '';
          var appliedStyles = [];
          var itemIndex = elementData.itemIndex;
          var stagger = elementData.stagger;
          var staggerTime = 0;
          if (itemIndex > 0) {
            var transitionStaggerDelay = 0;
            if (stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
              transitionStaggerDelay = stagger.transitionDelay * itemIndex;
            }
            var animationStaggerDelay = 0;
            if (stagger.animationDelay > 0 && stagger.animationDuration === 0) {
              animationStaggerDelay = stagger.animationDelay * itemIndex;
              appliedStyles.push(CSS_PREFIX + 'animation-play-state');
            }
            staggerTime = Math.round(Math.max(transitionStaggerDelay, animationStaggerDelay) * 100) / 100;
          }
          if (!staggerTime) {
            $$jqLite.addClass(element, activeClassName);
            if (elementData.blockTransition) {
              blockTransitions(node, false);
            }
          }
          var eventCacheKey = elementData.cacheKey + ' ' + activeClassName;
          var timings = getElementAnimationDetails(element, eventCacheKey);
          var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
          if (maxDuration === 0) {
            $$jqLite.removeClass(element, activeClassName);
            animateClose(element, className);
            activeAnimationComplete();
            return;
          }
          if (!staggerTime && styles) {
            if (!timings.transitionDuration) {
              element.css('transition', timings.animationDuration + 's linear all');
              appliedStyles.push('transition');
            }
            element.css(styles);
          }
          var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
          var maxDelayTime = maxDelay * ONE_SECOND;
          if (appliedStyles.length > 0) {
            var oldStyle = node.getAttribute('style') || '';
            if (oldStyle.charAt(oldStyle.length - 1) !== ';') {
              oldStyle += ';';
            }
            node.setAttribute('style', oldStyle + ' ' + style);
          }
          var startTime = Date.now();
          var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
          var animationTime = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
          var totalTime = (staggerTime + animationTime) * ONE_SECOND;
          var staggerTimeout;
          if (staggerTime > 0) {
            $$jqLite.addClass(element, pendingClassName);
            staggerTimeout = $timeout(function() {
              staggerTimeout = null;
              if (timings.transitionDuration > 0) {
                blockTransitions(node, false);
              }
              if (timings.animationDuration > 0) {
                blockAnimations(node, false);
              }
              $$jqLite.addClass(element, activeClassName);
              $$jqLite.removeClass(element, pendingClassName);
              if (styles) {
                if (timings.transitionDuration === 0) {
                  element.css('transition', timings.animationDuration + 's linear all');
                }
                element.css(styles);
                appliedStyles.push('transition');
              }
            }, staggerTime * ONE_SECOND, false);
          }
          element.on(css3AnimationEvents, onAnimationProgress);
          elementData.closeAnimationFns.push(function() {
            onEnd();
            activeAnimationComplete();
          });
          elementData.running++;
          animationCloseHandler(element, totalTime);
          return onEnd;
          function onEnd() {
            element.off(css3AnimationEvents, onAnimationProgress);
            $$jqLite.removeClass(element, activeClassName);
            $$jqLite.removeClass(element, pendingClassName);
            if (staggerTimeout) {
              $timeout.cancel(staggerTimeout);
            }
            animateClose(element, className);
            var node = extractElementNode(element);
            for (var i in appliedStyles) {
              node.style.removeProperty(appliedStyles[i]);
            }
          }
          function onAnimationProgress(event) {
            event.stopPropagation();
            var ev = event.originalEvent || event;
            var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
            var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
            if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
              activeAnimationComplete();
            }
          }
        }
        function blockTransitions(node, bool) {
          node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? 'none' : '';
        }
        function blockAnimations(node, bool) {
          node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? 'paused' : '';
        }
        function animateBefore(animationEvent, element, className, styles) {
          if (animateSetup(animationEvent, element, className, styles)) {
            return function(cancelled) {
              cancelled && animateClose(element, className);
            };
          }
        }
        function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
          if (element.data(NG_ANIMATE_CSS_DATA_KEY)) {
            return animateRun(animationEvent, element, className, afterAnimationComplete, styles);
          } else {
            animateClose(element, className);
            afterAnimationComplete();
          }
        }
        function animate(animationEvent, element, className, animationComplete, options) {
          var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
          if (!preReflowCancellation) {
            clearCacheAfterReflow();
            animationComplete();
            return;
          }
          var cancel = preReflowCancellation;
          afterReflow(element, function() {
            cancel = animateAfter(animationEvent, element, className, animationComplete, options.to);
          });
          return function(cancelled) {
            (cancel || noop)(cancelled);
          };
        }
        function animateClose(element, className) {
          $$jqLite.removeClass(element, className);
          var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if (data) {
            if (data.running) {
              data.running--;
            }
            if (!data.running || data.running === 0) {
              element.removeData(NG_ANIMATE_CSS_DATA_KEY);
            }
          }
        }
        return {
          animate: function(element, className, from, to, animationCompleted, options) {
            options = options || {};
            options.from = from;
            options.to = to;
            return animate('animate', element, className, animationCompleted, options);
          },
          enter: function(element, animationCompleted, options) {
            options = options || {};
            return animate('enter', element, 'ng-enter', animationCompleted, options);
          },
          leave: function(element, animationCompleted, options) {
            options = options || {};
            return animate('leave', element, 'ng-leave', animationCompleted, options);
          },
          move: function(element, animationCompleted, options) {
            options = options || {};
            return animate('move', element, 'ng-move', animationCompleted, options);
          },
          beforeSetClass: function(element, add, remove, animationCompleted, options) {
            options = options || {};
            var className = suffixClasses(remove, '-remove') + ' ' + suffixClasses(add, '-add');
            var cancellationMethod = animateBefore('setClass', element, className, options.from);
            if (cancellationMethod) {
              afterReflow(element, animationCompleted);
              return cancellationMethod;
            }
            clearCacheAfterReflow();
            animationCompleted();
          },
          beforeAddClass: function(element, className, animationCompleted, options) {
            options = options || {};
            var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), options.from);
            if (cancellationMethod) {
              afterReflow(element, animationCompleted);
              return cancellationMethod;
            }
            clearCacheAfterReflow();
            animationCompleted();
          },
          beforeRemoveClass: function(element, className, animationCompleted, options) {
            options = options || {};
            var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), options.from);
            if (cancellationMethod) {
              afterReflow(element, animationCompleted);
              return cancellationMethod;
            }
            clearCacheAfterReflow();
            animationCompleted();
          },
          setClass: function(element, add, remove, animationCompleted, options) {
            options = options || {};
            remove = suffixClasses(remove, '-remove');
            add = suffixClasses(add, '-add');
            var className = remove + ' ' + add;
            return animateAfter('setClass', element, className, animationCompleted, options.to);
          },
          addClass: function(element, className, animationCompleted, options) {
            options = options || {};
            return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted, options.to);
          },
          removeClass: function(element, className, animationCompleted, options) {
            options = options || {};
            return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted, options.to);
          }
        };
        function suffixClasses(classes, suffix) {
          var className = '';
          classes = isArray(classes) ? classes : classes.split(/\s+/);
          forEach(classes, function(klass, i) {
            if (klass && klass.length > 0) {
              className += (i > 0 ? ' ' : '') + klass + suffix;
            }
          });
          return className;
        }
      }]);
    }]);
  })(window, window.angular);
  (function(window, angular, undefined) {
    'use strict';
    var $sanitizeMinErr = angular.$$minErr('$sanitize');
    function $SanitizeProvider() {
      this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
        return function(html) {
          var buf = [];
          htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
            return !/^unsafe/.test($$sanitizeUri(uri, isImage));
          }));
          return buf.join('');
        };
      }];
    }
    function sanitizeText(chars) {
      var buf = [];
      var writer = htmlSanitizeWriter(buf, angular.noop);
      writer.chars(chars);
      return buf.join('');
    }
    var START_TAG_REGEXP = /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
        END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
        ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
        BEGIN_TAG_REGEXP = /^</,
        BEGING_END_TAGE_REGEXP = /^<\//,
        COMMENT_REGEXP = /<!--(.*?)-->/g,
        DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
        CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
        SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
    var voidElements = makeMap("area,br,col,hr,img,wbr");
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = angular.extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);
    var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," + "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," + "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));
    var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," + "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," + "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));
    var svgElements = makeMap("animate,animateColor,animateMotion,animateTransform,circle,defs," + "desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient," + "line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,set," + "stop,svg,switch,text,title,tspan,use");
    var specialElements = makeMap("script,style");
    var validElements = angular.extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements, svgElements);
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");
    var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' + 'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' + 'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' + 'scope,scrolling,shape,size,span,start,summary,target,title,type,' + 'valign,value,vspace,width');
    var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' + 'attributeName,attributeType,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,' + 'color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,' + 'font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,' + 'gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,' + 'keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,' + 'markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,' + 'overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,' + 'repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,' + 'stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,' + 'stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,' + 'stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,' + 'underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,' + 'viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,' + 'xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,' + 'zoomAndPan');
    var validAttrs = angular.extend({}, uriAttrs, svgAttrs, htmlAttrs);
    function makeMap(str) {
      var obj = {},
          items = str.split(','),
          i;
      for (i = 0; i < items.length; i++)
        obj[items[i]] = true;
      return obj;
    }
    function htmlParser(html, handler) {
      if (typeof html !== 'string') {
        if (html === null || typeof html === 'undefined') {
          html = '';
        } else {
          html = '' + html;
        }
      }
      var index,
          chars,
          match,
          stack = [],
          last = html,
          text;
      stack.last = function() {
        return stack[stack.length - 1];
      };
      while (html) {
        text = '';
        chars = true;
        if (!stack.last() || !specialElements[stack.last()]) {
          if (html.indexOf("<!--") === 0) {
            index = html.indexOf("--", 4);
            if (index >= 0 && html.lastIndexOf("-->", index) === index) {
              if (handler.comment)
                handler.comment(html.substring(4, index));
              html = html.substring(index + 3);
              chars = false;
            }
          } else if (DOCTYPE_REGEXP.test(html)) {
            match = html.match(DOCTYPE_REGEXP);
            if (match) {
              html = html.replace(match[0], '');
              chars = false;
            }
          } else if (BEGING_END_TAGE_REGEXP.test(html)) {
            match = html.match(END_TAG_REGEXP);
            if (match) {
              html = html.substring(match[0].length);
              match[0].replace(END_TAG_REGEXP, parseEndTag);
              chars = false;
            }
          } else if (BEGIN_TAG_REGEXP.test(html)) {
            match = html.match(START_TAG_REGEXP);
            if (match) {
              if (match[4]) {
                html = html.substring(match[0].length);
                match[0].replace(START_TAG_REGEXP, parseStartTag);
              }
              chars = false;
            } else {
              text += '<';
              html = html.substring(1);
            }
          }
          if (chars) {
            index = html.indexOf("<");
            text += index < 0 ? html : html.substring(0, index);
            html = index < 0 ? "" : html.substring(index);
            if (handler.chars)
              handler.chars(decodeEntities(text));
          }
        } else {
          html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text) {
            text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");
            if (handler.chars)
              handler.chars(decodeEntities(text));
            return "";
          });
          parseEndTag("", stack.last());
        }
        if (html == last) {
          throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " + "of html: {0}", html);
        }
        last = html;
      }
      parseEndTag();
      function parseStartTag(tag, tagName, rest, unary) {
        tagName = angular.lowercase(tagName);
        if (blockElements[tagName]) {
          while (stack.last() && inlineElements[stack.last()]) {
            parseEndTag("", stack.last());
          }
        }
        if (optionalEndTagElements[tagName] && stack.last() == tagName) {
          parseEndTag("", tagName);
        }
        unary = voidElements[tagName] || !!unary;
        if (!unary)
          stack.push(tagName);
        var attrs = {};
        rest.replace(ATTR_REGEXP, function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
          var value = doubleQuotedValue || singleQuotedValue || unquotedValue || '';
          attrs[name] = decodeEntities(value);
        });
        if (handler.start)
          handler.start(tagName, attrs, unary);
      }
      function parseEndTag(tag, tagName) {
        var pos = 0,
            i;
        tagName = angular.lowercase(tagName);
        if (tagName)
          for (pos = stack.length - 1; pos >= 0; pos--)
            if (stack[pos] == tagName)
              break;
        if (pos >= 0) {
          for (i = stack.length - 1; i >= pos; i--)
            if (handler.end)
              handler.end(stack[i]);
          stack.length = pos;
        }
      }
    }
    var hiddenPre = document.createElement("pre");
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
    function decodeEntities(value) {
      if (!value) {
        return '';
      }
      var parts = spaceRe.exec(value);
      var spaceBefore = parts[1];
      var spaceAfter = parts[3];
      var content = parts[2];
      if (content) {
        hiddenPre.innerHTML = content.replace(/</g, "&lt;");
        content = 'textContent' in hiddenPre ? hiddenPre.textContent : hiddenPre.innerText;
      }
      return spaceBefore + content + spaceAfter;
    }
    function encodeEntities(value) {
      return value.replace(/&/g, '&amp;').replace(SURROGATE_PAIR_REGEXP, function(value) {
        var hi = value.charCodeAt(0);
        var low = value.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
      }).replace(NON_ALPHANUMERIC_REGEXP, function(value) {
        return '&#' + value.charCodeAt(0) + ';';
      }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function htmlSanitizeWriter(buf, uriValidator) {
      var ignore = false;
      var out = angular.bind(buf, buf.push);
      return {
        start: function(tag, attrs, unary) {
          tag = angular.lowercase(tag);
          if (!ignore && specialElements[tag]) {
            ignore = tag;
          }
          if (!ignore && validElements[tag] === true) {
            out('<');
            out(tag);
            angular.forEach(attrs, function(value, key) {
              var lkey = angular.lowercase(key);
              var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
              if (validAttrs[lkey] === true && (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                out(' ');
                out(key);
                out('="');
                out(encodeEntities(value));
                out('"');
              }
            });
            out(unary ? '/>' : '>');
          }
        },
        end: function(tag) {
          tag = angular.lowercase(tag);
          if (!ignore && validElements[tag] === true) {
            out('</');
            out(tag);
            out('>');
          }
          if (tag == ignore) {
            ignore = false;
          }
        },
        chars: function(chars) {
          if (!ignore) {
            out(encodeEntities(chars));
          }
        }
      };
    }
    angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);
    angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
      var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,
          MAILTO_REGEXP = /^mailto:/;
      return function(text, target) {
        if (!text)
          return text;
        var match;
        var raw = text;
        var html = [];
        var url;
        var i;
        while ((match = raw.match(LINKY_URL_REGEXP))) {
          url = match[0];
          if (!match[2] && !match[4]) {
            url = (match[3] ? 'http://' : 'mailto:') + url;
          }
          i = match.index;
          addText(raw.substr(0, i));
          addLink(url, match[0].replace(MAILTO_REGEXP, ''));
          raw = raw.substring(i + match[0].length);
        }
        addText(raw);
        return $sanitize(html.join(''));
        function addText(text) {
          if (!text) {
            return;
          }
          html.push(sanitizeText(text));
        }
        function addLink(url, text) {
          html.push('<a ');
          if (angular.isDefined(target)) {
            html.push('target="', target, '" ');
          }
          html.push('href="', url.replace(/"/g, '&quot;'), '">');
          addText(text);
          html.push('</a>');
        }
      };
    }]);
  })(window, window.angular);
  if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'ui.router';
  }
  (function(window, angular, undefined) {
    'use strict';
    var isDefined = angular.isDefined,
        isFunction = angular.isFunction,
        isString = angular.isString,
        isObject = angular.isObject,
        isArray = angular.isArray,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy;
    function inherit(parent, extra) {
      return extend(new (extend(function() {}, {prototype: parent}))(), extra);
    }
    function merge(dst) {
      forEach(arguments, function(obj) {
        if (obj !== dst) {
          forEach(obj, function(value, key) {
            if (!dst.hasOwnProperty(key))
              dst[key] = value;
          });
        }
      });
      return dst;
    }
    function ancestors(first, second) {
      var path = [];
      for (var n in first.path) {
        if (first.path[n] !== second.path[n])
          break;
        path.push(first.path[n]);
      }
      return path;
    }
    function objectKeys(object) {
      if (Object.keys) {
        return Object.keys(object);
      }
      var result = [];
      angular.forEach(object, function(val, key) {
        result.push(key);
      });
      return result;
    }
    function indexOf(array, value) {
      if (Array.prototype.indexOf) {
        return array.indexOf(value, Number(arguments[2]) || 0);
      }
      var len = array.length >>> 0,
          from = Number(arguments[2]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;
      for (; from < len; from++) {
        if (from in array && array[from] === value)
          return from;
      }
      return -1;
    }
    function inheritParams(currentParams, newParams, $current, $to) {
      var parents = ancestors($current, $to),
          parentParams,
          inherited = {},
          inheritList = [];
      for (var i in parents) {
        if (!parents[i].params)
          continue;
        parentParams = objectKeys(parents[i].params);
        if (!parentParams.length)
          continue;
        for (var j in parentParams) {
          if (indexOf(inheritList, parentParams[j]) >= 0)
            continue;
          inheritList.push(parentParams[j]);
          inherited[parentParams[j]] = currentParams[parentParams[j]];
        }
      }
      return extend({}, inherited, newParams);
    }
    function equalForKeys(a, b, keys) {
      if (!keys) {
        keys = [];
        for (var n in a)
          keys.push(n);
      }
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (a[k] != b[k])
          return false;
      }
      return true;
    }
    function filterByKeys(keys, values) {
      var filtered = {};
      forEach(keys, function(name) {
        filtered[name] = values[name];
      });
      return filtered;
    }
    function indexBy(array, propName) {
      var result = {};
      forEach(array, function(item) {
        result[item[propName]] = item;
      });
      return result;
    }
    function pick(obj) {
      var copy = {};
      var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
      forEach(keys, function(key) {
        if (key in obj)
          copy[key] = obj[key];
      });
      return copy;
    }
    function omit(obj) {
      var copy = {};
      var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
      for (var key in obj) {
        if (indexOf(keys, key) == -1)
          copy[key] = obj[key];
      }
      return copy;
    }
    function pluck(collection, key) {
      var result = isArray(collection) ? [] : {};
      forEach(collection, function(val, i) {
        result[i] = isFunction(key) ? key(val) : val[key];
      });
      return result;
    }
    function filter(collection, callback) {
      var array = isArray(collection);
      var result = array ? [] : {};
      forEach(collection, function(val, i) {
        if (callback(val, i)) {
          result[array ? result.length : i] = val;
        }
      });
      return result;
    }
    function map(collection, callback) {
      var result = isArray(collection) ? [] : {};
      forEach(collection, function(val, i) {
        result[i] = callback(val, i);
      });
      return result;
    }
    angular.module('ui.router.util', ['ng']);
    angular.module('ui.router.router', ['ui.router.util']);
    angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);
    angular.module('ui.router', ['ui.router.state']);
    angular.module('ui.router.compat', ['ui.router']);
    $Resolve.$inject = ['$q', '$injector'];
    function $Resolve($q, $injector) {
      var VISIT_IN_PROGRESS = 1,
          VISIT_DONE = 2,
          NOTHING = {},
          NO_DEPENDENCIES = [],
          NO_LOCALS = NOTHING,
          NO_PARENT = extend($q.when(NOTHING), {
            $$promises: NOTHING,
            $$values: NOTHING
          });
      this.study = function(invocables) {
        if (!isObject(invocables))
          throw new Error("'invocables' must be an object");
        var invocableKeys = objectKeys(invocables || {});
        var plan = [],
            cycle = [],
            visited = {};
        function visit(value, key) {
          if (visited[key] === VISIT_DONE)
            return;
          cycle.push(key);
          if (visited[key] === VISIT_IN_PROGRESS) {
            cycle.splice(0, indexOf(cycle, key));
            throw new Error("Cyclic dependency: " + cycle.join(" -> "));
          }
          visited[key] = VISIT_IN_PROGRESS;
          if (isString(value)) {
            plan.push(key, [function() {
              return $injector.get(value);
            }], NO_DEPENDENCIES);
          } else {
            var params = $injector.annotate(value);
            forEach(params, function(param) {
              if (param !== key && invocables.hasOwnProperty(param))
                visit(invocables[param], param);
            });
            plan.push(key, value, params);
          }
          cycle.pop();
          visited[key] = VISIT_DONE;
        }
        forEach(invocables, visit);
        invocables = cycle = visited = null;
        function isResolve(value) {
          return isObject(value) && value.then && value.$$promises;
        }
        return function(locals, parent, self) {
          if (isResolve(locals) && self === undefined) {
            self = parent;
            parent = locals;
            locals = null;
          }
          if (!locals)
            locals = NO_LOCALS;
          else if (!isObject(locals)) {
            throw new Error("'locals' must be an object");
          }
          if (!parent)
            parent = NO_PARENT;
          else if (!isResolve(parent)) {
            throw new Error("'parent' must be a promise returned by $resolve.resolve()");
          }
          var resolution = $q.defer(),
              result = resolution.promise,
              promises = result.$$promises = {},
              values = extend({}, locals),
              wait = 1 + plan.length / 3,
              merged = false;
          function done() {
            if (!--wait) {
              if (!merged)
                merge(values, parent.$$values);
              result.$$values = values;
              result.$$promises = result.$$promises || true;
              delete result.$$inheritedValues;
              resolution.resolve(values);
            }
          }
          function fail(reason) {
            result.$$failure = reason;
            resolution.reject(reason);
          }
          if (isDefined(parent.$$failure)) {
            fail(parent.$$failure);
            return result;
          }
          if (parent.$$inheritedValues) {
            merge(values, omit(parent.$$inheritedValues, invocableKeys));
          }
          extend(promises, parent.$$promises);
          if (parent.$$values) {
            merged = merge(values, omit(parent.$$values, invocableKeys));
            result.$$inheritedValues = omit(parent.$$values, invocableKeys);
            done();
          } else {
            if (parent.$$inheritedValues) {
              result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys);
            }
            parent.then(done, fail);
          }
          for (var i = 0,
              ii = plan.length; i < ii; i += 3) {
            if (locals.hasOwnProperty(plan[i]))
              done();
            else
              invoke(plan[i], plan[i + 1], plan[i + 2]);
          }
          function invoke(key, invocable, params) {
            var invocation = $q.defer(),
                waitParams = 0;
            function onfailure(reason) {
              invocation.reject(reason);
              fail(reason);
            }
            forEach(params, function(dep) {
              if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
                waitParams++;
                promises[dep].then(function(result) {
                  values[dep] = result;
                  if (!(--waitParams))
                    proceed();
                }, onfailure);
              }
            });
            if (!waitParams)
              proceed();
            function proceed() {
              if (isDefined(result.$$failure))
                return;
              try {
                invocation.resolve($injector.invoke(invocable, self, values));
                invocation.promise.then(function(result) {
                  values[key] = result;
                  done();
                }, onfailure);
              } catch (e) {
                onfailure(e);
              }
            }
            promises[key] = invocation.promise;
          }
          return result;
        };
      };
      this.resolve = function(invocables, locals, parent, self) {
        return this.study(invocables)(locals, parent, self);
      };
    }
    angular.module('ui.router.util').service('$resolve', $Resolve);
    $TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
    function $TemplateFactory($http, $templateCache, $injector) {
      this.fromConfig = function(config, params, locals) {
        return (isDefined(config.template) ? this.fromString(config.template, params) : isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) : isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) : null);
      };
      this.fromString = function(template, params) {
        return isFunction(template) ? template(params) : template;
      };
      this.fromUrl = function(url, params) {
        if (isFunction(url))
          url = url(params);
        if (url == null)
          return null;
        else
          return $http.get(url, {
            cache: $templateCache,
            headers: {Accept: 'text/html'}
          }).then(function(response) {
            return response.data;
          });
      };
      this.fromProvider = function(provider, params, locals) {
        return $injector.invoke(provider, null, locals || {params: params});
      };
    }
    angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);
    var $$UMFP;
    function UrlMatcher(pattern, config, parentMatcher) {
      config = extend({params: {}}, isObject(config) ? config : {});
      var placeholder = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
          searchPlaceholder = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
          compiled = '^',
          last = 0,
          m,
          segments = this.segments = [],
          parentParams = parentMatcher ? parentMatcher.params : {},
          params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
          paramNames = [];
      function addParameter(id, type, config, location) {
        paramNames.push(id);
        if (parentParams[id])
          return parentParams[id];
        if (!/^\w+(-+\w+)*(?:\[\])?$/.test(id))
          throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
        if (params[id])
          throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
        params[id] = new $$UMFP.Param(id, type, config, location);
        return params[id];
      }
      function quoteRegExp(string, pattern, squash) {
        var surroundPattern = ['', ''],
            result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
        if (!pattern)
          return result;
        switch (squash) {
          case false:
            surroundPattern = ['(', ')'];
            break;
          case true:
            surroundPattern = ['?(', ')?'];
            break;
          default:
            surroundPattern = ['(' + squash + "|", ')?'];
            break;
        }
        return result + surroundPattern[0] + pattern + surroundPattern[1];
      }
      this.source = pattern;
      function matchDetails(m, isSearch) {
        var id,
            regexp,
            segment,
            type,
            cfg,
            arrayMode;
        id = m[2] || m[3];
        cfg = config.params[id];
        segment = pattern.substring(last, m.index);
        regexp = isSearch ? m[4] : m[4] || (m[1] == '*' ? '.*' : null);
        type = $$UMFP.type(regexp || "string") || inherit($$UMFP.type("string"), {pattern: new RegExp(regexp)});
        return {
          id: id,
          regexp: regexp,
          segment: segment,
          type: type,
          cfg: cfg
        };
      }
      var p,
          param,
          segment;
      while ((m = placeholder.exec(pattern))) {
        p = matchDetails(m, false);
        if (p.segment.indexOf('?') >= 0)
          break;
        param = addParameter(p.id, p.type, p.cfg, "path");
        compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash);
        segments.push(p.segment);
        last = placeholder.lastIndex;
      }
      segment = pattern.substring(last);
      var i = segment.indexOf('?');
      if (i >= 0) {
        var search = this.sourceSearch = segment.substring(i);
        segment = segment.substring(0, i);
        this.sourcePath = pattern.substring(0, last + i);
        if (search.length > 0) {
          last = 0;
          while ((m = searchPlaceholder.exec(search))) {
            p = matchDetails(m, true);
            param = addParameter(p.id, p.type, p.cfg, "search");
            last = placeholder.lastIndex;
          }
        }
      } else {
        this.sourcePath = pattern;
        this.sourceSearch = '';
      }
      compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
      segments.push(segment);
      this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
      this.prefix = segments[0];
      this.$$paramNames = paramNames;
    }
    UrlMatcher.prototype.concat = function(pattern, config) {
      var defaultConfig = {
        caseInsensitive: $$UMFP.caseInsensitive(),
        strict: $$UMFP.strictMode(),
        squash: $$UMFP.defaultSquashPolicy()
      };
      return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this);
    };
    UrlMatcher.prototype.toString = function() {
      return this.source;
    };
    UrlMatcher.prototype.exec = function(path, searchParams) {
      var m = this.regexp.exec(path);
      if (!m)
        return null;
      searchParams = searchParams || {};
      var paramNames = this.parameters(),
          nTotal = paramNames.length,
          nPath = this.segments.length - 1,
          values = {},
          i,
          j,
          cfg,
          paramName;
      if (nPath !== m.length - 1)
        throw new Error("Unbalanced capture group in route '" + this.source + "'");
      function decodePathArray(string) {
        function reverseString(str) {
          return str.split("").reverse().join("");
        }
        function unquoteDashes(str) {
          return str.replace(/\\-/, "-");
        }
        var split = reverseString(string).split(/-(?!\\)/);
        var allReversed = map(split, reverseString);
        return map(allReversed, unquoteDashes).reverse();
      }
      for (i = 0; i < nPath; i++) {
        paramName = paramNames[i];
        var param = this.params[paramName];
        var paramVal = m[i + 1];
        for (j = 0; j < param.replace; j++) {
          if (param.replace[j].from === paramVal)
            paramVal = param.replace[j].to;
        }
        if (paramVal && param.array === true)
          paramVal = decodePathArray(paramVal);
        values[paramName] = param.value(paramVal);
      }
      for (; i < nTotal; i++) {
        paramName = paramNames[i];
        values[paramName] = this.params[paramName].value(searchParams[paramName]);
      }
      return values;
    };
    UrlMatcher.prototype.parameters = function(param) {
      if (!isDefined(param))
        return this.$$paramNames;
      return this.params[param] || null;
    };
    UrlMatcher.prototype.validates = function(params) {
      return this.params.$$validates(params);
    };
    UrlMatcher.prototype.format = function(values) {
      values = values || {};
      var segments = this.segments,
          params = this.parameters(),
          paramset = this.params;
      if (!this.validates(values))
        return null;
      var i,
          search = false,
          nPath = segments.length - 1,
          nTotal = params.length,
          result = segments[0];
      function encodeDashes(str) {
        return encodeURIComponent(str).replace(/-/g, function(c) {
          return '%5C%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
      }
      for (i = 0; i < nTotal; i++) {
        var isPathParam = i < nPath;
        var name = params[i],
            param = paramset[name],
            value = param.value(values[name]);
        var isDefaultValue = param.isOptional && param.type.equals(param.value(), value);
        var squash = isDefaultValue ? param.squash : false;
        var encoded = param.type.encode(value);
        if (isPathParam) {
          var nextSegment = segments[i + 1];
          if (squash === false) {
            if (encoded != null) {
              if (isArray(encoded)) {
                result += map(encoded, encodeDashes).join("-");
              } else {
                result += encodeURIComponent(encoded);
              }
            }
            result += nextSegment;
          } else if (squash === true) {
            var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
            result += nextSegment.match(capture)[1];
          } else if (isString(squash)) {
            result += squash + nextSegment;
          }
        } else {
          if (encoded == null || (isDefaultValue && squash !== false))
            continue;
          if (!isArray(encoded))
            encoded = [encoded];
          encoded = map(encoded, encodeURIComponent).join('&' + name + '=');
          result += (search ? '&' : '?') + (name + '=' + encoded);
          search = true;
        }
      }
      return result;
    };
    function Type(config) {
      extend(this, config);
    }
    Type.prototype.is = function(val, key) {
      return true;
    };
    Type.prototype.encode = function(val, key) {
      return val;
    };
    Type.prototype.decode = function(val, key) {
      return val;
    };
    Type.prototype.equals = function(a, b) {
      return a == b;
    };
    Type.prototype.$subPattern = function() {
      var sub = this.pattern.toString();
      return sub.substr(1, sub.length - 2);
    };
    Type.prototype.pattern = /.*/;
    Type.prototype.toString = function() {
      return "{Type:" + this.name + "}";
    };
    Type.prototype.$asArray = function(mode, isSearch) {
      if (!mode)
        return this;
      if (mode === "auto" && !isSearch)
        throw new Error("'auto' array mode is for query parameters only");
      return new ArrayType(this, mode);
      function ArrayType(type, mode) {
        function bindTo(type, callbackName) {
          return function() {
            return type[callbackName].apply(type, arguments);
          };
        }
        function arrayWrap(val) {
          return isArray(val) ? val : (isDefined(val) ? [val] : []);
        }
        function arrayUnwrap(val) {
          switch (val.length) {
            case 0:
              return undefined;
            case 1:
              return mode === "auto" ? val[0] : val;
            default:
              return val;
          }
        }
        function falsey(val) {
          return !val;
        }
        function arrayHandler(callback, allTruthyMode) {
          return function handleArray(val) {
            val = arrayWrap(val);
            var result = map(val, callback);
            if (allTruthyMode === true)
              return filter(result, falsey).length === 0;
            return arrayUnwrap(result);
          };
        }
        function arrayEqualsHandler(callback) {
          return function handleArray(val1, val2) {
            var left = arrayWrap(val1),
                right = arrayWrap(val2);
            if (left.length !== right.length)
              return false;
            for (var i = 0; i < left.length; i++) {
              if (!callback(left[i], right[i]))
                return false;
            }
            return true;
          };
        }
        this.encode = arrayHandler(bindTo(type, 'encode'));
        this.decode = arrayHandler(bindTo(type, 'decode'));
        this.is = arrayHandler(bindTo(type, 'is'), true);
        this.equals = arrayEqualsHandler(bindTo(type, 'equals'));
        this.pattern = type.pattern;
        this.$arrayMode = mode;
      }
    };
    function $UrlMatcherFactory() {
      $$UMFP = this;
      var isCaseInsensitive = false,
          isStrictMode = true,
          defaultSquashPolicy = false;
      function valToString(val) {
        return val != null ? val.toString().replace(/\//g, "%2F") : val;
      }
      function valFromString(val) {
        return val != null ? val.toString().replace(/%2F/g, "/") : val;
      }
      function regexpMatches(val) {
        return this.pattern.test(val);
      }
      var $types = {},
          enqueue = true,
          typeQueue = [],
          injector,
          defaultTypes = {
            string: {
              encode: valToString,
              decode: valFromString,
              is: regexpMatches,
              pattern: /[^/]*/
            },
            int: {
              encode: valToString,
              decode: function(val) {
                return parseInt(val, 10);
              },
              is: function(val) {
                return isDefined(val) && this.decode(val.toString()) === val;
              },
              pattern: /\d+/
            },
            bool: {
              encode: function(val) {
                return val ? 1 : 0;
              },
              decode: function(val) {
                return parseInt(val, 10) !== 0;
              },
              is: function(val) {
                return val === true || val === false;
              },
              pattern: /0|1/
            },
            date: {
              encode: function(val) {
                if (!this.is(val))
                  return undefined;
                return [val.getFullYear(), ('0' + (val.getMonth() + 1)).slice(-2), ('0' + val.getDate()).slice(-2)].join("-");
              },
              decode: function(val) {
                if (this.is(val))
                  return val;
                var match = this.capture.exec(val);
                return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
              },
              is: function(val) {
                return val instanceof Date && !isNaN(val.valueOf());
              },
              equals: function(a, b) {
                return this.is(a) && this.is(b) && a.toISOString() === b.toISOString();
              },
              pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
              capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
            },
            json: {
              encode: angular.toJson,
              decode: angular.fromJson,
              is: angular.isObject,
              equals: angular.equals,
              pattern: /[^/]*/
            },
            any: {
              encode: angular.identity,
              decode: angular.identity,
              is: angular.identity,
              equals: angular.equals,
              pattern: /.*/
            }
          };
      function getDefaultConfig() {
        return {
          strict: isStrictMode,
          caseInsensitive: isCaseInsensitive
        };
      }
      function isInjectable(value) {
        return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
      }
      $UrlMatcherFactory.$$getDefaultValue = function(config) {
        if (!isInjectable(config.value))
          return config.value;
        if (!injector)
          throw new Error("Injectable functions cannot be called at configuration time");
        return injector.invoke(config.value);
      };
      this.caseInsensitive = function(value) {
        if (isDefined(value))
          isCaseInsensitive = value;
        return isCaseInsensitive;
      };
      this.strictMode = function(value) {
        if (isDefined(value))
          isStrictMode = value;
        return isStrictMode;
      };
      this.defaultSquashPolicy = function(value) {
        if (!isDefined(value))
          return defaultSquashPolicy;
        if (value !== true && value !== false && !isString(value))
          throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
        defaultSquashPolicy = value;
        return value;
      };
      this.compile = function(pattern, config) {
        return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
      };
      this.isMatcher = function(o) {
        if (!isObject(o))
          return false;
        var result = true;
        forEach(UrlMatcher.prototype, function(val, name) {
          if (isFunction(val)) {
            result = result && (isDefined(o[name]) && isFunction(o[name]));
          }
        });
        return result;
      };
      this.type = function(name, definition, definitionFn) {
        if (!isDefined(definition))
          return $types[name];
        if ($types.hasOwnProperty(name))
          throw new Error("A type named '" + name + "' has already been defined.");
        $types[name] = new Type(extend({name: name}, definition));
        if (definitionFn) {
          typeQueue.push({
            name: name,
            def: definitionFn
          });
          if (!enqueue)
            flushTypeQueue();
        }
        return this;
      };
      function flushTypeQueue() {
        while (typeQueue.length) {
          var type = typeQueue.shift();
          if (type.pattern)
            throw new Error("You cannot override a type's .pattern at runtime.");
          angular.extend($types[type.name], injector.invoke(type.def));
        }
      }
      forEach(defaultTypes, function(type, name) {
        $types[name] = new Type(extend({name: name}, type));
      });
      $types = inherit($types, {});
      this.$get = ['$injector', function($injector) {
        injector = $injector;
        enqueue = false;
        flushTypeQueue();
        forEach(defaultTypes, function(type, name) {
          if (!$types[name])
            $types[name] = new Type(type);
        });
        return this;
      }];
      this.Param = function Param(id, type, config, location) {
        var self = this;
        config = unwrapShorthand(config);
        type = getType(config, type, location);
        var arrayMode = getArrayMode();
        type = arrayMode ? type.$asArray(arrayMode, location === "search") : type;
        if (type.name === "string" && !arrayMode && location === "path" && config.value === undefined)
          config.value = "";
        var isOptional = config.value !== undefined;
        var squash = getSquashPolicy(config, isOptional);
        var replace = getReplace(config, arrayMode, isOptional, squash);
        function unwrapShorthand(config) {
          var keys = isObject(config) ? objectKeys(config) : [];
          var isShorthand = indexOf(keys, "value") === -1 && indexOf(keys, "type") === -1 && indexOf(keys, "squash") === -1 && indexOf(keys, "array") === -1;
          if (isShorthand)
            config = {value: config};
          config.$$fn = isInjectable(config.value) ? config.value : function() {
            return config.value;
          };
          return config;
        }
        function getType(config, urlType, location) {
          if (config.type && urlType)
            throw new Error("Param '" + id + "' has two type configurations.");
          if (urlType)
            return urlType;
          if (!config.type)
            return (location === "config" ? $types.any : $types.string);
          return config.type instanceof Type ? config.type : new Type(config.type);
        }
        function getArrayMode() {
          var arrayDefaults = {array: (location === "search" ? "auto" : false)};
          var arrayParamNomenclature = id.match(/\[\]$/) ? {array: true} : {};
          return extend(arrayDefaults, arrayParamNomenclature, config).array;
        }
        function getSquashPolicy(config, isOptional) {
          var squash = config.squash;
          if (!isOptional || squash === false)
            return false;
          if (!isDefined(squash) || squash == null)
            return defaultSquashPolicy;
          if (squash === true || isString(squash))
            return squash;
          throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
        }
        function getReplace(config, arrayMode, isOptional, squash) {
          var replace,
              configuredKeys,
              defaultPolicy = [{
                from: "",
                to: (isOptional || arrayMode ? undefined : "")
              }, {
                from: null,
                to: (isOptional || arrayMode ? undefined : "")
              }];
          replace = isArray(config.replace) ? config.replace : [];
          if (isString(squash))
            replace.push({
              from: squash,
              to: undefined
            });
          configuredKeys = map(replace, function(item) {
            return item.from;
          });
          return filter(defaultPolicy, function(item) {
            return indexOf(configuredKeys, item.from) === -1;
          }).concat(replace);
        }
        function $$getDefaultValue() {
          if (!injector)
            throw new Error("Injectable functions cannot be called at configuration time");
          return injector.invoke(config.$$fn);
        }
        function $value(value) {
          function hasReplaceVal(val) {
            return function(obj) {
              return obj.from === val;
            };
          }
          function $replace(value) {
            var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) {
              return obj.to;
            });
            return replacement.length ? replacement[0] : value;
          }
          value = $replace(value);
          return isDefined(value) ? self.type.decode(value) : $$getDefaultValue();
        }
        function toString() {
          return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}";
        }
        extend(this, {
          id: id,
          type: type,
          location: location,
          array: arrayMode,
          squash: squash,
          replace: replace,
          isOptional: isOptional,
          value: $value,
          dynamic: undefined,
          config: config,
          toString: toString
        });
      };
      function ParamSet(params) {
        extend(this, params || {});
      }
      ParamSet.prototype = {
        $$new: function() {
          return inherit(this, extend(new ParamSet(), {$$parent: this}));
        },
        $$keys: function() {
          var keys = [],
              chain = [],
              parent = this,
              ignore = objectKeys(ParamSet.prototype);
          while (parent) {
            chain.push(parent);
            parent = parent.$$parent;
          }
          chain.reverse();
          forEach(chain, function(paramset) {
            forEach(objectKeys(paramset), function(key) {
              if (indexOf(keys, key) === -1 && indexOf(ignore, key) === -1)
                keys.push(key);
            });
          });
          return keys;
        },
        $$values: function(paramValues) {
          var values = {},
              self = this;
          forEach(self.$$keys(), function(key) {
            values[key] = self[key].value(paramValues && paramValues[key]);
          });
          return values;
        },
        $$equals: function(paramValues1, paramValues2) {
          var equal = true,
              self = this;
          forEach(self.$$keys(), function(key) {
            var left = paramValues1 && paramValues1[key],
                right = paramValues2 && paramValues2[key];
            if (!self[key].type.equals(left, right))
              equal = false;
          });
          return equal;
        },
        $$validates: function $$validate(paramValues) {
          var result = true,
              isOptional,
              val,
              param,
              self = this;
          forEach(this.$$keys(), function(key) {
            param = self[key];
            val = paramValues[key];
            isOptional = !val && param.isOptional;
            result = result && (isOptional || !!param.type.is(val));
          });
          return result;
        },
        $$parent: undefined
      };
      this.ParamSet = ParamSet;
    }
    angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
    angular.module('ui.router.util').run(['$urlMatcherFactory', function($urlMatcherFactory) {}]);
    $UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
    function $UrlRouterProvider($locationProvider, $urlMatcherFactory) {
      var rules = [],
          otherwise = null,
          interceptDeferred = false,
          listener;
      function regExpPrefix(re) {
        var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
        return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
      }
      function interpolate(pattern, match) {
        return pattern.replace(/\$(\$|\d{1,2})/, function(m, what) {
          return match[what === '$' ? 0 : Number(what)];
        });
      }
      this.rule = function(rule) {
        if (!isFunction(rule))
          throw new Error("'rule' must be a function");
        rules.push(rule);
        return this;
      };
      this.otherwise = function(rule) {
        if (isString(rule)) {
          var redirect = rule;
          rule = function() {
            return redirect;
          };
        } else if (!isFunction(rule))
          throw new Error("'rule' must be a function");
        otherwise = rule;
        return this;
      };
      function handleIfMatch($injector, handler, match) {
        if (!match)
          return false;
        var result = $injector.invoke(handler, handler, {$match: match});
        return isDefined(result) ? result : true;
      }
      this.when = function(what, handler) {
        var redirect,
            handlerIsString = isString(handler);
        if (isString(what))
          what = $urlMatcherFactory.compile(what);
        if (!handlerIsString && !isFunction(handler) && !isArray(handler))
          throw new Error("invalid 'handler' in when()");
        var strategies = {
          matcher: function(what, handler) {
            if (handlerIsString) {
              redirect = $urlMatcherFactory.compile(handler);
              handler = ['$match', function($match) {
                return redirect.format($match);
              }];
            }
            return extend(function($injector, $location) {
              return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
            }, {prefix: isString(what.prefix) ? what.prefix : ''});
          },
          regex: function(what, handler) {
            if (what.global || what.sticky)
              throw new Error("when() RegExp must not be global or sticky");
            if (handlerIsString) {
              redirect = handler;
              handler = ['$match', function($match) {
                return interpolate(redirect, $match);
              }];
            }
            return extend(function($injector, $location) {
              return handleIfMatch($injector, handler, what.exec($location.path()));
            }, {prefix: regExpPrefix(what)});
          }
        };
        var check = {
          matcher: $urlMatcherFactory.isMatcher(what),
          regex: what instanceof RegExp
        };
        for (var n in check) {
          if (check[n])
            return this.rule(strategies[n](what, handler));
        }
        throw new Error("invalid 'what' in when()");
      };
      this.deferIntercept = function(defer) {
        if (defer === undefined)
          defer = true;
        interceptDeferred = defer;
      };
      this.$get = $get;
      $get.$inject = ['$location', '$rootScope', '$injector', '$browser'];
      function $get($location, $rootScope, $injector, $browser) {
        var baseHref = $browser.baseHref(),
            location = $location.url(),
            lastPushedUrl;
        function appendBasePath(url, isHtml5, absolute) {
          if (baseHref === '/')
            return url;
          if (isHtml5)
            return baseHref.slice(0, -1) + url;
          if (absolute)
            return baseHref.slice(1) + url;
          return url;
        }
        function update(evt) {
          if (evt && evt.defaultPrevented)
            return;
          var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
          lastPushedUrl = undefined;
          if (ignoreUpdate)
            return true;
          function check(rule) {
            var handled = rule($injector, $location);
            if (!handled)
              return false;
            if (isString(handled))
              $location.replace().url(handled);
            return true;
          }
          var n = rules.length,
              i;
          for (i = 0; i < n; i++) {
            if (check(rules[i]))
              return;
          }
          if (otherwise)
            check(otherwise);
        }
        function listen() {
          listener = listener || $rootScope.$on('$locationChangeSuccess', update);
          return listener;
        }
        if (!interceptDeferred)
          listen();
        return {
          sync: function() {
            update();
          },
          listen: function() {
            return listen();
          },
          update: function(read) {
            if (read) {
              location = $location.url();
              return;
            }
            if ($location.url() === location)
              return;
            $location.url(location);
            $location.replace();
          },
          push: function(urlMatcher, params, options) {
            $location.url(urlMatcher.format(params || {}));
            lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined;
            if (options && options.replace)
              $location.replace();
          },
          href: function(urlMatcher, params, options) {
            if (!urlMatcher.validates(params))
              return null;
            var isHtml5 = $locationProvider.html5Mode();
            if (angular.isObject(isHtml5)) {
              isHtml5 = isHtml5.enabled;
            }
            var url = urlMatcher.format(params);
            options = options || {};
            if (!isHtml5 && url !== null) {
              url = "#" + $locationProvider.hashPrefix() + url;
            }
            url = appendBasePath(url, isHtml5, options.absolute);
            if (!options.absolute || !url) {
              return url;
            }
            var slash = (!isHtml5 && url ? '/' : ''),
                port = $location.port();
            port = (port === 80 || port === 443 ? '' : ':' + port);
            return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
          }
        };
      }
    }
    angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);
    $StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
    function $StateProvider($urlRouterProvider, $urlMatcherFactory) {
      var root,
          states = {},
          $state,
          queue = {},
          abstractKey = 'abstract';
      var stateBuilder = {
        parent: function(state) {
          if (isDefined(state.parent) && state.parent)
            return findState(state.parent);
          var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
          return compositeName ? findState(compositeName[1]) : root;
        },
        data: function(state) {
          if (state.parent && state.parent.data) {
            state.data = state.self.data = extend({}, state.parent.data, state.data);
          }
          return state.data;
        },
        url: function(state) {
          var url = state.url,
              config = {params: state.params || {}};
          if (isString(url)) {
            if (url.charAt(0) == '^')
              return $urlMatcherFactory.compile(url.substring(1), config);
            return (state.parent.navigable || root).url.concat(url, config);
          }
          if (!url || $urlMatcherFactory.isMatcher(url))
            return url;
          throw new Error("Invalid url '" + url + "' in state '" + state + "'");
        },
        navigable: function(state) {
          return state.url ? state : (state.parent ? state.parent.navigable : null);
        },
        ownParams: function(state) {
          var params = state.url && state.url.params || new $$UMFP.ParamSet();
          forEach(state.params || {}, function(config, id) {
            if (!params[id])
              params[id] = new $$UMFP.Param(id, null, config, "config");
          });
          return params;
        },
        params: function(state) {
          return state.parent && state.parent.params ? extend(state.parent.params.$$new(), state.ownParams) : new $$UMFP.ParamSet();
        },
        views: function(state) {
          var views = {};
          forEach(isDefined(state.views) ? state.views : {'': state}, function(view, name) {
            if (name.indexOf('@') < 0)
              name += '@' + state.parent.name;
            views[name] = view;
          });
          return views;
        },
        path: function(state) {
          return state.parent ? state.parent.path.concat(state) : [];
        },
        includes: function(state) {
          var includes = state.parent ? extend({}, state.parent.includes) : {};
          includes[state.name] = true;
          return includes;
        },
        $delegates: {}
      };
      function isRelative(stateName) {
        return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
      }
      function findState(stateOrName, base) {
        if (!stateOrName)
          return undefined;
        var isStr = isString(stateOrName),
            name = isStr ? stateOrName : stateOrName.name,
            path = isRelative(name);
        if (path) {
          if (!base)
            throw new Error("No reference point given for path '" + name + "'");
          base = findState(base);
          var rel = name.split("."),
              i = 0,
              pathLength = rel.length,
              current = base;
          for (; i < pathLength; i++) {
            if (rel[i] === "" && i === 0) {
              current = base;
              continue;
            }
            if (rel[i] === "^") {
              if (!current.parent)
                throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
              current = current.parent;
              continue;
            }
            break;
          }
          rel = rel.slice(i).join(".");
          name = current.name + (current.name && rel ? "." : "") + rel;
        }
        var state = states[name];
        if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
          return state;
        }
        return undefined;
      }
      function queueState(parentName, state) {
        if (!queue[parentName]) {
          queue[parentName] = [];
        }
        queue[parentName].push(state);
      }
      function flushQueuedChildren(parentName) {
        var queued = queue[parentName] || [];
        while (queued.length) {
          registerState(queued.shift());
        }
      }
      function registerState(state) {
        state = inherit(state, {
          self: state,
          resolve: state.resolve || {},
          toString: function() {
            return this.name;
          }
        });
        var name = state.name;
        if (!isString(name) || name.indexOf('@') >= 0)
          throw new Error("State must have a valid name");
        if (states.hasOwnProperty(name))
          throw new Error("State '" + name + "'' is already defined");
        var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.')) : (isString(state.parent)) ? state.parent : (isObject(state.parent) && isString(state.parent.name)) ? state.parent.name : '';
        if (parentName && !states[parentName]) {
          return queueState(parentName, state.self);
        }
        for (var key in stateBuilder) {
          if (isFunction(stateBuilder[key]))
            state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
        }
        states[name] = state;
        if (!state[abstractKey] && state.url) {
          $urlRouterProvider.when(state.url, ['$match', '$stateParams', function($match, $stateParams) {
            if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
              $state.transitionTo(state, $match, {
                inherit: true,
                location: false
              });
            }
          }]);
        }
        flushQueuedChildren(name);
        return state;
      }
      function isGlob(text) {
        return text.indexOf('*') > -1;
      }
      function doesStateMatchGlob(glob) {
        var globSegments = glob.split('.'),
            segments = $state.$current.name.split('.');
        if (globSegments[0] === '**') {
          segments = segments.slice(indexOf(segments, globSegments[1]));
          segments.unshift('**');
        }
        if (globSegments[globSegments.length - 1] === '**') {
          segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
          segments.push('**');
        }
        if (globSegments.length != segments.length) {
          return false;
        }
        for (var i = 0,
            l = globSegments.length; i < l; i++) {
          if (globSegments[i] === '*') {
            segments[i] = '*';
          }
        }
        return segments.join('') === globSegments.join('');
      }
      root = registerState({
        name: '',
        url: '^',
        views: null,
        'abstract': true
      });
      root.navigable = null;
      this.decorator = decorator;
      function decorator(name, func) {
        if (isString(name) && !isDefined(func)) {
          return stateBuilder[name];
        }
        if (!isFunction(func) || !isString(name)) {
          return this;
        }
        if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
          stateBuilder.$delegates[name] = stateBuilder[name];
        }
        stateBuilder[name] = func;
        return this;
      }
      this.state = state;
      function state(name, definition) {
        if (isObject(name))
          definition = name;
        else
          definition.name = name;
        registerState(definition);
        return this;
      }
      this.$get = $get;
      $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter', '$location', '$urlMatcherFactory'];
      function $get($rootScope, $q, $view, $injector, $resolve, $stateParams, $urlRouter, $location, $urlMatcherFactory) {
        var TransitionSuperseded = $q.reject(new Error('transition superseded'));
        var TransitionPrevented = $q.reject(new Error('transition prevented'));
        var TransitionAborted = $q.reject(new Error('transition aborted'));
        var TransitionFailed = $q.reject(new Error('transition failed'));
        function handleRedirect(redirect, state, params, options) {
          var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);
          if (evt.defaultPrevented) {
            $urlRouter.update();
            return TransitionAborted;
          }
          if (!evt.retry) {
            return null;
          }
          if (options.$retry) {
            $urlRouter.update();
            return TransitionFailed;
          }
          var retryTransition = $state.transition = $q.when(evt.retry);
          retryTransition.then(function() {
            if (retryTransition !== $state.transition)
              return TransitionSuperseded;
            redirect.options.$retry = true;
            return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
          }, function() {
            return TransitionAborted;
          });
          $urlRouter.update();
          return retryTransition;
        }
        root.locals = {
          resolve: null,
          globals: {$stateParams: {}}
        };
        $state = {
          params: {},
          current: root.self,
          $current: root,
          transition: null
        };
        $state.reload = function reload() {
          return $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
          });
        };
        $state.go = function go(to, params, options) {
          return $state.transitionTo(to, params, extend({
            inherit: true,
            relative: $state.$current
          }, options));
        };
        $state.transitionTo = function transitionTo(to, toParams, options) {
          toParams = toParams || {};
          options = extend({
            location: true,
            inherit: false,
            relative: null,
            notify: true,
            reload: false,
            $retry: false
          }, options || {});
          var from = $state.$current,
              fromParams = $state.params,
              fromPath = from.path;
          var evt,
              toState = findState(to, options.relative);
          if (!isDefined(toState)) {
            var redirect = {
              to: to,
              toParams: toParams,
              options: options
            };
            var redirectResult = handleRedirect(redirect, from.self, fromParams, options);
            if (redirectResult) {
              return redirectResult;
            }
            to = redirect.to;
            toParams = redirect.toParams;
            options = redirect.options;
            toState = findState(to, options.relative);
            if (!isDefined(toState)) {
              if (!options.relative)
                throw new Error("No such state '" + to + "'");
              throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
            }
          }
          if (toState[abstractKey])
            throw new Error("Cannot transition to abstract state '" + to + "'");
          if (options.inherit)
            toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
          if (!toState.params.$$validates(toParams))
            return TransitionFailed;
          toParams = toState.params.$$values(toParams);
          to = toState;
          var toPath = to.path;
          var keep = 0,
              state = toPath[keep],
              locals = root.locals,
              toLocals = [];
          if (!options.reload) {
            while (state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams)) {
              locals = toLocals[keep] = state.locals;
              keep++;
              state = toPath[keep];
            }
          }
          if (shouldTriggerReload(to, from, locals, options)) {
            if (to.self.reloadOnSearch !== false)
              $urlRouter.update();
            $state.transition = null;
            return $q.when($state.current);
          }
          toParams = filterByKeys(to.params.$$keys(), toParams || {});
          if (options.notify) {
            if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams).defaultPrevented) {
              $urlRouter.update();
              return TransitionPrevented;
            }
          }
          var resolved = $q.when(locals);
          for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
            locals = toLocals[l] = inherit(locals);
            resolved = resolveState(state, toParams, state === to, resolved, locals, options);
          }
          var transition = $state.transition = resolved.then(function() {
            var l,
                entering,
                exiting;
            if ($state.transition !== transition)
              return TransitionSuperseded;
            for (l = fromPath.length - 1; l >= keep; l--) {
              exiting = fromPath[l];
              if (exiting.self.onExit) {
                $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
              }
              exiting.locals = null;
            }
            for (l = keep; l < toPath.length; l++) {
              entering = toPath[l];
              entering.locals = toLocals[l];
              if (entering.self.onEnter) {
                $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
              }
            }
            if ($state.transition !== transition)
              return TransitionSuperseded;
            $state.$current = to;
            $state.current = to.self;
            $state.params = toParams;
            copy($state.params, $stateParams);
            $state.transition = null;
            if (options.location && to.navigable) {
              $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
                $$avoidResync: true,
                replace: options.location === 'replace'
              });
            }
            if (options.notify) {
              $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
            }
            $urlRouter.update(true);
            return $state.current;
          }, function(error) {
            if ($state.transition !== transition)
              return TransitionSuperseded;
            $state.transition = null;
            evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
            if (!evt.defaultPrevented) {
              $urlRouter.update();
            }
            return $q.reject(error);
          });
          return transition;
        };
        $state.is = function is(stateOrName, params, options) {
          options = extend({relative: $state.$current}, options || {});
          var state = findState(stateOrName, options.relative);
          if (!isDefined(state)) {
            return undefined;
          }
          if ($state.$current !== state) {
            return false;
          }
          return params ? equalForKeys(state.params.$$values(params), $stateParams) : true;
        };
        $state.includes = function includes(stateOrName, params, options) {
          options = extend({relative: $state.$current}, options || {});
          if (isString(stateOrName) && isGlob(stateOrName)) {
            if (!doesStateMatchGlob(stateOrName)) {
              return false;
            }
            stateOrName = $state.$current.name;
          }
          var state = findState(stateOrName, options.relative);
          if (!isDefined(state)) {
            return undefined;
          }
          if (!isDefined($state.$current.includes[state.name])) {
            return false;
          }
          return params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : true;
        };
        $state.href = function href(stateOrName, params, options) {
          options = extend({
            lossy: true,
            inherit: true,
            absolute: false,
            relative: $state.$current
          }, options || {});
          var state = findState(stateOrName, options.relative);
          if (!isDefined(state))
            return null;
          if (options.inherit)
            params = inheritParams($stateParams, params || {}, $state.$current, state);
          var nav = (state && options.lossy) ? state.navigable : state;
          if (!nav || nav.url === undefined || nav.url === null) {
            return null;
          }
          return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys(), params || {}), {absolute: options.absolute});
        };
        $state.get = function(stateOrName, context) {
          if (arguments.length === 0)
            return map(objectKeys(states), function(name) {
              return states[name].self;
            });
          var state = findState(stateOrName, context || $state.$current);
          return (state && state.self) ? state.self : null;
        };
        function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
          var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params.$$keys(), params);
          var locals = {$stateParams: $stateParams};
          dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
          var promises = [dst.resolve.then(function(globals) {
            dst.globals = globals;
          })];
          if (inherited)
            promises.push(inherited);
          forEach(state.views, function(view, name) {
            var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
            injectables.$template = [function() {
              return $view.load(name, {
                view: view,
                locals: locals,
                params: $stateParams,
                notify: options.notify
              }) || '';
            }];
            promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function(result) {
              if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
                var injectLocals = angular.extend({}, injectables, locals);
                result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
              } else {
                result.$$controller = view.controller;
              }
              result.$$state = state;
              result.$$controllerAs = view.controllerAs;
              dst[name] = result;
            }));
          });
          return $q.all(promises).then(function(values) {
            return dst;
          });
        }
        return $state;
      }
      function shouldTriggerReload(to, from, locals, options) {
        if (to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false))) {
          return true;
        }
      }
    }
    angular.module('ui.router.state').value('$stateParams', {}).provider('$state', $StateProvider);
    $ViewProvider.$inject = [];
    function $ViewProvider() {
      this.$get = $get;
      $get.$inject = ['$rootScope', '$templateFactory'];
      function $get($rootScope, $templateFactory) {
        return {load: function load(name, options) {
            var result,
                defaults = {
                  template: null,
                  controller: null,
                  view: null,
                  locals: null,
                  notify: true,
                  async: true,
                  params: {}
                };
            options = extend(defaults, options);
            if (options.view) {
              result = $templateFactory.fromConfig(options.view, options.params, options.locals);
            }
            if (result && options.notify) {
              $rootScope.$broadcast('$viewContentLoading', options);
            }
            return result;
          }};
      }
    }
    angular.module('ui.router.state').provider('$view', $ViewProvider);
    function $ViewScrollProvider() {
      var useAnchorScroll = false;
      this.useAnchorScroll = function() {
        useAnchorScroll = true;
      };
      this.$get = ['$anchorScroll', '$timeout', function($anchorScroll, $timeout) {
        if (useAnchorScroll) {
          return $anchorScroll;
        }
        return function($element) {
          $timeout(function() {
            $element[0].scrollIntoView();
          }, 0, false);
        };
      }];
    }
    angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);
    $ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate'];
    function $ViewDirective($state, $injector, $uiViewScroll, $interpolate) {
      function getService() {
        return ($injector.has) ? function(service) {
          return $injector.has(service) ? $injector.get(service) : null;
        } : function(service) {
          try {
            return $injector.get(service);
          } catch (e) {
            return null;
          }
        };
      }
      var service = getService(),
          $animator = service('$animator'),
          $animate = service('$animate');
      function getRenderer(attrs, scope) {
        var statics = function() {
          return {
            enter: function(element, target, cb) {
              target.after(element);
              cb();
            },
            leave: function(element, cb) {
              element.remove();
              cb();
            }
          };
        };
        if ($animate) {
          return {
            enter: function(element, target, cb) {
              var promise = $animate.enter(element, null, target, cb);
              if (promise && promise.then)
                promise.then(cb);
            },
            leave: function(element, cb) {
              var promise = $animate.leave(element, cb);
              if (promise && promise.then)
                promise.then(cb);
            }
          };
        }
        if ($animator) {
          var animate = $animator && $animator(scope, attrs);
          return {
            enter: function(element, target, cb) {
              animate.enter(element, null, target);
              cb();
            },
            leave: function(element, cb) {
              animate.leave(element);
              cb();
            }
          };
        }
        return statics();
      }
      var directive = {
        restrict: 'ECA',
        terminal: true,
        priority: 400,
        transclude: 'element',
        compile: function(tElement, tAttrs, $transclude) {
          return function(scope, $element, attrs) {
            var previousEl,
                currentEl,
                currentScope,
                latestLocals,
                onloadExp = attrs.onload || '',
                autoScrollExp = attrs.autoscroll,
                renderer = getRenderer(attrs, scope);
            scope.$on('$stateChangeSuccess', function() {
              updateView(false);
            });
            scope.$on('$viewContentLoading', function() {
              updateView(false);
            });
            updateView(true);
            function cleanupLastView() {
              if (previousEl) {
                previousEl.remove();
                previousEl = null;
              }
              if (currentScope) {
                currentScope.$destroy();
                currentScope = null;
              }
              if (currentEl) {
                renderer.leave(currentEl, function() {
                  previousEl = null;
                });
                previousEl = currentEl;
                currentEl = null;
              }
            }
            function updateView(firstTime) {
              var newScope,
                  name = getUiViewName(scope, attrs, $element, $interpolate),
                  previousLocals = name && $state.$current && $state.$current.locals[name];
              if (!firstTime && previousLocals === latestLocals)
                return;
              newScope = scope.$new();
              latestLocals = $state.$current.locals[name];
              var clone = $transclude(newScope, function(clone) {
                renderer.enter(clone, $element, function onUiViewEnter() {
                  if (currentScope) {
                    currentScope.$emit('$viewContentAnimationEnded');
                  }
                  if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                    $uiViewScroll(clone);
                  }
                });
                cleanupLastView();
              });
              currentEl = clone;
              currentScope = newScope;
              currentScope.$emit('$viewContentLoaded');
              currentScope.$eval(onloadExp);
            }
          };
        }
      };
      return directive;
    }
    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
    function $ViewDirectiveFill($compile, $controller, $state, $interpolate) {
      return {
        restrict: 'ECA',
        priority: -400,
        compile: function(tElement) {
          var initial = tElement.html();
          return function(scope, $element, attrs) {
            var current = $state.$current,
                name = getUiViewName(scope, attrs, $element, $interpolate),
                locals = current && current.locals[name];
            if (!locals) {
              return;
            }
            $element.data('$uiView', {
              name: name,
              state: locals.$$state
            });
            $element.html(locals.$template ? locals.$template : initial);
            var link = $compile($element.contents());
            if (locals.$$controller) {
              locals.$scope = scope;
              var controller = $controller(locals.$$controller, locals);
              if (locals.$$controllerAs) {
                scope[locals.$$controllerAs] = controller;
              }
              $element.data('$ngControllerController', controller);
              $element.children().data('$ngControllerController', controller);
            }
            link(scope);
          };
        }
      };
    }
    function getUiViewName(scope, attrs, element, $interpolate) {
      var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
      var inherited = element.inheritedData('$uiView');
      return name.indexOf('@') >= 0 ? name : (name + '@' + (inherited ? inherited.state.name : ''));
    }
    angular.module('ui.router.state').directive('uiView', $ViewDirective);
    angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);
    function parseStateRef(ref, current) {
      var preparsed = ref.match(/^\s*({[^}]*})\s*$/),
          parsed;
      if (preparsed)
        ref = current + '(' + preparsed[1] + ')';
      parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
      if (!parsed || parsed.length !== 4)
        throw new Error("Invalid state ref '" + ref + "'");
      return {
        state: parsed[1],
        paramExpr: parsed[3] || null
      };
    }
    function stateContext(el) {
      var stateData = el.parent().inheritedData('$uiView');
      if (stateData && stateData.state && stateData.state.name) {
        return stateData.state;
      }
    }
    $StateRefDirective.$inject = ['$state', '$timeout'];
    function $StateRefDirective($state, $timeout) {
      var allowedOptions = ['location', 'inherit', 'reload'];
      return {
        restrict: 'A',
        require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
        link: function(scope, element, attrs, uiSrefActive) {
          var ref = parseStateRef(attrs.uiSref, $state.current.name);
          var params = null,
              url = null,
              base = stateContext(element) || $state.$current;
          var newHref = null,
              isAnchor = element.prop("tagName") === "A";
          var isForm = element[0].nodeName === "FORM";
          var attr = isForm ? "action" : "href",
              nav = true;
          var options = {
            relative: base,
            inherit: true
          };
          var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
          angular.forEach(allowedOptions, function(option) {
            if (option in optionsOverride) {
              options[option] = optionsOverride[option];
            }
          });
          var update = function(newVal) {
            if (newVal)
              params = angular.copy(newVal);
            if (!nav)
              return;
            newHref = $state.href(ref.state, params, options);
            var activeDirective = uiSrefActive[1] || uiSrefActive[0];
            if (activeDirective) {
              activeDirective.$$setStateInfo(ref.state, params);
            }
            if (newHref === null) {
              nav = false;
              return false;
            }
            attrs.$set(attr, newHref);
          };
          if (ref.paramExpr) {
            scope.$watch(ref.paramExpr, function(newVal, oldVal) {
              if (newVal !== params)
                update(newVal);
            }, true);
            params = angular.copy(scope.$eval(ref.paramExpr));
          }
          update();
          if (isForm)
            return;
          element.bind("click", function(e) {
            var button = e.which || e.button;
            if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target'))) {
              var transition = $timeout(function() {
                $state.go(ref.state, params, options);
              });
              e.preventDefault();
              var ignorePreventDefaultCount = isAnchor && !newHref ? 1 : 0;
              e.preventDefault = function() {
                if (ignorePreventDefaultCount-- <= 0)
                  $timeout.cancel(transition);
              };
            }
          });
        }
      };
    }
    $StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
    function $StateRefActiveDirective($state, $stateParams, $interpolate) {
      return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var state,
              params,
              activeClass;
          activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || '', false)($scope);
          this.$$setStateInfo = function(newState, newParams) {
            state = $state.get(newState, stateContext($element));
            params = newParams;
            update();
          };
          $scope.$on('$stateChangeSuccess', update);
          function update() {
            if (isMatch()) {
              $element.addClass(activeClass);
            } else {
              $element.removeClass(activeClass);
            }
          }
          function isMatch() {
            if (typeof $attrs.uiSrefActiveEq !== 'undefined') {
              return state && $state.is(state.name, params);
            } else {
              return state && $state.includes(state.name, params);
            }
          }
        }]
      };
    }
    angular.module('ui.router.state').directive('uiSref', $StateRefDirective).directive('uiSrefActive', $StateRefActiveDirective).directive('uiSrefActiveEq', $StateRefActiveDirective);
    $IsStateFilter.$inject = ['$state'];
    function $IsStateFilter($state) {
      var isFilter = function(state) {
        return $state.is(state);
      };
      isFilter.$stateful = true;
      return isFilter;
    }
    $IncludedByStateFilter.$inject = ['$state'];
    function $IncludedByStateFilter($state) {
      var includesFilter = function(state) {
        return $state.includes(state);
      };
      includesFilter.$stateful = true;
      return includesFilter;
    }
    angular.module('ui.router.state').filter('isState', $IsStateFilter).filter('includedByState', $IncludedByStateFilter);
  })(window, window.angular);
  (function() {
    var deprecated = {
      method: function(msg, log, fn) {
        var called = false;
        return function deprecatedMethod() {
          if (!called) {
            called = true;
            log(msg);
          }
          return fn.apply(this, arguments);
        };
      },
      field: function(msg, log, parent, field, val) {
        var called = false;
        var getter = function() {
          if (!called) {
            called = true;
            log(msg);
          }
          return val;
        };
        var setter = function(v) {
          if (!called) {
            called = true;
            log(msg);
          }
          val = v;
          return v;
        };
        Object.defineProperty(parent, field, {
          get: getter,
          set: setter,
          enumerable: true
        });
        return;
      }
    };
    var IonicModule = angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']),
        extend = angular.extend,
        forEach = angular.forEach,
        isDefined = angular.isDefined,
        isNumber = angular.isNumber,
        isString = angular.isString,
        jqLite = angular.element;
    IonicModule.factory('$ionicActionSheet', ['$rootScope', '$compile', '$animate', '$timeout', '$ionicTemplateLoader', '$ionicPlatform', '$ionicBody', function($rootScope, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform, $ionicBody) {
      return {show: actionSheet};
      function actionSheet(opts) {
        var scope = $rootScope.$new(true);
        angular.extend(scope, {
          cancel: angular.noop,
          destructiveButtonClicked: angular.noop,
          buttonClicked: angular.noop,
          $deregisterBackButton: angular.noop,
          buttons: [],
          cancelOnStateChange: true
        }, opts || {});
        var element = scope.element = $compile('<ion-action-sheet ng-class="cssClass" buttons="buttons"></ion-action-sheet>')(scope);
        var sheetEl = jqLite(element[0].querySelector('.action-sheet-wrapper'));
        var stateChangeListenDone = scope.cancelOnStateChange ? $rootScope.$on('$stateChangeSuccess', function() {
          scope.cancel();
        }) : angular.noop;
        scope.removeSheet = function(done) {
          if (scope.removed)
            return;
          scope.removed = true;
          sheetEl.removeClass('action-sheet-up');
          $timeout(function() {
            $ionicBody.removeClass('action-sheet-open');
          }, 400);
          scope.$deregisterBackButton();
          stateChangeListenDone();
          $animate.removeClass(element, 'active').then(function() {
            scope.$destroy();
            element.remove();
            scope.cancel.$scope = sheetEl = null;
            (done || angular.noop)();
          });
        };
        scope.showSheet = function(done) {
          if (scope.removed)
            return;
          $ionicBody.append(element).addClass('action-sheet-open');
          $animate.addClass(element, 'active').then(function() {
            if (scope.removed)
              return;
            (done || angular.noop)();
          });
          $timeout(function() {
            if (scope.removed)
              return;
            sheetEl.addClass('action-sheet-up');
          }, 20, false);
        };
        scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(function() {
          $timeout(scope.cancel);
        }, PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET);
        scope.cancel = function() {
          scope.removeSheet(opts.cancel);
        };
        scope.buttonClicked = function(index) {
          if (opts.buttonClicked(index, opts.buttons[index]) === true) {
            scope.removeSheet();
          }
        };
        scope.destructiveButtonClicked = function() {
          if (opts.destructiveButtonClicked() === true) {
            scope.removeSheet();
          }
        };
        scope.showSheet();
        scope.cancel.$scope = scope;
        return scope.cancel;
      }
    }]);
    jqLite.prototype.addClass = function(cssClasses) {
      var x,
          y,
          cssClass,
          el,
          splitClasses,
          existingClasses;
      if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
        for (x = 0; x < this.length; x++) {
          el = this[x];
          if (el.setAttribute) {
            if (cssClasses.indexOf(' ') < 0 && el.classList.add) {
              el.classList.add(cssClasses);
            } else {
              existingClasses = (' ' + (el.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, " ");
              splitClasses = cssClasses.split(' ');
              for (y = 0; y < splitClasses.length; y++) {
                cssClass = splitClasses[y].trim();
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                  existingClasses += cssClass + ' ';
                }
              }
              el.setAttribute('class', existingClasses.trim());
            }
          }
        }
      }
      return this;
    };
    jqLite.prototype.removeClass = function(cssClasses) {
      var x,
          y,
          splitClasses,
          cssClass,
          el;
      if (cssClasses) {
        for (x = 0; x < this.length; x++) {
          el = this[x];
          if (el.getAttribute) {
            if (cssClasses.indexOf(' ') < 0 && el.classList.remove) {
              el.classList.remove(cssClasses);
            } else {
              splitClasses = cssClasses.split(' ');
              for (y = 0; y < splitClasses.length; y++) {
                cssClass = splitClasses[y];
                el.setAttribute('class', ((" " + (el.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").replace(" " + cssClass.trim() + " ", " ")).trim());
              }
            }
          }
        }
      }
      return this;
    };
    IonicModule.factory('$$ionicAttachDrag', [function() {
      return attachDrag;
      function attachDrag(scope, element, options) {
        var opts = extend({}, {
          getDistance: function() {
            return opts.element.prop('offsetWidth');
          },
          onDragStart: angular.noop,
          onDrag: angular.noop,
          onDragEnd: angular.noop
        }, options);
        var dragStartGesture = ionic.onGesture('dragstart', handleDragStart, element[0]);
        var dragGesture = ionic.onGesture('drag', handleDrag, element[0]);
        var dragEndGesture = ionic.onGesture('dragend', handleDragEnd, element[0]);
        scope.$on('$destroy', function() {
          ionic.offGesture(dragStartGesture, 'dragstart', handleDragStart);
          ionic.offGesture(dragGesture, 'drag', handleDrag);
          ionic.offGesture(dragEndGesture, 'dragend', handleDragEnd);
        });
        var isDragging = false;
        element.on('touchmove pointermove mousemove', function(ev) {
          if (isDragging)
            ev.preventDefault();
        });
        element.on('touchend mouseup mouseleave', function(ev) {
          isDragging = false;
        });
        var dragState;
        function handleDragStart(ev) {
          if (dragState)
            return;
          if (opts.onDragStart() !== false) {
            dragState = {
              startX: ev.gesture.center.pageX,
              startY: ev.gesture.center.pageY,
              distance: opts.getDistance()
            };
          }
        }
        function handleDrag(ev) {
          if (!dragState)
            return;
          var deltaX = dragState.startX - ev.gesture.center.pageX;
          var deltaY = dragState.startY - ev.gesture.center.pageY;
          var isVertical = ev.gesture.direction === 'up' || ev.gesture.direction === 'down';
          if (isVertical && Math.abs(deltaY) > Math.abs(deltaX) * 2) {
            handleDragEnd(ev);
            return;
          }
          if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
            isDragging = true;
          }
          var percent = getDragPercent(ev.gesture.center.pageX);
          opts.onDrag(percent);
        }
        function handleDragEnd(ev) {
          if (!dragState)
            return;
          var percent = getDragPercent(ev.gesture.center.pageX);
          options.onDragEnd(percent, ev.gesture.velocityX);
          dragState = null;
        }
        function getDragPercent(x) {
          var delta = dragState.startX - x;
          var percent = delta / dragState.distance;
          return percent;
        }
      }
    }]);
    IonicModule.factory('$ionicBackdrop', ['$document', '$timeout', function($document, $timeout) {
      var el = jqLite('<div class="backdrop">');
      var backdropHolds = 0;
      $document[0].body.appendChild(el[0]);
      return {
        retain: retain,
        release: release,
        getElement: getElement,
        _element: el
      };
      function retain() {
        if ((++backdropHolds) === 1) {
          el.addClass('visible');
          ionic.requestAnimationFrame(function() {
            backdropHolds && el.addClass('active');
          });
        }
      }
      function release() {
        if ((--backdropHolds) === 0) {
          el.removeClass('active');
          $timeout(function() {
            !backdropHolds && el.removeClass('visible');
          }, 400, false);
        }
      }
      function getElement() {
        return el;
      }
    }]);
    IonicModule.factory('$ionicBind', ['$parse', '$interpolate', function($parse, $interpolate) {
      var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
      return function(scope, attrs, bindDefinition) {
        forEach(bindDefinition || {}, function(definition, scopeName) {
          var match = definition.match(LOCAL_REGEXP) || [],
              attrName = match[3] || scopeName,
              mode = match[1],
              parentGet,
              unwatch;
          switch (mode) {
            case '@':
              if (!attrs[attrName]) {
                return;
              }
              attrs.$observe(attrName, function(value) {
                scope[scopeName] = value;
              });
              if (attrs[attrName]) {
                scope[scopeName] = $interpolate(attrs[attrName])(scope);
              }
              break;
            case '=':
              if (!attrs[attrName]) {
                return;
              }
              unwatch = scope.$watch(attrs[attrName], function(value) {
                scope[scopeName] = value;
              });
              scope.$on('$destroy', unwatch);
              break;
            case '&':
              if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
                throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' + attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
              }
              parentGet = $parse(attrs[attrName]);
              scope[scopeName] = function(locals) {
                return parentGet(scope, locals);
              };
              break;
          }
        });
      };
    }]);
    IonicModule.factory('$ionicBody', ['$document', function($document) {
      return {
        addClass: function() {
          for (var x = 0; x < arguments.length; x++) {
            $document[0].body.classList.add(arguments[x]);
          }
          return this;
        },
        removeClass: function() {
          for (var x = 0; x < arguments.length; x++) {
            $document[0].body.classList.remove(arguments[x]);
          }
          return this;
        },
        enableClass: function(shouldEnableClass) {
          var args = Array.prototype.slice.call(arguments).slice(1);
          if (shouldEnableClass) {
            this.addClass.apply(this, args);
          } else {
            this.removeClass.apply(this, args);
          }
          return this;
        },
        append: function(ele) {
          $document[0].body.appendChild(ele.length ? ele[0] : ele);
          return this;
        },
        get: function() {
          return $document[0].body;
        }
      };
    }]);
    IonicModule.factory('$ionicClickBlock', ['$document', '$ionicBody', '$timeout', function($document, $ionicBody, $timeout) {
      var CSS_HIDE = 'click-block-hide';
      var cbEle,
          fallbackTimer,
          pendingShow;
      function addClickBlock() {
        if (pendingShow) {
          if (cbEle) {
            cbEle.classList.remove(CSS_HIDE);
          } else {
            cbEle = $document[0].createElement('div');
            cbEle.className = 'click-block';
            $ionicBody.append(cbEle);
          }
          pendingShow = false;
        }
      }
      function removeClickBlock() {
        cbEle && cbEle.classList.add(CSS_HIDE);
      }
      return {
        show: function(autoExpire) {
          pendingShow = true;
          $timeout.cancel(fallbackTimer);
          fallbackTimer = $timeout(this.hide, autoExpire || 310);
          ionic.requestAnimationFrame(addClickBlock);
        },
        hide: function() {
          pendingShow = false;
          $timeout.cancel(fallbackTimer);
          ionic.requestAnimationFrame(removeClickBlock);
        }
      };
    }]);
    IonicModule.factory('$collectionDataSource', ['$cacheFactory', '$parse', '$rootScope', function($cacheFactory, $parse, $rootScope) {
      function hideWithTransform(element) {
        element.css(ionic.CSS.TRANSFORM, 'translate3d(-2000px,-2000px,0)');
      }
      function CollectionRepeatDataSource(options) {
        var self = this;
        this.scope = options.scope;
        this.transcludeFn = options.transcludeFn;
        this.transcludeParent = options.transcludeParent;
        this.element = options.element;
        this.keyExpr = options.keyExpr;
        this.listExpr = options.listExpr;
        this.trackByExpr = options.trackByExpr;
        this.heightGetter = options.heightGetter;
        this.widthGetter = options.widthGetter;
        this.dimensions = [];
        this.data = [];
        this.attachedItems = {};
        this.BACKUP_ITEMS_LENGTH = 20;
        this.backupItemsArray = [];
      }
      CollectionRepeatDataSource.prototype = {
        setup: function() {
          if (this.isSetup)
            return;
          this.isSetup = true;
          for (var i = 0; i < this.BACKUP_ITEMS_LENGTH; i++) {
            this.detachItem(this.createItem());
          }
        },
        destroy: function() {
          this.dimensions.length = 0;
          this.data = null;
          this.backupItemsArray.length = 0;
          this.attachedItems = {};
        },
        calculateDataDimensions: function() {
          var locals = {};
          this.dimensions = this.data.map(function(value, index) {
            locals[this.keyExpr] = value;
            locals.$index = index;
            return {
              width: this.widthGetter(this.scope, locals),
              height: this.heightGetter(this.scope, locals)
            };
          }, this);
          this.dimensions = this.beforeSiblings.concat(this.dimensions).concat(this.afterSiblings);
          this.dataStartIndex = this.beforeSiblings.length;
        },
        createItem: function() {
          var item = {};
          item.scope = this.scope.$new();
          this.transcludeFn(item.scope, function(clone) {
            clone.css('position', 'absolute');
            item.element = clone;
          });
          this.transcludeParent.append(item.element);
          return item;
        },
        getItem: function(index) {
          var item;
          if ((item = this.attachedItems[index])) {} else if ((item = this.backupItemsArray.pop())) {
            ionic.Utils.reconnectScope(item.scope);
          } else {
            item = this.createItem();
          }
          return item;
        },
        attachItemAtIndex: function(index) {
          if (index < this.dataStartIndex) {
            return this.beforeSiblings[index];
          }
          index -= this.dataStartIndex;
          if (index > this.data.length - 1) {
            return this.afterSiblings[index - this.dataStartIndex];
          }
          var item = this.getItem(index);
          var value = this.data[index];
          if (item.index !== index || item.scope[this.keyExpr] !== value) {
            item.index = item.scope.$index = index;
            item.scope[this.keyExpr] = value;
            item.scope.$first = (index === 0);
            item.scope.$last = (index === (this.getLength() - 1));
            item.scope.$middle = !(item.scope.$first || item.scope.$last);
            item.scope.$odd = !(item.scope.$even = (index & 1) === 0);
            if (!$rootScope.$$phase) {
              item.scope.$digest();
            }
          }
          this.attachedItems[index] = item;
          return item;
        },
        destroyItem: function(item) {
          item.element.remove();
          item.scope.$destroy();
          item.scope = null;
          item.element = null;
        },
        detachItem: function(item) {
          delete this.attachedItems[item.index];
          if (item.isOutside) {
            hideWithTransform(item.element);
          } else if (this.backupItemsArray.length >= this.BACKUP_ITEMS_LENGTH) {
            this.destroyItem(item);
          } else {
            this.backupItemsArray.push(item);
            hideWithTransform(item.element);
            ionic.Utils.disconnectScope(item.scope);
          }
        },
        getLength: function() {
          return this.dimensions && this.dimensions.length || 0;
        },
        setData: function(value, beforeSiblings, afterSiblings) {
          this.data = value || [];
          this.beforeSiblings = beforeSiblings || [];
          this.afterSiblings = afterSiblings || [];
          this.calculateDataDimensions();
          this.afterSiblings.forEach(function(item) {
            item.element.css({
              position: 'absolute',
              top: '0',
              left: '0'
            });
            hideWithTransform(item.element);
          });
        }
      };
      return CollectionRepeatDataSource;
    }]);
    IonicModule.factory('$collectionRepeatManager', ['$rootScope', '$timeout', function($rootScope, $timeout) {
      function CollectionRepeatManager(options) {
        var self = this;
        this.dataSource = options.dataSource;
        this.element = options.element;
        this.scrollView = options.scrollView;
        this.isVertical = !!this.scrollView.options.scrollingY;
        this.renderedItems = {};
        this.dimensions = [];
        this.setCurrentIndex(0);
        this.scrollView.__$callback = this.scrollView.__callback;
        this.scrollView.__callback = angular.bind(this, this.renderScroll);
        function getViewportSize() {
          return self.viewportSize;
        }
        if (this.isVertical) {
          this.scrollView.options.getContentHeight = getViewportSize;
          this.scrollValue = function() {
            return this.scrollView.__scrollTop;
          };
          this.scrollMaxValue = function() {
            return this.scrollView.__maxScrollTop;
          };
          this.scrollSize = function() {
            return this.scrollView.__clientHeight;
          };
          this.secondaryScrollSize = function() {
            return this.scrollView.__clientWidth;
          };
          this.transformString = function(y, x) {
            return 'translate3d(' + x + 'px,' + y + 'px,0)';
          };
          this.primaryDimension = function(dim) {
            return dim.height;
          };
          this.secondaryDimension = function(dim) {
            return dim.width;
          };
        } else {
          this.scrollView.options.getContentWidth = getViewportSize;
          this.scrollValue = function() {
            return this.scrollView.__scrollLeft;
          };
          this.scrollMaxValue = function() {
            return this.scrollView.__maxScrollLeft;
          };
          this.scrollSize = function() {
            return this.scrollView.__clientWidth;
          };
          this.secondaryScrollSize = function() {
            return this.scrollView.__clientHeight;
          };
          this.transformString = function(x, y) {
            return 'translate3d(' + x + 'px,' + y + 'px,0)';
          };
          this.primaryDimension = function(dim) {
            return dim.width;
          };
          this.secondaryDimension = function(dim) {
            return dim.height;
          };
        }
      }
      CollectionRepeatManager.prototype = {
        destroy: function() {
          this.renderedItems = {};
          this.render = angular.noop;
          this.calculateDimensions = angular.noop;
          this.dimensions = [];
        },
        calculateDimensions: function() {
          var primaryPos = 0;
          var secondaryPos = 0;
          var secondaryScrollSize = this.secondaryScrollSize();
          var previousItem;
          this.dataSource.beforeSiblings && this.dataSource.beforeSiblings.forEach(calculateSize, this);
          var beforeSize = primaryPos + (previousItem ? previousItem.primarySize : 0);
          primaryPos = secondaryPos = 0;
          previousItem = null;
          var dimensions = this.dataSource.dimensions.map(calculateSize, this);
          var totalSize = primaryPos + (previousItem ? previousItem.primarySize : 0);
          return {
            beforeSize: beforeSize,
            totalSize: totalSize,
            dimensions: dimensions
          };
          function calculateSize(dim) {
            var rect = {
              primarySize: this.primaryDimension(dim),
              secondarySize: Math.min(this.secondaryDimension(dim), secondaryScrollSize)
            };
            if (previousItem) {
              secondaryPos += previousItem.secondarySize;
              if (previousItem.primaryPos === primaryPos && secondaryPos + rect.secondarySize > secondaryScrollSize) {
                secondaryPos = 0;
                primaryPos += previousItem.primarySize;
              }
            }
            rect.primaryPos = primaryPos;
            rect.secondaryPos = secondaryPos;
            previousItem = rect;
            return rect;
          }
        },
        resize: function() {
          var result = this.calculateDimensions();
          this.dimensions = result.dimensions;
          this.viewportSize = result.totalSize;
          this.beforeSize = result.beforeSize;
          this.setCurrentIndex(0);
          this.render(true);
          this.dataSource.setup();
        },
        setCurrentIndex: function(index, height) {
          var currentPos = (this.dimensions[index] || {}).primaryPos || 0;
          this.currentIndex = index;
          this.hasPrevIndex = index > 0;
          if (this.hasPrevIndex) {
            this.previousPos = Math.max(currentPos - this.dimensions[index - 1].primarySize, this.dimensions[index - 1].primaryPos);
          }
          this.hasNextIndex = index + 1 < this.dataSource.getLength();
          if (this.hasNextIndex) {
            this.nextPos = Math.min(currentPos + this.dimensions[index + 1].primarySize, this.dimensions[index + 1].primaryPos);
          }
        },
        renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
          if (this.isVertical) {
            this.renderIfNeeded(transformTop);
          } else {
            this.renderIfNeeded(transformLeft);
          }
          return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
        }),
        renderIfNeeded: function(scrollPos) {
          if ((this.hasNextIndex && scrollPos >= this.nextPos) || (this.hasPrevIndex && scrollPos < this.previousPos)) {
            this.render();
          }
        },
        getIndexForScrollValue: function(i, scrollValue) {
          var rect;
          if (scrollValue <= this.dimensions[i].primaryPos) {
            while ((rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
              i--;
            }
          } else {
            while ((rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
              i++;
            }
          }
          return i;
        },
        render: function(shouldRedrawAll) {
          var self = this;
          var i;
          var isOutOfBounds = (this.currentIndex >= this.dataSource.getLength());
          if (isOutOfBounds || shouldRedrawAll) {
            for (i in this.renderedItems) {
              this.removeItem(i);
            }
            if (isOutOfBounds)
              return;
          }
          var rect;
          var scrollValue = this.scrollValue();
          var scrollSize = this.scrollSize();
          var scrollSizeEnd = scrollSize + scrollValue;
          var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);
          var renderStartIndex = Math.max(startIndex - 1, 0);
          while (renderStartIndex > 0 && (rect = this.dimensions[renderStartIndex]) && rect.primaryPos === this.dimensions[startIndex - 1].primaryPos) {
            renderStartIndex--;
          }
          i = renderStartIndex;
          while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < scrollSizeEnd)) {
            doRender(i, rect);
            i++;
          }
          if (self.dimensions[i]) {
            doRender(i, self.dimensions[i]);
            i++;
          }
          if (self.dimensions[i]) {
            doRender(i, self.dimensions[i]);
          }
          var renderEndIndex = i;
          for (var renderIndex in this.renderedItems) {
            if (renderIndex < renderStartIndex || renderIndex > renderEndIndex) {
              this.removeItem(renderIndex);
            }
          }
          this.setCurrentIndex(startIndex);
          function doRender(dataIndex, rect) {
            if (dataIndex < self.dataSource.dataStartIndex) {} else {
              self.renderItem(dataIndex, rect.primaryPos - self.beforeSize, rect.secondaryPos);
            }
          }
        },
        renderItem: function(dataIndex, primaryPos, secondaryPos) {
          var item = this.dataSource.attachItemAtIndex(dataIndex);
          if (item && item.element) {
            if (item.primaryPos !== primaryPos || item.secondaryPos !== secondaryPos) {
              item.element.css(ionic.CSS.TRANSFORM, this.transformString(primaryPos, secondaryPos));
              item.primaryPos = primaryPos;
              item.secondaryPos = secondaryPos;
            }
            this.renderedItems[dataIndex] = item;
          } else {
            delete this.renderedItems[dataIndex];
          }
        },
        removeItem: function(dataIndex) {
          var item = this.renderedItems[dataIndex];
          if (item) {
            item.primaryPos = item.secondaryPos = null;
            this.dataSource.detachItem(item);
            delete this.renderedItems[dataIndex];
          }
        }
      };
      return CollectionRepeatManager;
    }]);
    IonicModule.factory('$ionicGesture', [function() {
      return {
        on: function(eventType, cb, $element, options) {
          return window.ionic.onGesture(eventType, cb, $element[0], options);
        },
        off: function(gesture, eventType, cb) {
          return window.ionic.offGesture(gesture, eventType, cb);
        }
      };
    }]);
    IonicModule.factory('$ionicHistory', ['$rootScope', '$state', '$location', '$window', '$timeout', '$ionicViewSwitcher', '$ionicNavViewDelegate', function($rootScope, $state, $location, $window, $timeout, $ionicViewSwitcher, $ionicNavViewDelegate) {
      var ACTION_INITIAL_VIEW = 'initialView';
      var ACTION_NEW_VIEW = 'newView';
      var ACTION_MOVE_BACK = 'moveBack';
      var ACTION_MOVE_FORWARD = 'moveForward';
      var DIRECTION_BACK = 'back';
      var DIRECTION_FORWARD = 'forward';
      var DIRECTION_ENTER = 'enter';
      var DIRECTION_EXIT = 'exit';
      var DIRECTION_SWAP = 'swap';
      var DIRECTION_NONE = 'none';
      var stateChangeCounter = 0;
      var lastStateId,
          nextViewOptions,
          nextViewExpireTimer,
          forcedNav;
      var viewHistory = {
        histories: {root: {
            historyId: 'root',
            parentHistoryId: null,
            stack: [],
            cursor: -1
          }},
        views: {},
        backView: null,
        forwardView: null,
        currentView: null
      };
      var View = function() {};
      View.prototype.initialize = function(data) {
        if (data) {
          for (var name in data)
            this[name] = data[name];
          return this;
        }
        return null;
      };
      View.prototype.go = function() {
        if (this.stateName) {
          return $state.go(this.stateName, this.stateParams);
        }
        if (this.url && this.url !== $location.url()) {
          if (viewHistory.backView === this) {
            return $window.history.go(-1);
          } else if (viewHistory.forwardView === this) {
            return $window.history.go(1);
          }
          $location.url(this.url);
          return;
        }
        return null;
      };
      View.prototype.destroy = function() {
        if (this.scope) {
          this.scope.$destroy && this.scope.$destroy();
          this.scope = null;
        }
      };
      function getViewById(viewId) {
        return (viewId ? viewHistory.views[viewId] : null);
      }
      function getBackView(view) {
        return (view ? getViewById(view.backViewId) : null);
      }
      function getForwardView(view) {
        return (view ? getViewById(view.forwardViewId) : null);
      }
      function getHistoryById(historyId) {
        return (historyId ? viewHistory.histories[historyId] : null);
      }
      function getHistory(scope) {
        var histObj = getParentHistoryObj(scope);
        if (!viewHistory.histories[histObj.historyId]) {
          viewHistory.histories[histObj.historyId] = {
            historyId: histObj.historyId,
            parentHistoryId: getParentHistoryObj(histObj.scope.$parent).historyId,
            stack: [],
            cursor: -1
          };
        }
        return getHistoryById(histObj.historyId);
      }
      function getParentHistoryObj(scope) {
        var parentScope = scope;
        while (parentScope) {
          if (parentScope.hasOwnProperty('$historyId')) {
            return {
              historyId: parentScope.$historyId,
              scope: parentScope
            };
          }
          parentScope = parentScope.$parent;
        }
        return {
          historyId: 'root',
          scope: $rootScope
        };
      }
      function setNavViews(viewId) {
        viewHistory.currentView = getViewById(viewId);
        viewHistory.backView = getBackView(viewHistory.currentView);
        viewHistory.forwardView = getForwardView(viewHistory.currentView);
      }
      function getCurrentStateId() {
        var id;
        if ($state && $state.current && $state.current.name) {
          id = $state.current.name;
          if ($state.params) {
            for (var key in $state.params) {
              if ($state.params.hasOwnProperty(key) && $state.params[key]) {
                id += "_" + key + "=" + $state.params[key];
              }
            }
          }
          return id;
        }
        return ionic.Utils.nextUid();
      }
      function getCurrentStateParams() {
        var rtn;
        if ($state && $state.params) {
          for (var key in $state.params) {
            if ($state.params.hasOwnProperty(key)) {
              rtn = rtn || {};
              rtn[key] = $state.params[key];
            }
          }
        }
        return rtn;
      }
      return {
        register: function(parentScope, viewLocals) {
          var currentStateId = getCurrentStateId(),
              hist = getHistory(parentScope),
              currentView = viewHistory.currentView,
              backView = viewHistory.backView,
              forwardView = viewHistory.forwardView,
              viewId = null,
              action = null,
              direction = DIRECTION_NONE,
              historyId = hist.historyId,
              url = $location.url(),
              tmp,
              x,
              ele;
          if (lastStateId !== currentStateId) {
            lastStateId = currentStateId;
            stateChangeCounter++;
          }
          if (forcedNav) {
            viewId = forcedNav.viewId;
            action = forcedNav.action;
            direction = forcedNav.direction;
            forcedNav = null;
          } else if (backView && backView.stateId === currentStateId) {
            viewId = backView.viewId;
            historyId = backView.historyId;
            action = ACTION_MOVE_BACK;
            if (backView.historyId === currentView.historyId) {
              direction = DIRECTION_BACK;
            } else if (currentView) {
              direction = DIRECTION_EXIT;
              tmp = getHistoryById(backView.historyId);
              if (tmp && tmp.parentHistoryId === currentView.historyId) {
                direction = DIRECTION_ENTER;
              } else {
                tmp = getHistoryById(currentView.historyId);
                if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                  direction = DIRECTION_SWAP;
                }
              }
            }
          } else if (forwardView && forwardView.stateId === currentStateId) {
            viewId = forwardView.viewId;
            historyId = forwardView.historyId;
            action = ACTION_MOVE_FORWARD;
            if (forwardView.historyId === currentView.historyId) {
              direction = DIRECTION_FORWARD;
            } else if (currentView) {
              direction = DIRECTION_EXIT;
              if (currentView.historyId === hist.parentHistoryId) {
                direction = DIRECTION_ENTER;
              } else {
                tmp = getHistoryById(currentView.historyId);
                if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                  direction = DIRECTION_SWAP;
                }
              }
            }
            tmp = getParentHistoryObj(parentScope);
            if (forwardView.historyId && tmp.scope) {
              tmp.scope.$historyId = forwardView.historyId;
              historyId = forwardView.historyId;
            }
          } else if (currentView && currentView.historyId !== historyId && hist.cursor > -1 && hist.stack.length > 0 && hist.cursor < hist.stack.length && hist.stack[hist.cursor].stateId === currentStateId) {
            var switchToView = hist.stack[hist.cursor];
            viewId = switchToView.viewId;
            historyId = switchToView.historyId;
            action = ACTION_MOVE_BACK;
            direction = DIRECTION_SWAP;
            tmp = getHistoryById(currentView.historyId);
            if (tmp && tmp.parentHistoryId === historyId) {
              direction = DIRECTION_EXIT;
            } else {
              tmp = getHistoryById(historyId);
              if (tmp && tmp.parentHistoryId === currentView.historyId) {
                direction = DIRECTION_ENTER;
              }
            }
            tmp = getViewById(switchToView.backViewId);
            if (tmp && switchToView.historyId !== tmp.historyId) {
              hist.stack[hist.cursor].backViewId = currentView.viewId;
            }
          } else {
            ele = $ionicViewSwitcher.createViewEle(viewLocals);
            if (this.isAbstractEle(ele, viewLocals)) {
              void 0;
              return {
                action: 'abstractView',
                direction: DIRECTION_NONE,
                ele: ele
              };
            }
            viewId = ionic.Utils.nextUid();
            if (currentView) {
              currentView.forwardViewId = viewId;
              action = ACTION_NEW_VIEW;
              if (forwardView && currentView.stateId !== forwardView.stateId && currentView.historyId === forwardView.historyId) {
                tmp = getHistoryById(forwardView.historyId);
                if (tmp) {
                  for (x = tmp.stack.length - 1; x >= forwardView.index; x--) {
                    tmp.stack[x].destroy();
                    tmp.stack.splice(x);
                  }
                  historyId = forwardView.historyId;
                }
              }
              if (hist.historyId === currentView.historyId) {
                direction = DIRECTION_FORWARD;
              } else if (currentView.historyId !== hist.historyId) {
                direction = DIRECTION_ENTER;
                tmp = getHistoryById(currentView.historyId);
                if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                  direction = DIRECTION_SWAP;
                } else {
                  tmp = getHistoryById(tmp.parentHistoryId);
                  if (tmp && tmp.historyId === hist.historyId) {
                    direction = DIRECTION_EXIT;
                  }
                }
              }
            } else {
              action = ACTION_INITIAL_VIEW;
            }
            if (stateChangeCounter < 2) {
              direction = DIRECTION_NONE;
            }
            viewHistory.views[viewId] = this.createView({
              viewId: viewId,
              index: hist.stack.length,
              historyId: hist.historyId,
              backViewId: (currentView && currentView.viewId ? currentView.viewId : null),
              forwardViewId: null,
              stateId: currentStateId,
              stateName: this.currentStateName(),
              stateParams: getCurrentStateParams(),
              url: url
            });
            hist.stack.push(viewHistory.views[viewId]);
          }
          $timeout.cancel(nextViewExpireTimer);
          if (nextViewOptions) {
            if (nextViewOptions.disableAnimate)
              direction = DIRECTION_NONE;
            if (nextViewOptions.disableBack)
              viewHistory.views[viewId].backViewId = null;
            if (nextViewOptions.historyRoot) {
              for (x = 0; x < hist.stack.length; x++) {
                if (hist.stack[x].viewId === viewId) {
                  hist.stack[x].index = 0;
                  hist.stack[x].backViewId = hist.stack[x].forwardViewId = null;
                } else {
                  delete viewHistory.views[hist.stack[x].viewId];
                }
              }
              hist.stack = [viewHistory.views[viewId]];
            }
            nextViewOptions = null;
          }
          setNavViews(viewId);
          if (viewHistory.backView && historyId == viewHistory.backView.historyId && currentStateId == viewHistory.backView.stateId && url == viewHistory.backView.url) {
            for (x = 0; x < hist.stack.length; x++) {
              if (hist.stack[x].viewId == viewId) {
                action = 'dupNav';
                direction = DIRECTION_NONE;
                hist.stack[x - 1].forwardViewId = viewHistory.forwardView = null;
                viewHistory.currentView.index = viewHistory.backView.index;
                viewHistory.currentView.backViewId = viewHistory.backView.backViewId;
                viewHistory.backView = getBackView(viewHistory.backView);
                hist.stack.splice(x, 1);
                break;
              }
            }
          }
          void 0;
          hist.cursor = viewHistory.currentView.index;
          return {
            viewId: viewId,
            action: action,
            direction: direction,
            historyId: historyId,
            enableBack: !!(viewHistory.backView && viewHistory.backView.historyId === viewHistory.currentView.historyId),
            isHistoryRoot: (viewHistory.currentView.index === 0),
            ele: ele
          };
        },
        registerHistory: function(scope) {
          scope.$historyId = ionic.Utils.nextUid();
        },
        createView: function(data) {
          var newView = new View();
          return newView.initialize(data);
        },
        getViewById: getViewById,
        viewHistory: function() {
          return viewHistory;
        },
        currentView: function(view) {
          if (arguments.length) {
            viewHistory.currentView = view;
          }
          return viewHistory.currentView;
        },
        currentHistoryId: function() {
          return viewHistory.currentView ? viewHistory.currentView.historyId : null;
        },
        currentTitle: function(val) {
          if (viewHistory.currentView) {
            if (arguments.length) {
              viewHistory.currentView.title = val;
            }
            return viewHistory.currentView.title;
          }
        },
        backView: function(view) {
          if (arguments.length) {
            viewHistory.backView = view;
          }
          return viewHistory.backView;
        },
        backTitle: function() {
          if (viewHistory.backView) {
            return viewHistory.backView.title;
          }
        },
        forwardView: function(view) {
          if (arguments.length) {
            viewHistory.forwardView = view;
          }
          return viewHistory.forwardView;
        },
        currentStateName: function() {
          return ($state && $state.current ? $state.current.name : null);
        },
        isCurrentStateNavView: function(navView) {
          return !!($state && $state.current && $state.current.views && $state.current.views[navView]);
        },
        goToHistoryRoot: function(historyId) {
          if (historyId) {
            var hist = getHistoryById(historyId);
            if (hist && hist.stack.length) {
              if (viewHistory.currentView && viewHistory.currentView.viewId === hist.stack[0].viewId) {
                return;
              }
              forcedNav = {
                viewId: hist.stack[0].viewId,
                action: ACTION_MOVE_BACK,
                direction: DIRECTION_BACK
              };
              hist.stack[0].go();
            }
          }
        },
        goBack: function() {
          viewHistory.backView && viewHistory.backView.go();
        },
        clearHistory: function() {
          var histories = viewHistory.histories,
              currentView = viewHistory.currentView;
          if (histories) {
            for (var historyId in histories) {
              if (histories[historyId].stack) {
                histories[historyId].stack = [];
                histories[historyId].cursor = -1;
              }
              if (currentView && currentView.historyId === historyId) {
                currentView.backViewId = currentView.forwardViewId = null;
                histories[historyId].stack.push(currentView);
              } else if (histories[historyId].destroy) {
                histories[historyId].destroy();
              }
            }
          }
          for (var viewId in viewHistory.views) {
            if (viewId !== currentView.viewId) {
              delete viewHistory.views[viewId];
            }
          }
          if (currentView) {
            setNavViews(currentView.viewId);
          }
        },
        clearCache: function() {
          $ionicNavViewDelegate._instances.forEach(function(instance) {
            instance.clearCache();
          });
        },
        nextViewOptions: function(opts) {
          if (arguments.length) {
            $timeout.cancel(nextViewExpireTimer);
            if (opts === null) {
              nextViewOptions = opts;
            } else {
              nextViewOptions = nextViewOptions || {};
              extend(nextViewOptions, opts);
              if (nextViewOptions.expire) {
                nextViewExpireTimer = $timeout(function() {
                  nextViewOptions = null;
                }, nextViewOptions.expire);
              }
            }
          }
          return nextViewOptions;
        },
        isAbstractEle: function(ele, viewLocals) {
          if (viewLocals && viewLocals.$$state && viewLocals.$$state.self.abstract) {
            return true;
          }
          return !!(ele && (isAbstractTag(ele) || isAbstractTag(ele.children())));
        },
        isActiveScope: function(scope) {
          if (!scope)
            return false;
          var climbScope = scope;
          var currentHistoryId = this.currentHistoryId();
          var foundHistoryId;
          while (climbScope) {
            if (climbScope.$$disconnected) {
              return false;
            }
            if (!foundHistoryId && climbScope.hasOwnProperty('$historyId')) {
              foundHistoryId = true;
            }
            if (currentHistoryId) {
              if (climbScope.hasOwnProperty('$historyId') && currentHistoryId == climbScope.$historyId) {
                return true;
              }
              if (climbScope.hasOwnProperty('$activeHistoryId')) {
                if (currentHistoryId == climbScope.$activeHistoryId) {
                  if (climbScope.hasOwnProperty('$historyId')) {
                    return true;
                  }
                  if (!foundHistoryId) {
                    return true;
                  }
                }
              }
            }
            if (foundHistoryId && climbScope.hasOwnProperty('$activeHistoryId')) {
              foundHistoryId = false;
            }
            climbScope = climbScope.$parent;
          }
          return currentHistoryId ? currentHistoryId == 'root' : true;
        }
      };
      function isAbstractTag(ele) {
        return ele && ele.length && /ion-side-menus|ion-tabs/i.test(ele[0].tagName);
      }
    }]).run(['$rootScope', '$state', '$location', '$document', '$ionicPlatform', '$ionicHistory', function($rootScope, $state, $location, $document, $ionicPlatform, $ionicHistory) {
      $rootScope.$on('$ionicView.beforeEnter', function() {
        ionic.keyboard && ionic.keyboard.hide && ionic.keyboard.hide();
      });
      $rootScope.$on('$ionicHistory.change', function(e, data) {
        if (!data)
          return;
        var viewHistory = $ionicHistory.viewHistory();
        var hist = (data.historyId ? viewHistory.histories[data.historyId] : null);
        if (hist && hist.cursor > -1 && hist.cursor < hist.stack.length) {
          var view = hist.stack[hist.cursor];
          return view.go(data);
        }
        if (!data.url && data.uiSref) {
          data.url = $state.href(data.uiSref);
        }
        if (data.url) {
          if (data.url.indexOf('#') === 0) {
            data.url = data.url.replace('#', '');
          }
          if (data.url !== $location.url()) {
            $location.url(data.url);
          }
        }
      });
      $rootScope.$ionicGoBack = function() {
        $ionicHistory.goBack();
      };
      $rootScope.$on('$ionicView.afterEnter', function(ev, data) {
        if (data && data.title) {
          $document[0].title = data.title;
        }
      });
      function onHardwareBackButton(e) {
        var backView = $ionicHistory.backView();
        if (backView) {
          backView.go();
        } else {
          ionic.Platform.exitApp();
        }
        e.preventDefault();
        return false;
      }
      $ionicPlatform.registerBackButtonAction(onHardwareBackButton, PLATFORM_BACK_BUTTON_PRIORITY_VIEW);
    }]);
    IonicModule.provider('$ionicConfig', function() {
      var provider = this;
      provider.platform = {};
      var PLATFORM = 'platform';
      var configProperties = {
        views: {
          maxCache: PLATFORM,
          forwardCache: PLATFORM,
          transition: PLATFORM
        },
        navBar: {
          alignTitle: PLATFORM,
          positionPrimaryButtons: PLATFORM,
          positionSecondaryButtons: PLATFORM,
          transition: PLATFORM
        },
        backButton: {
          icon: PLATFORM,
          text: PLATFORM,
          previousTitleText: PLATFORM
        },
        form: {checkbox: PLATFORM},
        tabs: {
          style: PLATFORM,
          position: PLATFORM
        },
        templates: {maxPrefetch: PLATFORM},
        platform: {}
      };
      createConfig(configProperties, provider, '');
      setPlatformConfig('default', {
        views: {
          maxCache: 10,
          forwardCache: false,
          transition: 'ios'
        },
        navBar: {
          alignTitle: 'center',
          positionPrimaryButtons: 'left',
          positionSecondaryButtons: 'right',
          transition: 'view'
        },
        backButton: {
          icon: 'ion-ios7-arrow-back',
          text: 'Back',
          previousTitleText: true
        },
        form: {checkbox: 'circle'},
        tabs: {
          style: 'standard',
          position: 'bottom'
        },
        templates: {maxPrefetch: 30}
      });
      setPlatformConfig('ios', {});
      setPlatformConfig('android', {
        views: {transition: 'android'},
        navBar: {
          alignTitle: 'left',
          positionPrimaryButtons: 'right',
          positionSecondaryButtons: 'right'
        },
        backButton: {
          icon: 'ion-arrow-left-c',
          text: false,
          previousTitleText: false
        },
        form: {checkbox: 'square'},
        tabs: {
          style: 'striped',
          position: 'top'
        }
      });
      provider.transitions = {
        views: {},
        navBar: {}
      };
      provider.transitions.views.ios = function(enteringEle, leavingEle, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
        function setStyles(ele, opacity, x) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity;
          css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
          ionic.DomUtil.cachedStyles(ele, css);
        }
        return {
          run: function(step) {
            if (direction == 'forward') {
              setStyles(enteringEle, 1, (1 - step) * 99);
              setStyles(leavingEle, (1 - 0.1 * step), step * -33);
            } else if (direction == 'back') {
              setStyles(enteringEle, (1 - 0.1 * (1 - step)), (1 - step) * -33);
              setStyles(leavingEle, 1, step * 100);
            } else {
              setStyles(enteringEle, 1, 0);
              setStyles(leavingEle, 0, 0);
            }
          },
          shouldAnimate: shouldAnimate
        };
      };
      provider.transitions.navBar.ios = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
        function setStyles(ctrl, opacity, titleX, backTextX) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity === 1 ? '' : opacity;
          ctrl.setCss('buttons-left', css);
          ctrl.setCss('buttons-right', css);
          ctrl.setCss('back-button', css);
          css[ionic.CSS.TRANSFORM] = 'translate3d(' + backTextX + 'px,0,0)';
          ctrl.setCss('back-text', css);
          css[ionic.CSS.TRANSFORM] = 'translate3d(' + titleX + 'px,0,0)';
          ctrl.setCss('title', css);
        }
        function enter(ctrlA, ctrlB, step) {
          if (!ctrlA)
            return;
          var titleX = (ctrlA.titleTextX() + ctrlA.titleWidth()) * (1 - step);
          var backTextX = (ctrlB && (ctrlB.titleTextX() - ctrlA.backButtonTextLeft()) * (1 - step)) || 0;
          setStyles(ctrlA, step, titleX, backTextX);
        }
        function leave(ctrlA, ctrlB, step) {
          if (!ctrlA)
            return;
          var titleX = (-(ctrlA.titleTextX() - ctrlB.backButtonTextLeft()) - (ctrlA.titleLeftRight())) * step;
          setStyles(ctrlA, 1 - step, titleX, 0);
        }
        return {
          run: function(step) {
            var enteringHeaderCtrl = enteringHeaderBar.controller();
            var leavingHeaderCtrl = leavingHeaderBar && leavingHeaderBar.controller();
            if (direction == 'back') {
              leave(enteringHeaderCtrl, leavingHeaderCtrl, 1 - step);
              enter(leavingHeaderCtrl, enteringHeaderCtrl, 1 - step);
            } else {
              enter(enteringHeaderCtrl, leavingHeaderCtrl, step);
              leave(leavingHeaderCtrl, enteringHeaderCtrl, step);
            }
          },
          shouldAnimate: shouldAnimate
        };
      };
      provider.transitions.views.android = function(enteringEle, leavingEle, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
        function setStyles(ele, x) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
          ionic.DomUtil.cachedStyles(ele, css);
        }
        return {
          run: function(step) {
            if (direction == 'forward') {
              setStyles(enteringEle, (1 - step) * 99);
              setStyles(leavingEle, step * -100);
            } else if (direction == 'back') {
              setStyles(enteringEle, (1 - step) * -100);
              setStyles(leavingEle, step * 100);
            } else {
              setStyles(enteringEle, 0);
              setStyles(leavingEle, 0);
            }
          },
          shouldAnimate: shouldAnimate
        };
      };
      provider.transitions.navBar.android = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
        function setStyles(ctrl, opacity) {
          if (!ctrl)
            return;
          var css = {};
          css.opacity = opacity === 1 ? '' : opacity;
          ctrl.setCss('buttons-left', css);
          ctrl.setCss('buttons-right', css);
          ctrl.setCss('back-button', css);
          ctrl.setCss('back-text', css);
          ctrl.setCss('title', css);
        }
        return {
          run: function(step) {
            setStyles(enteringHeaderBar.controller(), step);
            setStyles(leavingHeaderBar && leavingHeaderBar.controller(), 1 - step);
          },
          shouldAnimate: true
        };
      };
      provider.transitions.views.none = function(enteringEle, leavingEle) {
        return {run: function(step) {
            provider.transitions.views.android(enteringEle, leavingEle, false, false).run(step);
          }};
      };
      provider.transitions.navBar.none = function(enteringHeaderBar, leavingHeaderBar) {
        return {run: function(step) {
            provider.transitions.navBar.ios(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
            provider.transitions.navBar.android(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
          }};
      };
      function setPlatformConfig(platformName, platformConfigs) {
        configProperties.platform[platformName] = platformConfigs;
        provider.platform[platformName] = {};
        addConfig(configProperties, configProperties.platform[platformName]);
        createConfig(configProperties.platform[platformName], provider.platform[platformName], '');
      }
      function addConfig(configObj, platformObj) {
        for (var n in configObj) {
          if (n != PLATFORM && configObj.hasOwnProperty(n)) {
            if (angular.isObject(configObj[n])) {
              if (!isDefined(platformObj[n])) {
                platformObj[n] = {};
              }
              addConfig(configObj[n], platformObj[n]);
            } else if (!isDefined(platformObj[n])) {
              platformObj[n] = null;
            }
          }
        }
      }
      function createConfig(configObj, providerObj, platformPath) {
        forEach(configObj, function(value, namespace) {
          if (angular.isObject(configObj[namespace])) {
            providerObj[namespace] = {};
            createConfig(configObj[namespace], providerObj[namespace], platformPath + '.' + namespace);
          } else {
            providerObj[namespace] = function(newValue) {
              if (arguments.length) {
                configObj[namespace] = newValue;
                return providerObj;
              }
              if (configObj[namespace] == PLATFORM) {
                var platformConfig = stringObj(configProperties.platform, ionic.Platform.platform() + platformPath + '.' + namespace);
                if (platformConfig || platformConfig === false) {
                  return platformConfig;
                }
                return stringObj(configProperties.platform, 'default' + platformPath + '.' + namespace);
              }
              return configObj[namespace];
            };
          }
        });
      }
      function stringObj(obj, str) {
        str = str.split(".");
        for (var i = 0; i < str.length; i++) {
          if (obj && isDefined(obj[str[i]])) {
            obj = obj[str[i]];
          } else {
            return null;
          }
        }
        return obj;
      }
      provider.setPlatformConfig = setPlatformConfig;
      provider.$get = function() {
        return provider;
      };
    });
    var LOADING_TPL = '<div class="loading-container">' + '<div class="loading">' + '</div>' + '</div>';
    var LOADING_HIDE_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
    var LOADING_SHOW_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
    var LOADING_SET_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';
    IonicModule.constant('$ionicLoadingConfig', {template: '<i class="icon ion-loading-d"></i>'}).factory('$ionicLoading', ['$ionicLoadingConfig', '$ionicBody', '$ionicTemplateLoader', '$ionicBackdrop', '$timeout', '$q', '$log', '$compile', '$ionicPlatform', '$rootScope', function($ionicLoadingConfig, $ionicBody, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile, $ionicPlatform, $rootScope) {
      var loaderInstance;
      var deregisterBackAction = angular.noop;
      var deregisterStateListener = angular.noop;
      var loadingShowDelay = $q.when();
      return {
        show: showLoader,
        hide: hideLoader,
        _getLoader: getLoader
      };
      function getLoader() {
        if (!loaderInstance) {
          loaderInstance = $ionicTemplateLoader.compile({
            template: LOADING_TPL,
            appendTo: $ionicBody.get()
          }).then(function(loader) {
            var self = loader;
            loader.show = function(options) {
              var templatePromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
              self.scope = options.scope || self.scope;
              if (!this.isShown) {
                this.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
                if (this.hasBackdrop) {
                  $ionicBackdrop.retain();
                  $ionicBackdrop.getElement().addClass('backdrop-loading');
                }
              }
              if (options.duration) {
                $timeout.cancel(this.durationTimeout);
                this.durationTimeout = $timeout(angular.bind(this, this.hide), +options.duration);
              }
              deregisterBackAction();
              deregisterBackAction = $ionicPlatform.registerBackButtonAction(angular.noop, PLATFORM_BACK_BUTTON_PRIORITY_LOADING);
              templatePromise.then(function(html) {
                if (html) {
                  var loading = self.element.children();
                  loading.html(html);
                  $compile(loading.contents())(self.scope);
                }
                if (self.isShown) {
                  self.element.addClass('visible');
                  ionic.requestAnimationFrame(function() {
                    if (self.isShown) {
                      self.element.addClass('active');
                      $ionicBody.addClass('loading-active');
                    }
                  });
                }
              });
              this.isShown = true;
            };
            loader.hide = function() {
              deregisterBackAction();
              if (this.isShown) {
                if (this.hasBackdrop) {
                  $ionicBackdrop.release();
                  $ionicBackdrop.getElement().removeClass('backdrop-loading');
                }
                self.element.removeClass('active');
                $ionicBody.removeClass('loading-active');
                setTimeout(function() {
                  !self.isShown && self.element.removeClass('visible');
                }, 200);
              }
              $timeout.cancel(this.durationTimeout);
              this.isShown = false;
            };
            return loader;
          });
        }
        return loaderInstance;
      }
      function showLoader(options) {
        options = extend({}, $ionicLoadingConfig || {}, options || {});
        var delay = options.delay || options.showDelay || 0;
        loadingShowDelay && $timeout.cancel(loadingShowDelay);
        loadingShowDelay = $timeout(angular.noop, delay);
        loadingShowDelay.then(getLoader).then(function(loader) {
          if (options.hideOnStateChange) {
            deregisterStateListener = $rootScope.$on('$stateChangeSuccess', hideLoader);
          }
          return loader.show(options);
        });
        return {
          hide: deprecated.method(LOADING_HIDE_DEPRECATED, $log.error, hideLoader),
          show: deprecated.method(LOADING_SHOW_DEPRECATED, $log.error, function() {
            showLoader(options);
          }),
          setContent: deprecated.method(LOADING_SET_DEPRECATED, $log.error, function(content) {
            getLoader().then(function(loader) {
              loader.show({template: content});
            });
          })
        };
      }
      function hideLoader() {
        deregisterStateListener();
        $timeout.cancel(loadingShowDelay);
        getLoader().then(function(loader) {
          loader.hide();
        });
      }
    }]);
    IonicModule.factory('$ionicModal', ['$rootScope', '$ionicBody', '$compile', '$timeout', '$ionicPlatform', '$ionicTemplateLoader', '$q', '$log', function($rootScope, $ionicBody, $compile, $timeout, $ionicPlatform, $ionicTemplateLoader, $q, $log) {
      var ModalView = ionic.views.Modal.inherit({
        initialize: function(opts) {
          ionic.views.Modal.prototype.initialize.call(this, opts);
          this.animation = opts.animation || 'slide-in-up';
        },
        show: function(target) {
          var self = this;
          if (self.scope.$$destroyed) {
            $log.error('Cannot call ' + self.viewType + '.show() after remove(). Please create a new ' + self.viewType + ' instance.');
            return;
          }
          var modalEl = jqLite(self.modalEl);
          self.el.classList.remove('hide');
          $timeout(function() {
            $ionicBody.addClass(self.viewType + '-open');
          }, 400);
          if (!self.el.parentElement) {
            modalEl.addClass(self.animation);
            $ionicBody.append(self.el);
          }
          if (target && self.positionView) {
            self.positionView(target, modalEl);
            ionic.on('resize', function() {
              ionic.off('resize', null, window);
              self.positionView(target, modalEl);
            }, window);
          }
          modalEl.addClass('ng-enter active').removeClass('ng-leave ng-leave-active');
          self._isShown = true;
          self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(self.hardwareBackButtonClose ? angular.bind(self, self.hide) : angular.noop, PLATFORM_BACK_BUTTON_PRIORITY_MODAL);
          self._isOpenPromise = $q.defer();
          ionic.views.Modal.prototype.show.call(self);
          $timeout(function() {
            modalEl.addClass('ng-enter-active');
            ionic.trigger('resize');
            self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.shown', self);
            self.el.classList.add('active');
            self.scope.$broadcast('$ionicHeader.align');
          }, 20);
          return $timeout(function() {
            self.$el.on('click', function(e) {
              if (self.backdropClickToClose && e.target === self.el) {
                self.hide();
              }
            });
          }, 400);
        },
        hide: function() {
          var self = this;
          var modalEl = jqLite(self.modalEl);
          self.el.classList.remove('active');
          modalEl.addClass('ng-leave');
          $timeout(function() {
            modalEl.addClass('ng-leave-active').removeClass('ng-enter ng-enter-active active');
          }, 20);
          self.$el.off('click');
          self._isShown = false;
          self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.hidden', self);
          self._deregisterBackButton && self._deregisterBackButton();
          ionic.views.Modal.prototype.hide.call(self);
          if (self.positionView) {
            ionic.off('resize', null, window);
          }
          return $timeout(function() {
            $ionicBody.removeClass(self.viewType + '-open');
            self.el.classList.add('hide');
          }, self.hideDelay || 320);
        },
        remove: function() {
          var self = this;
          self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.removed', self);
          return self.hide().then(function() {
            self.scope.$destroy();
            self.$el.remove();
          });
        },
        isShown: function() {
          return !!this._isShown;
        }
      });
      var createModal = function(templateString, options) {
        var scope = options.scope && options.scope.$new() || $rootScope.$new(true);
        options.viewType = options.viewType || 'modal';
        extend(scope, {
          $hasHeader: false,
          $hasSubheader: false,
          $hasFooter: false,
          $hasSubfooter: false,
          $hasTabs: false,
          $hasTabsTop: false
        });
        var element = $compile('<ion-' + options.viewType + '>' + templateString + '</ion-' + options.viewType + '>')(scope);
        options.$el = element;
        options.el = element[0];
        options.modalEl = options.el.querySelector('.' + options.viewType);
        var modal = new ModalView(options);
        modal.scope = scope;
        if (!options.scope) {
          scope[options.viewType] = modal;
        }
        return modal;
      };
      return {
        fromTemplate: function(templateString, options) {
          var modal = createModal(templateString, options || {});
          return modal;
        },
        fromTemplateUrl: function(url, options, _) {
          var cb;
          if (angular.isFunction(options)) {
            cb = options;
            options = _;
          }
          return $ionicTemplateLoader.load(url).then(function(templateString) {
            var modal = createModal(templateString, options || {});
            cb && cb(modal);
            return modal;
          });
        }
      };
    }]);
    IonicModule.service('$ionicNavBarDelegate', ionic.DelegateService(['align', 'showBackButton', 'showBar', 'title', 'changeTitle', 'setTitle', 'getTitle', 'back', 'getPreviousTitle']));
    IonicModule.service('$ionicNavViewDelegate', ionic.DelegateService(['clearCache']));
    var PLATFORM_BACK_BUTTON_PRIORITY_VIEW = 100;
    var PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU = 150;
    var PLATFORM_BACK_BUTTON_PRIORITY_MODAL = 200;
    var PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET = 300;
    var PLATFORM_BACK_BUTTON_PRIORITY_POPUP = 400;
    var PLATFORM_BACK_BUTTON_PRIORITY_LOADING = 500;
    IonicModule.provider('$ionicPlatform', function() {
      return {$get: ['$q', '$rootScope', function($q, $rootScope) {
          var self = {
            onHardwareBackButton: function(cb) {
              ionic.Platform.ready(function() {
                document.addEventListener('backbutton', cb, false);
              });
            },
            offHardwareBackButton: function(fn) {
              ionic.Platform.ready(function() {
                document.removeEventListener('backbutton', fn);
              });
            },
            $backButtonActions: {},
            registerBackButtonAction: function(fn, priority, actionId) {
              if (!self._hasBackButtonHandler) {
                self.$backButtonActions = {};
                self.onHardwareBackButton(self.hardwareBackButtonClick);
                self._hasBackButtonHandler = true;
              }
              var action = {
                id: (actionId ? actionId : ionic.Utils.nextUid()),
                priority: (priority ? priority : 0),
                fn: fn
              };
              self.$backButtonActions[action.id] = action;
              return function() {
                delete self.$backButtonActions[action.id];
              };
            },
            hardwareBackButtonClick: function(e) {
              var priorityAction,
                  actionId;
              for (actionId in self.$backButtonActions) {
                if (!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
                  priorityAction = self.$backButtonActions[actionId];
                }
              }
              if (priorityAction) {
                priorityAction.fn(e);
                return priorityAction;
              }
            },
            is: function(type) {
              return ionic.Platform.is(type);
            },
            on: function(type, cb) {
              ionic.Platform.ready(function() {
                document.addEventListener(type, cb, false);
              });
              return function() {
                ionic.Platform.ready(function() {
                  document.removeEventListener(type, cb);
                });
              };
            },
            ready: function(cb) {
              var q = $q.defer();
              ionic.Platform.ready(function() {
                q.resolve();
                cb && cb();
              });
              return q.promise;
            }
          };
          return self;
        }]};
    });
    IonicModule.factory('$ionicPopover', ['$ionicModal', '$ionicPosition', '$document', '$window', function($ionicModal, $ionicPosition, $document, $window) {
      var POPOVER_BODY_PADDING = 6;
      var POPOVER_OPTIONS = {
        viewType: 'popover',
        hideDelay: 1,
        animation: 'none',
        positionView: positionView
      };
      function positionView(target, popoverEle) {
        var targetEle = angular.element(target.target || target);
        var buttonOffset = $ionicPosition.offset(targetEle);
        var popoverWidth = popoverEle.prop('offsetWidth');
        var popoverHeight = popoverEle.prop('offsetHeight');
        var bodyWidth = $document[0].body.clientWidth;
        var bodyHeight = $window.innerHeight;
        var popoverCSS = {left: buttonOffset.left + buttonOffset.width / 2 - popoverWidth / 2};
        var arrowEle = jqLite(popoverEle[0].querySelector('.popover-arrow'));
        if (popoverCSS.left < POPOVER_BODY_PADDING) {
          popoverCSS.left = POPOVER_BODY_PADDING;
        } else if (popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
          popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
        }
        if (buttonOffset.top + buttonOffset.height + popoverHeight > bodyHeight) {
          popoverCSS.top = buttonOffset.top - popoverHeight;
          popoverEle.addClass('popover-bottom');
        } else {
          popoverCSS.top = buttonOffset.top + buttonOffset.height;
          popoverEle.removeClass('popover-bottom');
        }
        arrowEle.css({left: buttonOffset.left + buttonOffset.width / 2 - arrowEle.prop('offsetWidth') / 2 - popoverCSS.left + 'px'});
        popoverEle.css({
          top: popoverCSS.top + 'px',
          left: popoverCSS.left + 'px',
          marginLeft: '0',
          opacity: '1'
        });
      }
      return {
        fromTemplate: function(templateString, options) {
          return $ionicModal.fromTemplate(templateString, ionic.Utils.extend(POPOVER_OPTIONS, options || {}));
        },
        fromTemplateUrl: function(url, options) {
          return $ionicModal.fromTemplateUrl(url, ionic.Utils.extend(POPOVER_OPTIONS, options || {}));
        }
      };
    }]);
    var POPUP_TPL = '<div class="popup-container" ng-class="cssClass">' + '<div class="popup">' + '<div class="popup-head">' + '<h3 class="popup-title" ng-bind-html="title"></h3>' + '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' + '</div>' + '<div class="popup-body">' + '</div>' + '<div class="popup-buttons" ng-show="buttons.length">' + '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' + '</div>' + '</div>' + '</div>';
    IonicModule.factory('$ionicPopup', ['$ionicTemplateLoader', '$ionicBackdrop', '$q', '$timeout', '$rootScope', '$ionicBody', '$compile', '$ionicPlatform', function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $ionicBody, $compile, $ionicPlatform) {
      var config = {stackPushDelay: 75};
      var popupStack = [];
      var $ionicPopup = {
        show: showPopup,
        alert: showAlert,
        confirm: showConfirm,
        prompt: showPrompt,
        _createPopup: createPopup,
        _popupStack: popupStack
      };
      return $ionicPopup;
      function createPopup(options) {
        options = extend({
          scope: null,
          title: '',
          buttons: []
        }, options || {});
        var popupPromise = $ionicTemplateLoader.compile({
          template: POPUP_TPL,
          scope: options.scope && options.scope.$new(),
          appendTo: $ionicBody.get()
        });
        var contentPromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
        return $q.all([popupPromise, contentPromise]).then(function(results) {
          var self = results[0];
          var content = results[1];
          var responseDeferred = $q.defer();
          self.responseDeferred = responseDeferred;
          var body = jqLite(self.element[0].querySelector('.popup-body'));
          if (content) {
            body.html(content);
            $compile(body.contents())(self.scope);
          } else {
            body.remove();
          }
          extend(self.scope, {
            title: options.title,
            buttons: options.buttons,
            subTitle: options.subTitle,
            cssClass: options.cssClass,
            $buttonTapped: function(button, event) {
              var result = (button.onTap || angular.noop)(event);
              event = event.originalEvent || event;
              if (!event.defaultPrevented) {
                responseDeferred.resolve(result);
              }
            }
          });
          self.show = function() {
            if (self.isShown)
              return;
            self.isShown = true;
            ionic.requestAnimationFrame(function() {
              if (!self.isShown)
                return;
              self.element.removeClass('popup-hidden');
              self.element.addClass('popup-showing active');
              focusInput(self.element);
            });
          };
          self.hide = function(callback) {
            callback = callback || angular.noop;
            if (!self.isShown)
              return callback();
            self.isShown = false;
            self.element.removeClass('active');
            self.element.addClass('popup-hidden');
            $timeout(callback, 250);
          };
          self.remove = function() {
            if (self.removed)
              return;
            self.hide(function() {
              self.element.remove();
              self.scope.$destroy();
            });
            self.removed = true;
          };
          return self;
        });
      }
      function onHardwareBackButton(e) {
        popupStack[0] && popupStack[0].responseDeferred.resolve();
      }
      function showPopup(options) {
        var popupPromise = $ionicPopup._createPopup(options);
        var previousPopup = popupStack[0];
        if (previousPopup) {
          previousPopup.hide();
        }
        var resultPromise = $timeout(angular.noop, previousPopup ? config.stackPushDelay : 0).then(function() {
          return popupPromise;
        }).then(function(popup) {
          if (!previousPopup) {
            $ionicBody.addClass('popup-open');
            $ionicBackdrop.retain();
            $ionicPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(onHardwareBackButton, PLATFORM_BACK_BUTTON_PRIORITY_POPUP);
          }
          popupStack.unshift(popup);
          popup.show();
          popup.responseDeferred.notify({close: resultPromise.close});
          return popup.responseDeferred.promise.then(function(result) {
            var index = popupStack.indexOf(popup);
            if (index !== -1) {
              popupStack.splice(index, 1);
            }
            popup.remove();
            var previousPopup = popupStack[0];
            if (previousPopup) {
              previousPopup.show();
            } else {
              $timeout(function() {
                $ionicBody.removeClass('popup-open');
              }, 400);
              $timeout(function() {
                $ionicBackdrop.release();
              }, config.stackPushDelay || 0);
              ($ionicPopup._backButtonActionDone || angular.noop)();
            }
            return result;
          });
        });
        function close(result) {
          popupPromise.then(function(popup) {
            if (!popup.removed) {
              popup.responseDeferred.resolve(result);
            }
          });
        }
        resultPromise.close = close;
        return resultPromise;
      }
      function focusInput(element) {
        var focusOn = element[0].querySelector('[autofocus]');
        if (focusOn) {
          focusOn.focus();
        }
      }
      function showAlert(opts) {
        return showPopup(extend({buttons: [{
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return true;
            }
          }]}, opts || {}));
      }
      function showConfirm(opts) {
        return showPopup(extend({buttons: [{
            text: opts.cancelText || 'Cancel',
            type: opts.cancelType || 'button-default',
            onTap: function(e) {
              return false;
            }
          }, {
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return true;
            }
          }]}, opts || {}));
      }
      function showPrompt(opts) {
        var scope = $rootScope.$new(true);
        scope.data = {};
        var text = '';
        if (opts.template && /<[a-z][\s\S]*>/i.test(opts.template) === false) {
          text = '<span>' + opts.template + '</span>';
          delete opts.template;
        }
        return showPopup(extend({
          template: text + '<input ng-model="data.response" type="' + (opts.inputType || 'text') + '" placeholder="' + (opts.inputPlaceholder || '') + '">',
          scope: scope,
          buttons: [{
            text: opts.cancelText || 'Cancel',
            type: opts.cancelType || 'button-default',
            onTap: function(e) {}
          }, {
            text: opts.okText || 'OK',
            type: opts.okType || 'button-positive',
            onTap: function(e) {
              return scope.data.response || '';
            }
          }]
        }, opts || {}));
      }
    }]);
    IonicModule.factory('$ionicPosition', ['$document', '$window', function($document, $window) {
      function getStyle(el, cssprop) {
        if (el.currentStyle) {
          return el.currentStyle[cssprop];
        } else if ($window.getComputedStyle) {
          return $window.getComputedStyle(el)[cssprop];
        }
        return el.style[cssprop];
      }
      function isStaticPositioned(element) {
        return (getStyle(element, 'position') || 'static') === 'static';
      }
      var parentOffsetEl = function(element) {
        var docDomEl = $document[0];
        var offsetParent = element.offsetParent || docDomEl;
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docDomEl;
      };
      return {
        position: function(element) {
          var elBCR = this.offset(element);
          var offsetParentBCR = {
            top: 0,
            left: 0
          };
          var offsetParentEl = parentOffsetEl(element[0]);
          if (offsetParentEl != $document[0]) {
            offsetParentBCR = this.offset(angular.element(offsetParentEl));
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
          }
          var boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
          };
        },
        offset: function(element) {
          var boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
          };
        }
      };
    }]);
    IonicModule.service('$ionicScrollDelegate', ionic.DelegateService(['resize', 'scrollTop', 'scrollBottom', 'scrollTo', 'scrollBy', 'zoomTo', 'zoomBy', 'getScrollPosition', 'anchorScroll', 'getScrollView']));
    IonicModule.service('$ionicSideMenuDelegate', ionic.DelegateService(['toggleLeft', 'toggleRight', 'getOpenRatio', 'isOpen', 'isOpenLeft', 'isOpenRight', 'canDragContent', 'edgeDragThreshold']));
    IonicModule.service('$ionicSlideBoxDelegate', ionic.DelegateService(['update', 'slide', 'select', 'enableSlide', 'previous', 'next', 'stop', 'autoPlay', 'start', 'currentIndex', 'selected', 'slidesCount', 'count', 'loop']));
    IonicModule.service('$ionicTabsDelegate', ionic.DelegateService(['select', 'selectedIndex']));
    (function() {
      var templatesToCache = [];
      IonicModule.factory('$ionicTemplateCache', ['$http', '$templateCache', '$timeout', function($http, $templateCache, $timeout) {
        var toCache = templatesToCache,
            hasRun;
        function $ionicTemplateCache(templates) {
          if (typeof templates === 'undefined') {
            return run();
          }
          if (isString(templates)) {
            templates = [templates];
          }
          forEach(templates, function(template) {
            toCache.push(template);
          });
          if (hasRun) {
            run();
          }
        }
        function run() {
          $ionicTemplateCache._runCount++;
          hasRun = true;
          if (toCache.length === 0)
            return;
          var i = 0;
          while (i < 4 && (template = toCache.pop())) {
            if (isString(template))
              $http.get(template, {cache: $templateCache});
            i++;
          }
          if (toCache.length) {
            $timeout(run, 1000);
          }
        }
        $ionicTemplateCache._runCount = 0;
        return $ionicTemplateCache;
      }]).config(['$stateProvider', '$ionicConfigProvider', function($stateProvider, $ionicConfigProvider) {
        var stateProviderState = $stateProvider.state;
        $stateProvider.state = function(stateName, definition) {
          if (typeof definition === 'object') {
            var enabled = definition.prefetchTemplate !== false && templatesToCache.length < $ionicConfigProvider.templates.maxPrefetch();
            if (enabled && isString(definition.templateUrl))
              templatesToCache.push(definition.templateUrl);
            if (angular.isObject(definition.views)) {
              for (var key in definition.views) {
                enabled = definition.views[key].prefetchTemplate !== false && templatesToCache.length < $ionicConfigProvider.templates.maxPrefetch();
                if (enabled && isString(definition.views[key].templateUrl))
                  templatesToCache.push(definition.views[key].templateUrl);
              }
            }
          }
          return stateProviderState.call($stateProvider, stateName, definition);
        };
      }]).run(['$ionicTemplateCache', function($ionicTemplateCache) {
        $ionicTemplateCache();
      }]);
    })();
    IonicModule.factory('$ionicTemplateLoader', ['$compile', '$controller', '$http', '$q', '$rootScope', '$templateCache', function($compile, $controller, $http, $q, $rootScope, $templateCache) {
      return {
        load: fetchTemplate,
        compile: loadAndCompile
      };
      function fetchTemplate(url) {
        return $http.get(url, {cache: $templateCache}).then(function(response) {
          return response.data && response.data.trim();
        });
      }
      function loadAndCompile(options) {
        options = extend({
          template: '',
          templateUrl: '',
          scope: null,
          controller: null,
          locals: {},
          appendTo: null
        }, options || {});
        var templatePromise = options.templateUrl ? this.load(options.templateUrl) : $q.when(options.template);
        return templatePromise.then(function(template) {
          var controller;
          var scope = options.scope || $rootScope.$new();
          var element = jqLite('<div>').html(template).contents();
          if (options.controller) {
            controller = $controller(options.controller, extend(options.locals, {$scope: scope}));
            element.children().data('$ngControllerController', controller);
          }
          if (options.appendTo) {
            jqLite(options.appendTo).append(element);
          }
          $compile(element)(scope);
          return {
            element: element,
            scope: scope
          };
        });
      }
    }]);
    IonicModule.factory('$ionicViewService', ['$ionicHistory', '$log', function($ionicHistory, $log) {
      function warn(oldMethod, newMethod) {
        $log.warn('$ionicViewService' + oldMethod + ' is deprecated, please use $ionicHistory' + newMethod + ' instead: http://ionicframework.com/docs/nightly/api/service/$ionicHistory/');
      }
      warn('', '');
      var methodsMap = {
        getCurrentView: 'currentView',
        getBackView: 'backView',
        getForwardView: 'forwardView',
        getCurrentStateName: 'currentStateName',
        nextViewOptions: 'nextViewOptions',
        clearHistory: 'clearHistory'
      };
      forEach(methodsMap, function(newMethod, oldMethod) {
        methodsMap[oldMethod] = function() {
          warn('.' + oldMethod, '.' + newMethod);
          return $ionicHistory[newMethod].apply(this, arguments);
        };
      });
      return methodsMap;
    }]);
    IonicModule.factory('$ionicViewSwitcher', ['$timeout', '$document', '$q', '$ionicClickBlock', '$ionicConfig', '$ionicNavBarDelegate', function($timeout, $document, $q, $ionicClickBlock, $ionicConfig, $ionicNavBarDelegate) {
      var TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      var DATA_NO_CACHE = '$noCache';
      var DATA_DESTROY_ELE = '$destroyEle';
      var DATA_ELE_IDENTIFIER = '$eleId';
      var DATA_VIEW_ACCESSED = '$accessed';
      var DATA_FALLBACK_TIMER = '$fallbackTimer';
      var DATA_VIEW = '$viewData';
      var NAV_VIEW_ATTR = 'nav-view';
      var HISTORY_CURSOR_ATTR = 'history-cursor';
      var VIEW_STATUS_ACTIVE = 'active';
      var VIEW_STATUS_CACHED = 'cached';
      var VIEW_STATUS_STAGED = 'stage';
      var transitionCounter = 0;
      var nextTransition,
          nextDirection;
      ionic.transition = ionic.transition || {};
      ionic.transition.isActive = false;
      var isActiveTimer;
      var cachedAttr = ionic.DomUtil.cachedAttr;
      var transitionPromises = [];
      var ionicViewSwitcher = {
        create: function(navViewCtrl, viewLocals, enteringView, leavingView) {
          var enteringEle,
              leavingEle;
          var transitionId = ++transitionCounter;
          var alreadyInDom;
          var switcher = {
            init: function(registerData, callback) {
              ionicViewSwitcher.isTransitioning(true);
              switcher.loadViewElements(registerData);
              switcher.render(registerData, function() {
                callback && callback();
              });
            },
            loadViewElements: function(registerData) {
              var viewEle,
                  viewElements = navViewCtrl.getViewElements();
              var enteringEleIdentifier = getViewElementIdentifier(viewLocals, enteringView);
              var navViewActiveEleId = navViewCtrl.activeEleId();
              for (var x = 0,
                  l = viewElements.length; x < l; x++) {
                viewEle = viewElements.eq(x);
                if (viewEle.data(DATA_ELE_IDENTIFIER) === enteringEleIdentifier) {
                  if (viewEle.data(DATA_NO_CACHE)) {
                    viewEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier + ionic.Utils.nextUid());
                    viewEle.data(DATA_DESTROY_ELE, true);
                  } else {
                    enteringEle = viewEle;
                  }
                } else if (viewEle.data(DATA_ELE_IDENTIFIER) === navViewActiveEleId) {
                  leavingEle = viewEle;
                }
                if (enteringEle && leavingEle)
                  break;
              }
              alreadyInDom = !!enteringEle;
              if (!alreadyInDom) {
                enteringEle = registerData.ele || ionicViewSwitcher.createViewEle(viewLocals);
                enteringEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier);
              }
              navViewCtrl.activeEleId(enteringEleIdentifier);
              registerData.ele = null;
            },
            render: function(registerData, callback) {
              leavingEle && ionic.Utils.disconnectScope(leavingEle.scope());
              if (alreadyInDom) {
                ionic.Utils.reconnectScope(enteringEle.scope());
              } else {
                navViewAttr(enteringEle, VIEW_STATUS_STAGED);
                var enteringData = getTransitionData(viewLocals, enteringEle, registerData.direction, enteringView);
                var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
                transitionFn(enteringEle, null, enteringData.direction, true).run(0);
                enteringEle.data(DATA_VIEW, {
                  viewId: enteringData.viewId,
                  historyId: enteringData.historyId,
                  stateName: enteringData.stateName,
                  stateParams: enteringData.stateParams
                });
                if (viewState(viewLocals).cache === false || viewState(viewLocals).cache === 'false' || enteringEle.attr('cache-view') == 'false' || $ionicConfig.views.maxCache() === 0) {
                  enteringEle.data(DATA_NO_CACHE, true);
                }
                var viewScope = navViewCtrl.appendViewElement(enteringEle, viewLocals);
                delete enteringData.direction;
                delete enteringData.transition;
                viewScope.$emit('$ionicView.loaded', enteringData);
              }
              enteringEle.data(DATA_VIEW_ACCESSED, Date.now());
              callback && callback();
            },
            transition: function(direction, enableBack) {
              var deferred = $q.defer();
              transitionPromises.push(deferred.promise);
              var enteringData = getTransitionData(viewLocals, enteringEle, direction, enteringView);
              var leavingData = extend(extend({}, enteringData), getViewData(leavingView));
              enteringData.transitionId = leavingData.transitionId = transitionId;
              enteringData.fromCache = !!alreadyInDom;
              enteringData.enableBack = !!enableBack;
              cachedAttr(enteringEle.parent(), 'nav-view-transition', enteringData.transition);
              cachedAttr(enteringEle.parent(), 'nav-view-direction', enteringData.direction);
              $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
              switcher.emit('before', enteringData, leavingData);
              var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
              var viewTransition = transitionFn(enteringEle, leavingEle, enteringData.direction, enteringData.shouldAnimate);
              if (viewTransition.shouldAnimate) {
                enteringEle.on(TRANSITIONEND_EVENT, transitionComplete);
                enteringEle.data(DATA_FALLBACK_TIMER, $timeout(transitionComplete, 1000));
                $ionicClickBlock.show();
              }
              navViewAttr(enteringEle, VIEW_STATUS_STAGED);
              viewTransition.run(0);
              $timeout(onReflow, 16);
              function onReflow() {
                navViewAttr(enteringEle, viewTransition.shouldAnimate ? 'entering' : VIEW_STATUS_ACTIVE);
                navViewAttr(leavingEle, viewTransition.shouldAnimate ? 'leaving' : VIEW_STATUS_CACHED);
                viewTransition.run(1);
                $ionicNavBarDelegate._instances.forEach(function(instance) {
                  instance.triggerTransitionStart(transitionId);
                });
                if (!viewTransition.shouldAnimate) {
                  transitionComplete();
                }
              }
              function transitionComplete() {
                if (transitionComplete.x)
                  return;
                transitionComplete.x = true;
                enteringEle.off(TRANSITIONEND_EVENT, transitionComplete);
                $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
                leavingEle && $timeout.cancel(leavingEle.data(DATA_FALLBACK_TIMER));
                switcher.emit('after', enteringData, leavingData);
                deferred.resolve(navViewCtrl);
                if (transitionId === transitionCounter) {
                  $q.all(transitionPromises).then(ionicViewSwitcher.transitionEnd);
                  switcher.cleanup(enteringData);
                }
                $ionicNavBarDelegate._instances.forEach(function(instance) {
                  instance.triggerTransitionEnd();
                });
                nextTransition = nextDirection = enteringView = leavingView = enteringEle = leavingEle = null;
              }
            },
            emit: function(step, enteringData, leavingData) {
              var scope = enteringEle.scope();
              if (scope) {
                scope.$emit('$ionicView.' + step + 'Enter', enteringData);
                if (step == 'after') {
                  scope.$emit('$ionicView.enter', enteringData);
                }
              }
              if (leavingEle) {
                scope = leavingEle.scope();
                if (scope) {
                  scope.$emit('$ionicView.' + step + 'Leave', leavingData);
                  if (step == 'after') {
                    scope.$emit('$ionicView.leave', leavingData);
                  }
                }
              }
            },
            cleanup: function(transData) {
              if (leavingEle && transData.direction == 'back' && !$ionicConfig.views.forwardCache()) {
                destroyViewEle(leavingEle);
              }
              var viewElements = navViewCtrl.getViewElements();
              var viewElementsLength = viewElements.length;
              var x,
                  viewElement;
              var removeOldestAccess = (viewElementsLength - 1) > $ionicConfig.views.maxCache();
              var removableEle;
              var oldestAccess = Date.now();
              for (x = 0; x < viewElementsLength; x++) {
                viewElement = viewElements.eq(x);
                if (removeOldestAccess && viewElement.data(DATA_VIEW_ACCESSED) < oldestAccess) {
                  oldestAccess = viewElement.data(DATA_VIEW_ACCESSED);
                  removableEle = viewElements.eq(x);
                } else if (viewElement.data(DATA_DESTROY_ELE) && navViewAttr(viewElement) != VIEW_STATUS_ACTIVE) {
                  destroyViewEle(viewElement);
                }
              }
              destroyViewEle(removableEle);
              if (enteringEle.data(DATA_NO_CACHE)) {
                enteringEle.data(DATA_DESTROY_ELE, true);
              }
            },
            enteringEle: function() {
              return enteringEle;
            },
            leavingEle: function() {
              return leavingEle;
            }
          };
          return switcher;
        },
        transitionEnd: function(navViewCtrls) {
          forEach(navViewCtrls, function(navViewCtrl) {
            navViewCtrl.transitionEnd();
          });
          ionicViewSwitcher.isTransitioning(false);
          $ionicClickBlock.hide();
          transitionPromises = [];
        },
        nextTransition: function(val) {
          nextTransition = val;
        },
        nextDirection: function(val) {
          nextDirection = val;
        },
        isTransitioning: function(val) {
          if (arguments.length) {
            ionic.transition.isActive = !!val;
            $timeout.cancel(isActiveTimer);
            if (val) {
              isActiveTimer = $timeout(function() {
                ionicViewSwitcher.isTransitioning(false);
              }, 999);
            }
          }
          return ionic.transition.isActive;
        },
        createViewEle: function(viewLocals) {
          var containerEle = $document[0].createElement('div');
          if (viewLocals && viewLocals.$template) {
            containerEle.innerHTML = viewLocals.$template;
            if (containerEle.children.length === 1) {
              containerEle.children[0].classList.add('pane');
              return jqLite(containerEle.children[0]);
            }
          }
          containerEle.className = "pane";
          return jqLite(containerEle);
        },
        viewEleIsActive: function(viewEle, isActiveAttr) {
          navViewAttr(viewEle, isActiveAttr ? VIEW_STATUS_ACTIVE : VIEW_STATUS_CACHED);
        },
        getTransitionData: getTransitionData,
        navViewAttr: navViewAttr,
        destroyViewEle: destroyViewEle
      };
      return ionicViewSwitcher;
      function getViewElementIdentifier(locals, view) {
        if (viewState(locals).abstract)
          return viewState(locals).name;
        if (view)
          return view.stateId || view.viewId;
        return ionic.Utils.nextUid();
      }
      function viewState(locals) {
        return locals && locals.$$state && locals.$$state.self || {};
      }
      function getTransitionData(viewLocals, enteringEle, direction, view) {
        var state = viewState(viewLocals);
        var viewTransition = nextTransition || cachedAttr(enteringEle, 'view-transition') || state.viewTransition || $ionicConfig.views.transition() || 'ios';
        var navBarTransition = $ionicConfig.navBar.transition();
        direction = nextDirection || cachedAttr(enteringEle, 'view-direction') || state.viewDirection || direction || 'none';
        return extend(getViewData(view), {
          transition: viewTransition,
          navBarTransition: navBarTransition === 'view' ? viewTransition : navBarTransition,
          direction: direction,
          shouldAnimate: (viewTransition !== 'none' && direction !== 'none')
        });
      }
      function getViewData(view) {
        view = view || {};
        return {
          viewId: view.viewId,
          historyId: view.historyId,
          stateId: view.stateId,
          stateName: view.stateName,
          stateParams: view.stateParams
        };
      }
      function navViewAttr(ele, value) {
        if (arguments.length > 1) {
          cachedAttr(ele, NAV_VIEW_ATTR, value);
        } else {
          return cachedAttr(ele, NAV_VIEW_ATTR);
        }
      }
      function destroyViewEle(ele) {
        if (ele && ele.length) {
          var viewScope = ele.scope();
          if (viewScope) {
            viewScope.$emit('$ionicView.unloaded', ele.data(DATA_VIEW));
            viewScope.$destroy();
          }
          ele.remove();
        }
      }
    }]);
    IonicModule.config(['$provide', function($provide) {
      $provide.decorator('$compile', ['$delegate', function($compile) {
        $compile.$$addScopeInfo = function $$addScopeInfo($element, scope, isolated, noTemplate) {
          var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
          $element.data(dataName, scope);
        };
        return $compile;
      }]);
    }]);
    IonicModule.config(['$provide', function($provide) {
      function $LocationDecorator($location, $timeout) {
        $location.__hash = $location.hash;
        $location.hash = function(value) {
          if (angular.isDefined(value)) {
            $timeout(function() {
              var scroll = document.querySelector('.scroll-content');
              if (scroll)
                scroll.scrollTop = 0;
            }, 0, false);
          }
          return $location.__hash(value);
        };
        return $location;
      }
      $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
    }]);
    IonicModule.controller('$ionicHeaderBar', ['$scope', '$element', '$attrs', '$q', '$ionicConfig', '$ionicHistory', function($scope, $element, $attrs, $q, $ionicConfig, $ionicHistory) {
      var TITLE = 'title';
      var BACK_TEXT = 'back-text';
      var BACK_BUTTON = 'back-button';
      var DEFAULT_TITLE = 'default-title';
      var PREVIOUS_TITLE = 'previous-title';
      var HIDE = 'hide';
      var self = this;
      var titleText = '';
      var previousTitleText = '';
      var titleLeft = 0;
      var titleRight = 0;
      var titleCss = '';
      var isBackEnabled = false;
      var isBackShown = true;
      var isNavBackShown = true;
      var isBackElementShown = false;
      var titleTextWidth = 0;
      self.beforeEnter = function(viewData) {
        $scope.$broadcast('$ionicView.beforeEnter', viewData);
      };
      self.title = function(newTitleText) {
        if (arguments.length && newTitleText !== titleText) {
          getEle(TITLE).innerHTML = newTitleText;
          titleText = newTitleText;
          titleTextWidth = 0;
        }
        return titleText;
      };
      self.enableBack = function(shouldEnable, disableReset) {
        if (arguments.length) {
          isBackEnabled = shouldEnable;
          if (!disableReset)
            self.updateBackButton();
        }
        return isBackEnabled;
      };
      self.showBack = function(shouldShow, disableReset) {
        if (arguments.length) {
          isBackShown = shouldShow;
          if (!disableReset)
            self.updateBackButton();
        }
        return isBackShown;
      };
      self.showNavBack = function(shouldShow) {
        isNavBackShown = shouldShow;
        self.updateBackButton();
      };
      self.updateBackButton = function() {
        if ((isBackShown && isNavBackShown && isBackEnabled) !== isBackElementShown) {
          isBackElementShown = isBackShown && isNavBackShown && isBackEnabled;
          var backBtnEle = getEle(BACK_BUTTON);
          backBtnEle && backBtnEle.classList[isBackElementShown ? 'remove' : 'add'](HIDE);
        }
      };
      self.titleTextWidth = function() {
        if (!titleTextWidth) {
          var bounds = ionic.DomUtil.getTextBounds(getEle(TITLE));
          titleTextWidth = Math.min(bounds && bounds.width || 30);
        }
        return titleTextWidth;
      };
      self.titleWidth = function() {
        var titleWidth = self.titleTextWidth();
        var offsetWidth = getEle(TITLE).offsetWidth;
        if (offsetWidth < titleWidth) {
          titleWidth = offsetWidth + (titleLeft - titleRight - 5);
        }
        return titleWidth;
      };
      self.titleTextX = function() {
        return ($element[0].offsetWidth / 2) - (self.titleWidth() / 2);
      };
      self.titleLeftRight = function() {
        return titleLeft - titleRight;
      };
      self.backButtonTextLeft = function() {
        var offsetLeft = 0;
        var ele = getEle(BACK_TEXT);
        while (ele) {
          offsetLeft += ele.offsetLeft;
          ele = ele.parentElement;
        }
        return offsetLeft;
      };
      self.resetBackButton = function() {
        if ($ionicConfig.backButton.previousTitleText()) {
          var previousTitleEle = getEle(PREVIOUS_TITLE);
          if (previousTitleEle) {
            previousTitleEle.classList.remove(HIDE);
            var newPreviousTitleText = $ionicHistory.backTitle();
            if (newPreviousTitleText !== previousTitleText) {
              previousTitleText = previousTitleEle.innerHTML = newPreviousTitleText;
            }
          }
          var defaultTitleEle = getEle(DEFAULT_TITLE);
          if (defaultTitleEle) {
            defaultTitleEle.classList.remove(HIDE);
          }
        }
      };
      self.align = function(textAlign) {
        var titleEle = getEle(TITLE);
        textAlign = textAlign || $attrs.alignTitle || $ionicConfig.navBar.alignTitle();
        var widths = self.calcWidths(textAlign, false);
        if (isBackShown && previousTitleText && $ionicConfig.backButton.previousTitleText()) {
          var previousTitleWidths = self.calcWidths(textAlign, true);
          var availableTitleWidth = $element[0].offsetWidth - previousTitleWidths.titleLeft - previousTitleWidths.titleRight;
          if (self.titleTextWidth() <= availableTitleWidth) {
            widths = previousTitleWidths;
          }
        }
        return self.updatePositions(titleEle, widths.titleLeft, widths.titleRight, widths.buttonsLeft, widths.buttonsRight, widths.css, widths.showPrevTitle);
      };
      self.calcWidths = function(textAlign, isPreviousTitle) {
        var titleEle = getEle(TITLE);
        var backBtnEle = getEle(BACK_BUTTON);
        var x,
            y,
            z,
            b,
            c,
            d,
            childSize,
            bounds;
        var childNodes = $element[0].childNodes;
        var buttonsLeft = 0;
        var buttonsRight = 0;
        var isCountRightOfTitle;
        var updateTitleLeft = 0;
        var updateTitleRight = 0;
        var updateCss = '';
        var backButtonWidth = 0;
        for (x = 0; x < childNodes.length; x++) {
          c = childNodes[x];
          childSize = 0;
          if (c.nodeType == 1) {
            if (c === titleEle) {
              isCountRightOfTitle = true;
              continue;
            }
            if (c.classList.contains(HIDE)) {
              continue;
            }
            if (isBackShown && c === backBtnEle) {
              for (y = 0; y < c.childNodes.length; y++) {
                b = c.childNodes[y];
                if (b.nodeType == 1) {
                  if (b.classList.contains(BACK_TEXT)) {
                    for (z = 0; z < b.children.length; z++) {
                      d = b.children[z];
                      if (isPreviousTitle) {
                        if (d.classList.contains(DEFAULT_TITLE))
                          continue;
                        backButtonWidth += d.offsetWidth;
                      } else {
                        if (d.classList.contains(PREVIOUS_TITLE))
                          continue;
                        backButtonWidth += d.offsetWidth;
                      }
                    }
                  } else {
                    backButtonWidth += b.offsetWidth;
                  }
                } else if (b.nodeType == 3 && b.nodeValue.trim()) {
                  bounds = ionic.DomUtil.getTextBounds(b);
                  backButtonWidth += bounds && bounds.width || 0;
                }
              }
              childSize = backButtonWidth || c.offsetWidth;
            } else {
              childSize = c.offsetWidth;
            }
          } else if (c.nodeType == 3 && c.nodeValue.trim()) {
            bounds = ionic.DomUtil.getTextBounds(c);
            childSize = bounds && bounds.width || 0;
          }
          if (isCountRightOfTitle) {
            buttonsRight += childSize;
          } else {
            buttonsLeft += childSize;
          }
        }
        if (textAlign == 'left') {
          updateCss = 'title-left';
          if (buttonsLeft) {
            updateTitleLeft = buttonsLeft + 15;
          }
          if (buttonsRight) {
            updateTitleRight = buttonsRight + 15;
          }
        } else if (textAlign == 'right') {
          updateCss = 'title-right';
          if (buttonsLeft) {
            updateTitleLeft = buttonsLeft + 15;
          }
          if (buttonsRight) {
            updateTitleRight = buttonsRight + 15;
          }
        } else {
          var margin = Math.max(buttonsLeft, buttonsRight) + 10;
          if (margin > 10) {
            updateTitleLeft = updateTitleRight = margin;
          }
        }
        return {
          backButtonWidth: backButtonWidth,
          buttonsLeft: buttonsLeft,
          buttonsRight: buttonsRight,
          titleLeft: updateTitleLeft,
          titleRight: updateTitleRight,
          showPrevTitle: isPreviousTitle,
          css: updateCss
        };
      };
      self.updatePositions = function(titleEle, updateTitleLeft, updateTitleRight, buttonsLeft, buttonsRight, updateCss, showPreviousTitle) {
        var deferred = $q.defer();
        if (titleEle) {
          if (updateTitleLeft !== titleLeft) {
            titleEle.style.left = updateTitleLeft ? updateTitleLeft + 'px' : '';
            titleLeft = updateTitleLeft;
          }
          if (updateTitleRight !== titleRight) {
            titleEle.style.right = updateTitleRight ? updateTitleRight + 'px' : '';
            titleRight = updateTitleRight;
          }
          if (updateCss !== titleCss) {
            updateCss && titleEle.classList.add(updateCss);
            titleCss && titleEle.classList.remove(titleCss);
            titleCss = updateCss;
          }
        }
        if ($ionicConfig.backButton.previousTitleText()) {
          var prevTitle = getEle(PREVIOUS_TITLE);
          var defaultTitle = getEle(DEFAULT_TITLE);
          prevTitle && prevTitle.classList[showPreviousTitle ? 'remove' : 'add'](HIDE);
          defaultTitle && defaultTitle.classList[showPreviousTitle ? 'add' : 'remove'](HIDE);
        }
        ionic.requestAnimationFrame(function() {
          if (titleEle && titleEle.offsetWidth + 10 < titleEle.scrollWidth) {
            var minRight = buttonsRight + 5;
            var testRight = $element[0].offsetWidth - titleLeft - self.titleTextWidth() - 20;
            updateTitleRight = testRight < minRight ? minRight : testRight;
            if (updateTitleRight !== titleRight) {
              titleEle.style.right = updateTitleRight + 'px';
              titleRight = updateTitleRight;
            }
          }
          deferred.resolve();
        });
        return deferred.promise;
      };
      self.setCss = function(elementClassname, css) {
        ionic.DomUtil.cachedStyles(getEle(elementClassname), css);
      };
      var eleCache = {};
      function getEle(className) {
        if (!eleCache[className]) {
          eleCache[className] = $element[0].querySelector('.' + className);
        }
        return eleCache[className];
      }
      $scope.$on('$destroy', function() {
        for (var n in eleCache)
          eleCache[n] = null;
      });
    }]);
    IonicModule.service('$ionicListDelegate', ionic.DelegateService(['showReorder', 'showDelete', 'canSwipeItems', 'closeOptionButtons'])).controller('$ionicList', ['$scope', '$attrs', '$ionicListDelegate', '$ionicHistory', function($scope, $attrs, $ionicListDelegate, $ionicHistory) {
      var self = this;
      var isSwipeable = true;
      var isReorderShown = false;
      var isDeleteShown = false;
      var deregisterInstance = $ionicListDelegate._registerInstance(self, $attrs.delegateHandle, function() {
        return $ionicHistory.isActiveScope($scope);
      });
      $scope.$on('$destroy', deregisterInstance);
      self.showReorder = function(show) {
        if (arguments.length) {
          isReorderShown = !!show;
        }
        return isReorderShown;
      };
      self.showDelete = function(show) {
        if (arguments.length) {
          isDeleteShown = !!show;
        }
        return isDeleteShown;
      };
      self.canSwipeItems = function(can) {
        if (arguments.length) {
          isSwipeable = !!can;
        }
        return isSwipeable;
      };
      self.closeOptionButtons = function() {
        self.listView && self.listView.clearDragEffects();
      };
    }]);
    IonicModule.controller('$ionicNavBar', ['$scope', '$element', '$attrs', '$compile', '$timeout', '$ionicNavBarDelegate', '$ionicConfig', '$ionicHistory', function($scope, $element, $attrs, $compile, $timeout, $ionicNavBarDelegate, $ionicConfig, $ionicHistory) {
      var CSS_HIDE = 'hide';
      var DATA_NAV_BAR_CTRL = '$ionNavBarController';
      var PRIMARY_BUTTONS = 'primaryButtons';
      var SECONDARY_BUTTONS = 'secondaryButtons';
      var BACK_BUTTON = 'backButton';
      var ITEM_TYPES = 'primaryButtons secondaryButtons leftButtons rightButtons title'.split(' ');
      var self = this;
      var headerBars = [];
      var navElementHtml = {};
      var isVisible = true;
      var queuedTransitionStart,
          queuedTransitionEnd,
          latestTransitionId;
      $element.parent().data(DATA_NAV_BAR_CTRL, self);
      var delegateHandle = $attrs.delegateHandle || 'navBar' + ionic.Utils.nextUid();
      var deregisterInstance = $ionicNavBarDelegate._registerInstance(self, delegateHandle);
      self.init = function() {
        $element.addClass('nav-bar-container');
        ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', $ionicConfig.views.transition());
        self.createHeaderBar(false);
        self.createHeaderBar(true);
        $scope.$emit('ionNavBar.init', delegateHandle);
      };
      self.createHeaderBar = function(isActive, navBarClass) {
        var containerEle = jqLite('<div class="nav-bar-block">');
        ionic.DomUtil.cachedAttr(containerEle, 'nav-bar', isActive ? 'active' : 'cached');
        var alignTitle = $attrs.alignTitle || $ionicConfig.navBar.alignTitle();
        var headerBarEle = jqLite('<ion-header-bar>').addClass($attrs.class).attr('align-title', alignTitle);
        if (isDefined($attrs.noTapScroll))
          headerBarEle.attr('no-tap-scroll', $attrs.noTapScroll);
        var titleEle = jqLite('<div class="title title-' + alignTitle + '">');
        var navEle = {};
        var lastViewItemEle = {};
        var leftButtonsEle,
            rightButtonsEle;
        navEle[BACK_BUTTON] = createNavElement(BACK_BUTTON);
        navEle[BACK_BUTTON] && headerBarEle.append(navEle[BACK_BUTTON]);
        headerBarEle.append(titleEle);
        forEach(ITEM_TYPES, function(itemType) {
          navEle[itemType] = createNavElement(itemType);
          positionItem(navEle[itemType], itemType);
        });
        for (var x = 0; x < headerBarEle[0].children.length; x++) {
          headerBarEle[0].children[x].classList.add('header-item');
        }
        containerEle.append(headerBarEle);
        $element.append($compile(containerEle)($scope.$new()));
        var headerBarCtrl = headerBarEle.data('$ionHeaderBarController');
        var headerBarInstance = {
          isActive: isActive,
          title: function(newTitleText) {
            headerBarCtrl.title(newTitleText);
          },
          setItem: function(navBarItemEle, itemType) {
            headerBarInstance.removeItem(itemType);
            if (navBarItemEle) {
              if (itemType === 'title') {
                headerBarInstance.title("");
              }
              positionItem(navBarItemEle, itemType);
              if (navEle[itemType]) {
                navEle[itemType].addClass(CSS_HIDE);
              }
              lastViewItemEle[itemType] = navBarItemEle;
            } else if (navEle[itemType]) {
              navEle[itemType].removeClass(CSS_HIDE);
            }
          },
          removeItem: function(itemType) {
            if (lastViewItemEle[itemType]) {
              lastViewItemEle[itemType].scope().$destroy();
              lastViewItemEle[itemType].remove();
              lastViewItemEle[itemType] = null;
            }
          },
          containerEle: function() {
            return containerEle;
          },
          headerBarEle: function() {
            return headerBarEle;
          },
          afterLeave: function() {
            forEach(ITEM_TYPES, function(itemType) {
              headerBarInstance.removeItem(itemType);
            });
            headerBarCtrl.resetBackButton();
          },
          controller: function() {
            return headerBarCtrl;
          },
          destroy: function() {
            forEach(ITEM_TYPES, function(itemType) {
              headerBarInstance.removeItem(itemType);
            });
            containerEle.scope().$destroy();
            for (var n in navEle) {
              if (navEle[n]) {
                navEle[n].removeData();
                navEle[n] = null;
              }
            }
            leftButtonsEle && leftButtonsEle.removeData();
            rightButtonsEle && rightButtonsEle.removeData();
            titleEle.removeData();
            headerBarEle.removeData();
            containerEle.remove();
            containerEle = headerBarEle = titleEle = leftButtonsEle = rightButtonsEle = null;
          }
        };
        function positionItem(ele, itemType) {
          if (!ele)
            return;
          if (itemType === 'title') {
            titleEle.append(ele);
          } else if (itemType == 'rightButtons' || (itemType == SECONDARY_BUTTONS && $ionicConfig.navBar.positionSecondaryButtons() != 'left') || (itemType == PRIMARY_BUTTONS && $ionicConfig.navBar.positionPrimaryButtons() == 'right')) {
            if (!rightButtonsEle) {
              rightButtonsEle = jqLite('<div class="buttons buttons-right">');
              headerBarEle.append(rightButtonsEle);
            }
            if (itemType == SECONDARY_BUTTONS) {
              rightButtonsEle.append(ele);
            } else {
              rightButtonsEle.prepend(ele);
            }
          } else {
            if (!leftButtonsEle) {
              leftButtonsEle = jqLite('<div class="buttons buttons-left">');
              if (navEle[BACK_BUTTON]) {
                navEle[BACK_BUTTON].after(leftButtonsEle);
              } else {
                headerBarEle.prepend(leftButtonsEle);
              }
            }
            if (itemType == SECONDARY_BUTTONS) {
              leftButtonsEle.append(ele);
            } else {
              leftButtonsEle.prepend(ele);
            }
          }
        }
        headerBars.push(headerBarInstance);
        return headerBarInstance;
      };
      self.navElement = function(type, html) {
        if (isDefined(html)) {
          navElementHtml[type] = html;
        }
        return navElementHtml[type];
      };
      self.update = function(viewData) {
        var showNavBar = !viewData.hasHeaderBar && viewData.showNavBar;
        viewData.transition = $ionicConfig.views.transition();
        if (!showNavBar) {
          viewData.direction = 'none';
        }
        self.enable(showNavBar);
        var enteringHeaderBar = self.isInitialized ? getOffScreenHeaderBar() : getOnScreenHeaderBar();
        var leavingHeaderBar = self.isInitialized ? getOnScreenHeaderBar() : null;
        var enteringHeaderCtrl = enteringHeaderBar.controller();
        enteringHeaderCtrl.enableBack(viewData.enableBack, true);
        enteringHeaderCtrl.showBack(viewData.showBack, true);
        enteringHeaderCtrl.updateBackButton();
        self.title(viewData.title, enteringHeaderBar);
        self.showBar(showNavBar);
        if (viewData.navBarItems) {
          forEach(ITEM_TYPES, function(itemType) {
            enteringHeaderBar.setItem(viewData.navBarItems[itemType], itemType);
          });
        }
        self.transition(enteringHeaderBar, leavingHeaderBar, viewData);
        self.isInitialized = true;
      };
      self.transition = function(enteringHeaderBar, leavingHeaderBar, viewData) {
        var enteringHeaderBarCtrl = enteringHeaderBar.controller();
        var transitionFn = $ionicConfig.transitions.navBar[viewData.navBarTransition] || $ionicConfig.transitions.navBar.none;
        var transitionId = viewData.transitionId;
        enteringHeaderBarCtrl.beforeEnter(viewData);
        var navBarTransition = transitionFn(enteringHeaderBar, leavingHeaderBar, viewData.direction, viewData.shouldAnimate && self.isInitialized);
        ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', viewData.navBarTransition);
        ionic.DomUtil.cachedAttr($element, 'nav-bar-direction', viewData.direction);
        if (navBarTransition.shouldAnimate) {
          navBarAttr(enteringHeaderBar, 'stage');
        } else {
          navBarAttr(enteringHeaderBar, 'entering');
          navBarAttr(leavingHeaderBar, 'leaving');
        }
        enteringHeaderBarCtrl.resetBackButton();
        navBarTransition.run(0);
        $timeout(enteringHeaderBarCtrl.align, 16);
        queuedTransitionStart = function() {
          if (latestTransitionId !== transitionId)
            return;
          navBarAttr(enteringHeaderBar, 'entering');
          navBarAttr(leavingHeaderBar, 'leaving');
          navBarTransition.run(1);
          queuedTransitionEnd = function() {
            if (latestTransitionId == transitionId || !navBarTransition.shouldAnimate) {
              for (var x = 0; x < headerBars.length; x++) {
                headerBars[x].isActive = false;
              }
              enteringHeaderBar.isActive = true;
              navBarAttr(enteringHeaderBar, 'active');
              navBarAttr(leavingHeaderBar, 'cached');
              queuedTransitionEnd = null;
            }
          };
          queuedTransitionStart = null;
        };
        queuedTransitionStart();
      };
      self.triggerTransitionStart = function(triggerTransitionId) {
        latestTransitionId = triggerTransitionId;
        queuedTransitionStart && queuedTransitionStart();
      };
      self.triggerTransitionEnd = function() {
        queuedTransitionEnd && queuedTransitionEnd();
      };
      self.showBar = function(shouldShow) {
        if (arguments.length) {
          self.visibleBar(shouldShow);
          $scope.$parent.$hasHeader = !!shouldShow;
        }
        return !!$scope.$parent.$hasHeader;
      };
      self.visibleBar = function(shouldShow) {
        if (shouldShow && !isVisible) {
          $element.removeClass(CSS_HIDE);
        } else if (!shouldShow && isVisible) {
          $element.addClass(CSS_HIDE);
        }
        isVisible = shouldShow;
      };
      self.enable = function(val) {
        self.visibleBar(val);
        for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
          if ($ionicNavBarDelegate._instances[x] !== self)
            $ionicNavBarDelegate._instances[x].visibleBar(false);
        }
      };
      self.showBackButton = function(shouldShow) {
        for (var x = 0; x < headerBars.length; x++) {
          headerBars[x].controller().showNavBack(!!shouldShow);
        }
        $scope.$isBackButtonShown = !!shouldShow;
        return $scope.$isBackButtonShown;
      };
      self.showActiveBackButton = function(shouldShow) {
        var headerBar = getOnScreenHeaderBar();
        headerBar && headerBar.controller().showBack(shouldShow);
      };
      self.title = function(newTitleText, headerBar) {
        if (isDefined(newTitleText)) {
          newTitleText = newTitleText || '';
          headerBar = headerBar || getOnScreenHeaderBar();
          headerBar && headerBar.title(newTitleText);
          $scope.$title = newTitleText;
          $ionicHistory.currentTitle(newTitleText);
        }
        return $scope.$title;
      };
      self.align = function(val, headerBar) {
        headerBar = headerBar || getOnScreenHeaderBar();
        headerBar && headerBar.controller().align(val);
      };
      self.changeTitle = function(val) {
        deprecatedWarning('changeTitle(val)', 'title(val)');
        self.title(val);
      };
      self.setTitle = function(val) {
        deprecatedWarning('setTitle(val)', 'title(val)');
        self.title(val);
      };
      self.getTitle = function() {
        deprecatedWarning('getTitle()', 'title()');
        return self.title();
      };
      self.back = function() {
        deprecatedWarning('back()', '$ionicHistory.goBack()');
        $ionicHistory.goBack();
      };
      self.getPreviousTitle = function() {
        deprecatedWarning('getPreviousTitle()', '$ionicHistory.backTitle()');
        $ionicHistory.goBack();
      };
      function deprecatedWarning(oldMethod, newMethod) {
        var warn = console.warn || console.log;
        warn && warn('navBarController.' + oldMethod + ' is deprecated, please use ' + newMethod + ' instead');
      }
      function createNavElement(type) {
        if (navElementHtml[type]) {
          return jqLite(navElementHtml[type]);
        }
      }
      function getOnScreenHeaderBar() {
        for (var x = 0; x < headerBars.length; x++) {
          if (headerBars[x].isActive)
            return headerBars[x];
        }
      }
      function getOffScreenHeaderBar() {
        for (var x = 0; x < headerBars.length; x++) {
          if (!headerBars[x].isActive)
            return headerBars[x];
        }
      }
      function navBarAttr(ctrl, val) {
        ctrl && ionic.DomUtil.cachedAttr(ctrl.containerEle(), 'nav-bar', val);
      }
      $scope.$on('$destroy', function() {
        $scope.$parent.$hasHeader = false;
        $element.parent().removeData(DATA_NAV_BAR_CTRL);
        for (var x = 0; x < headerBars.length; x++) {
          headerBars[x].destroy();
        }
        $element.remove();
        $element = headerBars = null;
        deregisterInstance();
      });
    }]);
    IonicModule.controller('$ionicNavView', ['$scope', '$element', '$attrs', '$compile', '$controller', '$ionicNavBarDelegate', '$ionicNavViewDelegate', '$ionicHistory', '$ionicViewSwitcher', function($scope, $element, $attrs, $compile, $controller, $ionicNavBarDelegate, $ionicNavViewDelegate, $ionicHistory, $ionicViewSwitcher) {
      var DATA_ELE_IDENTIFIER = '$eleId';
      var DATA_DESTROY_ELE = '$destroyEle';
      var DATA_NO_CACHE = '$noCache';
      var VIEW_STATUS_ACTIVE = 'active';
      var VIEW_STATUS_CACHED = 'cached';
      var self = this;
      var direction;
      var isPrimary = false;
      var navBarDelegate;
      var activeEleId;
      var navViewAttr = $ionicViewSwitcher.navViewAttr;
      self.scope = $scope;
      self.init = function() {
        var navViewName = $attrs.name || '';
        var parent = $element.parent().inheritedData('$uiView');
        var parentViewName = ((parent && parent.state) ? parent.state.name : '');
        if (navViewName.indexOf('@') < 0)
          navViewName = navViewName + '@' + parentViewName;
        var viewData = {
          name: navViewName,
          state: null
        };
        $element.data('$uiView', viewData);
        var deregisterInstance = $ionicNavViewDelegate._registerInstance(self, $attrs.delegateHandle);
        $scope.$on('$destroy', deregisterInstance);
        $scope.$on('$ionicHistory.deselect', self.cacheCleanup);
        return viewData;
      };
      self.register = function(viewLocals) {
        var leavingView = extend({}, $ionicHistory.currentView());
        var registerData = $ionicHistory.register($scope, viewLocals);
        self.update(registerData);
        self.render(registerData, viewLocals, leavingView);
      };
      self.update = function(registerData) {
        isPrimary = true;
        direction = registerData.direction;
        var parentNavViewCtrl = $element.parent().inheritedData('$ionNavViewController');
        if (parentNavViewCtrl) {
          parentNavViewCtrl.isPrimary(false);
          if (direction === 'enter' || direction === 'exit') {
            parentNavViewCtrl.direction(direction);
            if (direction === 'enter') {
              direction = 'none';
            }
          }
        }
      };
      self.render = function(registerData, viewLocals, leavingView) {
        var enteringView = $ionicHistory.getViewById(registerData.viewId) || {};
        var switcher = $ionicViewSwitcher.create(self, viewLocals, enteringView, leavingView);
        switcher.init(registerData, function() {
          switcher.transition(self.direction(), registerData.enableBack);
        });
      };
      self.beforeEnter = function(transitionData) {
        if (isPrimary) {
          navBarDelegate = transitionData.navBarDelegate;
          var associatedNavBarCtrl = getAssociatedNavBarCtrl();
          associatedNavBarCtrl && associatedNavBarCtrl.update(transitionData);
        }
      };
      self.activeEleId = function(eleId) {
        if (arguments.length) {
          activeEleId = eleId;
        }
        return activeEleId;
      };
      self.transitionEnd = function() {
        var viewElements = $element.children();
        var x,
            l,
            viewElement;
        for (x = 0, l = viewElements.length; x < l; x++) {
          viewElement = viewElements.eq(x);
          if (viewElement.data(DATA_ELE_IDENTIFIER) === activeEleId) {
            navViewAttr(viewElement, VIEW_STATUS_ACTIVE);
          } else if (navViewAttr(viewElement) === 'leaving' || navViewAttr(viewElement) === VIEW_STATUS_ACTIVE || navViewAttr(viewElement) === VIEW_STATUS_CACHED) {
            if (viewElement.data(DATA_DESTROY_ELE) || viewElement.data(DATA_NO_CACHE)) {
              $ionicViewSwitcher.destroyViewEle(viewElement);
            } else {
              navViewAttr(viewElement, VIEW_STATUS_CACHED);
            }
          }
        }
      };
      self.cacheCleanup = function() {
        var viewElements = $element.children();
        for (var x = 0,
            l = viewElements.length; x < l; x++) {
          if (viewElements.eq(x).data(DATA_DESTROY_ELE)) {
            $ionicViewSwitcher.destroyViewEle(viewElements.eq(x));
          }
        }
      };
      self.clearCache = function() {
        var viewElements = $element.children();
        var viewElement,
            viewScope;
        for (var x = 0,
            l = viewElements.length; x < l; x++) {
          viewElement = viewElements.eq(x);
          if (navViewAttr(viewElement) == VIEW_STATUS_CACHED) {
            $ionicViewSwitcher.destroyViewEle(viewElement);
          } else if (navViewAttr(viewElement) == VIEW_STATUS_ACTIVE) {
            viewScope = viewElement.scope();
            viewScope && viewScope.$broadcast('$ionicView.clearCache');
          }
        }
      };
      self.getViewElements = function() {
        return $element.children();
      };
      self.appendViewElement = function(viewEle, viewLocals) {
        var linkFn = $compile(viewEle);
        $element.append(viewEle);
        var viewScope = $scope.$new();
        if (viewLocals && viewLocals.$$controller) {
          viewLocals.$scope = viewScope;
          var controller = $controller(viewLocals.$$controller, viewLocals);
          $element.children().data('$ngControllerController', controller);
        }
        linkFn(viewScope);
        return viewScope;
      };
      self.title = function(val) {
        var associatedNavBarCtrl = getAssociatedNavBarCtrl();
        associatedNavBarCtrl && associatedNavBarCtrl.title(val);
      };
      self.enableBackButton = function(shouldEnable) {
        var associatedNavBarCtrl = getAssociatedNavBarCtrl();
        associatedNavBarCtrl && associatedNavBarCtrl.enableBackButton(shouldEnable);
      };
      self.showBackButton = function(shouldShow) {
        var associatedNavBarCtrl = getAssociatedNavBarCtrl();
        associatedNavBarCtrl && associatedNavBarCtrl.showActiveBackButton(shouldShow);
      };
      self.showBar = function(val) {
        var associatedNavBarCtrl = getAssociatedNavBarCtrl();
        associatedNavBarCtrl && associatedNavBarCtrl.showBar(val);
      };
      self.isPrimary = function(val) {
        if (arguments.length) {
          isPrimary = val;
        }
        return isPrimary;
      };
      self.direction = function(val) {
        if (arguments.length) {
          direction = val;
        }
        return direction;
      };
      function getAssociatedNavBarCtrl() {
        if (navBarDelegate) {
          for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
            if ($ionicNavBarDelegate._instances[x].$$delegateHandle == navBarDelegate) {
              return $ionicNavBarDelegate._instances[x];
            }
          }
        }
        return $element.inheritedData('$ionNavBarController');
      }
    }]);
    IonicModule.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout', '$window', '$location', '$document', '$ionicScrollDelegate', '$ionicHistory', function($scope, scrollViewOptions, $timeout, $window, $location, $document, $ionicScrollDelegate, $ionicHistory) {
      var self = this;
      self.__timeout = $timeout;
      self._scrollViewOptions = scrollViewOptions;
      var element = self.element = scrollViewOptions.el;
      var $element = self.$element = jqLite(element);
      var scrollView = self.scrollView = new ionic.views.Scroll(scrollViewOptions);
      ($element.parent().length ? $element.parent() : $element).data('$$ionicScrollController', self);
      var deregisterInstance = $ionicScrollDelegate._registerInstance(self, scrollViewOptions.delegateHandle, function() {
        return $ionicHistory.isActiveScope($scope);
      });
      if (!angular.isDefined(scrollViewOptions.bouncing)) {
        ionic.Platform.ready(function() {
          if (scrollView.options) {
            scrollView.options.bouncing = true;
            if (ionic.Platform.isAndroid()) {
              scrollView.options.bouncing = false;
              scrollView.options.deceleration = 0.95;
            }
          }
        });
      }
      var resize = angular.bind(scrollView, scrollView.resize);
      ionic.on('resize', resize, $window);
      var scrollFunc = function(e) {
        var detail = (e.originalEvent || e).detail || {};
        $scope.$onScroll && $scope.$onScroll({
          event: e,
          scrollTop: detail.scrollTop || 0,
          scrollLeft: detail.scrollLeft || 0
        });
      };
      $element.on('scroll', scrollFunc);
      $scope.$on('$destroy', function() {
        deregisterInstance();
        scrollView.__cleanup();
        ionic.off('resize', resize, $window);
        $window.removeEventListener('resize', resize);
        scrollViewOptions = null;
        self._scrollViewOptions.el = null;
        self._scrollViewOptions = null;
        $element.off('scroll', scrollFunc);
        $element = null;
        self.$element = null;
        element = null;
        self.element = null;
        self.scrollView = null;
        scrollView = null;
      });
      $timeout(function() {
        scrollView && scrollView.run && scrollView.run();
      });
      self.getScrollView = function() {
        return self.scrollView;
      };
      self.getScrollPosition = function() {
        return self.scrollView.getValues();
      };
      self.resize = function() {
        return $timeout(resize).then(function() {
          $element && $element.triggerHandler('scroll.resize');
        });
      };
      self.scrollTop = function(shouldAnimate) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          scrollView.scrollTo(0, 0, !!shouldAnimate);
        });
      };
      self.scrollBottom = function(shouldAnimate) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          var max = scrollView.getScrollMax();
          scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
        });
      };
      self.scrollTo = function(left, top, shouldAnimate) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          scrollView.scrollTo(left, top, !!shouldAnimate);
        });
      };
      self.zoomTo = function(zoom, shouldAnimate, originLeft, originTop) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          scrollView.zoomTo(zoom, !!shouldAnimate, originLeft, originTop);
        });
      };
      self.zoomBy = function(zoom, shouldAnimate, originLeft, originTop) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          scrollView.zoomBy(zoom, !!shouldAnimate, originLeft, originTop);
        });
      };
      self.scrollBy = function(left, top, shouldAnimate) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          scrollView.scrollBy(left, top, !!shouldAnimate);
        });
      };
      self.anchorScroll = function(shouldAnimate) {
        ionic.DomUtil.blurAll();
        self.resize().then(function() {
          var hash = $location.hash();
          var elm = hash && $document[0].getElementById(hash);
          if (!(hash && elm)) {
            scrollView.scrollTo(0, 0, !!shouldAnimate);
            return;
          }
          var curElm = elm;
          var scrollLeft = 0,
              scrollTop = 0,
              levelsClimbed = 0;
          do {
            if (curElm !== null)
              scrollLeft += curElm.offsetLeft;
            if (curElm !== null)
              scrollTop += curElm.offsetTop;
            curElm = curElm.offsetParent;
            levelsClimbed++;
          } while (curElm.attributes != self.element.attributes && curElm.offsetParent);
          scrollView.scrollTo(scrollLeft, scrollTop, !!shouldAnimate);
        });
      };
      self._setRefresher = function(refresherScope, refresherElement) {
        var refresher = self.refresher = refresherElement;
        var refresherHeight = self.refresher.clientHeight || 60;
        scrollView.activatePullToRefresh(refresherHeight, function() {
          refresher.classList.add('active');
          refresherScope.$onPulling();
        }, function() {
          refresher.classList.remove('active');
          refresher.classList.remove('refreshing');
          refresher.classList.remove('refreshing-tail');
        }, function() {
          refresher.classList.add('refreshing');
          refresherScope.$onRefresh();
        }, function() {
          refresher.classList.remove('invisible');
        }, function() {
          refresher.classList.add('invisible');
        }, function() {
          refresher.classList.add('refreshing-tail');
        });
      };
    }]);
    IonicModule.controller('$ionicSideMenus', ['$scope', '$attrs', '$ionicSideMenuDelegate', '$ionicPlatform', '$ionicBody', '$ionicHistory', function($scope, $attrs, $ionicSideMenuDelegate, $ionicPlatform, $ionicBody, $ionicHistory) {
      var self = this;
      var rightShowing,
          leftShowing,
          isDragging;
      var startX,
          lastX,
          offsetX,
          isAsideExposed;
      var enableMenuWithBackViews = true;
      self.$scope = $scope;
      self.initialize = function(options) {
        self.left = options.left;
        self.right = options.right;
        self.setContent(options.content);
        self.dragThresholdX = options.dragThresholdX || 10;
        $ionicHistory.registerHistory(self.$scope);
      };
      self.setContent = function(content) {
        if (content) {
          self.content = content;
          self.content.onDrag = function(e) {
            self._handleDrag(e);
          };
          self.content.endDrag = function(e) {
            self._endDrag(e);
          };
        }
      };
      self.isOpenLeft = function() {
        return self.getOpenAmount() > 0;
      };
      self.isOpenRight = function() {
        return self.getOpenAmount() < 0;
      };
      self.toggleLeft = function(shouldOpen) {
        if (isAsideExposed || !self.left.isEnabled)
          return;
        var openAmount = self.getOpenAmount();
        if (arguments.length === 0) {
          shouldOpen = openAmount <= 0;
        }
        self.content.enableAnimation();
        if (!shouldOpen) {
          self.openPercentage(0);
        } else {
          self.openPercentage(100);
        }
      };
      self.toggleRight = function(shouldOpen) {
        if (isAsideExposed || !self.right.isEnabled)
          return;
        var openAmount = self.getOpenAmount();
        if (arguments.length === 0) {
          shouldOpen = openAmount >= 0;
        }
        self.content.enableAnimation();
        if (!shouldOpen) {
          self.openPercentage(0);
        } else {
          self.openPercentage(-100);
        }
      };
      self.toggle = function(side) {
        if (side == 'right') {
          self.toggleRight();
        } else {
          self.toggleLeft();
        }
      };
      self.close = function() {
        self.openPercentage(0);
      };
      self.getOpenAmount = function() {
        return self.content && self.content.getTranslateX() || 0;
      };
      self.getOpenRatio = function() {
        var amount = self.getOpenAmount();
        if (amount >= 0) {
          return amount / self.left.width;
        }
        return amount / self.right.width;
      };
      self.isOpen = function() {
        return self.getOpenAmount() !== 0;
      };
      self.getOpenPercentage = function() {
        return self.getOpenRatio() * 100;
      };
      self.openPercentage = function(percentage) {
        var p = percentage / 100;
        if (self.left && percentage >= 0) {
          self.openAmount(self.left.width * p);
        } else if (self.right && percentage < 0) {
          var maxRight = self.right.width;
          self.openAmount(self.right.width * p);
        }
        $ionicBody.enableClass((percentage !== 0), 'menu-open');
      };
      self.openAmount = function(amount) {
        var maxLeft = self.left && self.left.width || 0;
        var maxRight = self.right && self.right.width || 0;
        if (!(self.left && self.left.isEnabled) && amount > 0) {
          self.content.setTranslateX(0);
          return;
        }
        if (!(self.right && self.right.isEnabled) && amount < 0) {
          self.content.setTranslateX(0);
          return;
        }
        if (leftShowing && amount > maxLeft) {
          self.content.setTranslateX(maxLeft);
          return;
        }
        if (rightShowing && amount < -maxRight) {
          self.content.setTranslateX(-maxRight);
          return;
        }
        self.content.setTranslateX(amount);
        if (amount >= 0) {
          leftShowing = true;
          rightShowing = false;
          if (amount > 0) {
            self.right && self.right.pushDown && self.right.pushDown();
            self.left && self.left.bringUp && self.left.bringUp();
          }
        } else {
          rightShowing = true;
          leftShowing = false;
          self.right && self.right.bringUp && self.right.bringUp();
          self.left && self.left.pushDown && self.left.pushDown();
        }
      };
      self.snapToRest = function(e) {
        self.content.enableAnimation();
        isDragging = false;
        var ratio = self.getOpenRatio();
        if (ratio === 0) {
          self.openPercentage(0);
          return;
        }
        var velocityThreshold = 0.3;
        var velocityX = e.gesture.velocityX;
        var direction = e.gesture.direction;
        if (ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
          self.openPercentage(0);
        } else if (ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
          self.openPercentage(100);
        } else if (ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
          self.openPercentage(0);
        } else if (ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
          self.openPercentage(-100);
        } else if (direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
          self.openPercentage(100);
        } else if (direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
          self.openPercentage(-100);
        } else {
          self.openPercentage(0);
        }
      };
      self.enableMenuWithBackViews = function(val) {
        if (arguments.length) {
          enableMenuWithBackViews = !!val;
        }
        return enableMenuWithBackViews;
      };
      self.isAsideExposed = function() {
        return !!isAsideExposed;
      };
      self.exposeAside = function(shouldExposeAside) {
        if (!(self.left && self.left.isEnabled) && !(self.right && self.right.isEnabled))
          return;
        self.close();
        isAsideExposed = shouldExposeAside;
        if (self.left && self.left.isEnabled) {
          self.content.setMarginLeft(isAsideExposed ? self.left.width : 0);
        } else if (self.right && self.right.isEnabled) {
          self.content.setMarginRight(isAsideExposed ? self.right.width : 0);
        }
        self.$scope.$emit('$ionicExposeAside', isAsideExposed);
      };
      self.activeAsideResizing = function(isResizing) {
        $ionicBody.enableClass(isResizing, 'aside-resizing');
      };
      self._endDrag = function(e) {
        if (isAsideExposed)
          return;
        if (isDragging) {
          self.snapToRest(e);
        }
        startX = null;
        lastX = null;
        offsetX = null;
      };
      self._handleDrag = function(e) {
        if (isAsideExposed)
          return;
        if (!startX) {
          startX = e.gesture.touches[0].pageX;
          lastX = startX;
        } else {
          lastX = e.gesture.touches[0].pageX;
        }
        if (!isDragging && Math.abs(lastX - startX) > self.dragThresholdX) {
          startX = lastX;
          isDragging = true;
          self.content.disableAnimation();
          offsetX = self.getOpenAmount();
        }
        if (isDragging) {
          self.openAmount(offsetX + (lastX - startX));
        }
      };
      self.canDragContent = function(canDrag) {
        if (arguments.length) {
          $scope.dragContent = !!canDrag;
        }
        return $scope.dragContent;
      };
      self.edgeThreshold = 25;
      self.edgeThresholdEnabled = false;
      self.edgeDragThreshold = function(value) {
        if (arguments.length) {
          if (angular.isNumber(value) && value > 0) {
            self.edgeThreshold = value;
            self.edgeThresholdEnabled = true;
          } else {
            self.edgeThresholdEnabled = !!value;
          }
        }
        return self.edgeThresholdEnabled;
      };
      self.isDraggableTarget = function(e) {
        var shouldOnlyAllowEdgeDrag = self.edgeThresholdEnabled && !self.isOpen();
        var startX = e.gesture.startEvent && e.gesture.startEvent.center && e.gesture.startEvent.center.pageX;
        var dragIsWithinBounds = !shouldOnlyAllowEdgeDrag || startX <= self.edgeThreshold || startX >= self.content.element.offsetWidth - self.edgeThreshold;
        var backView = $ionicHistory.backView();
        var menuEnabled = enableMenuWithBackViews ? true : !backView;
        if (!menuEnabled) {
          var currentView = $ionicHistory.currentView() || {};
          return backView.historyId !== currentView.historyId;
        }
        return ($scope.dragContent || self.isOpen()) && dragIsWithinBounds && !e.gesture.srcEvent.defaultPrevented && menuEnabled && !e.target.tagName.match(/input|textarea|select|object|embed/i) && !e.target.isContentEditable && !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-scroll') == 'true');
      };
      $scope.sideMenuContentTranslateX = 0;
      var deregisterBackButtonAction = angular.noop;
      var closeSideMenu = angular.bind(self, self.close);
      $scope.$watch(function() {
        return self.getOpenAmount() !== 0;
      }, function(isOpen) {
        deregisterBackButtonAction();
        if (isOpen) {
          deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(closeSideMenu, PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU);
        }
      });
      var deregisterInstance = $ionicSideMenuDelegate._registerInstance(self, $attrs.delegateHandle, function() {
        return $ionicHistory.isActiveScope($scope);
      });
      $scope.$on('$destroy', function() {
        deregisterInstance();
        deregisterBackButtonAction();
        self.$scope = null;
        if (self.content) {
          self.content.element = null;
          self.content = null;
        }
      });
      self.initialize({
        left: {width: 275},
        right: {width: 275}
      });
    }]);
    IonicModule.controller('$ionicTab', ['$scope', '$ionicHistory', '$attrs', '$location', '$state', function($scope, $ionicHistory, $attrs, $location, $state) {
      this.$scope = $scope;
      this.hrefMatchesState = function() {
        return $attrs.href && $location.path().indexOf($attrs.href.replace(/^#/, '').replace(/\/$/, '')) === 0;
      };
      this.srefMatchesState = function() {
        return $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
      };
      this.navNameMatchesState = function() {
        return this.navViewName && $ionicHistory.isCurrentStateNavView(this.navViewName);
      };
      this.tabMatchesState = function() {
        return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
      };
    }]);
    IonicModule.controller('$ionicTabs', ['$scope', '$element', '$ionicHistory', function($scope, $element, $ionicHistory) {
      var self = this;
      var selectedTab = null;
      var selectedTabIndex;
      self.tabs = [];
      self.selectedIndex = function() {
        return self.tabs.indexOf(selectedTab);
      };
      self.selectedTab = function() {
        return selectedTab;
      };
      self.add = function(tab) {
        $ionicHistory.registerHistory(tab);
        self.tabs.push(tab);
      };
      self.remove = function(tab) {
        var tabIndex = self.tabs.indexOf(tab);
        if (tabIndex === -1) {
          return;
        }
        if (tab.$tabSelected) {
          self.deselect(tab);
          if (self.tabs.length === 1) {} else {
            var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
            self.select(self.tabs[newTabIndex]);
          }
        }
        self.tabs.splice(tabIndex, 1);
      };
      self.deselect = function(tab) {
        if (tab.$tabSelected) {
          selectedTab = selectedTabIndex = null;
          tab.$tabSelected = false;
          (tab.onDeselect || angular.noop)();
          tab.$broadcast && tab.$broadcast('$ionicHistory.deselect');
        }
      };
      self.select = function(tab, shouldEmitEvent) {
        var tabIndex;
        if (angular.isNumber(tab)) {
          tabIndex = tab;
          if (tabIndex >= self.tabs.length)
            return;
          tab = self.tabs[tabIndex];
        } else {
          tabIndex = self.tabs.indexOf(tab);
        }
        if (arguments.length === 1) {
          shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
        }
        if (selectedTab && selectedTab.$historyId == tab.$historyId) {
          if (shouldEmitEvent) {
            $ionicHistory.goToHistoryRoot(tab.$historyId);
          }
        } else if (selectedTabIndex !== tabIndex) {
          forEach(self.tabs, function(tab) {
            self.deselect(tab);
          });
          selectedTab = tab;
          selectedTabIndex = tabIndex;
          if (self.$scope && self.$scope.$parent) {
            self.$scope.$parent.$activeHistoryId = tab.$historyId;
          }
          tab.$tabSelected = true;
          (tab.onSelect || angular.noop)();
          if (shouldEmitEvent) {
            $scope.$emit('$ionicHistory.change', {
              type: 'tab',
              tabIndex: tabIndex,
              historyId: tab.$historyId,
              navViewName: tab.navViewName,
              hasNavView: !!tab.navViewName,
              title: tab.title,
              url: tab.href,
              uiSref: tab.uiSref
            });
          }
        }
      };
      self.hasActiveScope = function() {
        for (var x = 0; x < self.tabs.length; x++) {
          if ($ionicHistory.isActiveScope(self.tabs[x])) {
            return true;
          }
        }
        return false;
      };
    }]);
    IonicModule.controller('$ionicView', ['$scope', '$element', '$attrs', '$compile', '$rootScope', '$ionicViewSwitcher', function($scope, $element, $attrs, $compile, $rootScope, $ionicViewSwitcher) {
      var self = this;
      var navElementHtml = {};
      var navViewCtrl;
      var navBarDelegateHandle;
      var hasViewHeaderBar;
      var deregisters = [];
      var viewTitle;
      var deregIonNavBarInit = $scope.$on('ionNavBar.init', function(ev, delegateHandle) {
        ev.stopPropagation();
        navBarDelegateHandle = delegateHandle;
      });
      self.init = function() {
        deregIonNavBarInit();
        var modalCtrl = $element.inheritedData('$ionModalController');
        navViewCtrl = $element.inheritedData('$ionNavViewController');
        if (!navViewCtrl || modalCtrl)
          return;
        $scope.$on('$ionicView.beforeEnter', self.beforeEnter);
        $scope.$on('$ionicView.afterEnter', afterEnter);
        $scope.$on('$ionicView.beforeLeave', deregisterFns);
      };
      self.beforeEnter = function(ev, transData) {
        if (transData && !transData.viewNotified) {
          transData.viewNotified = true;
          if (!$rootScope.$$phase)
            $scope.$digest();
          viewTitle = isDefined($attrs.viewTitle) ? $attrs.viewTitle : $attrs.title;
          var navBarItems = {};
          for (var n in navElementHtml) {
            navBarItems[n] = generateNavBarItem(navElementHtml[n]);
          }
          navViewCtrl.beforeEnter({
            title: viewTitle,
            direction: transData.direction,
            transition: transData.transition,
            navBarTransition: transData.navBarTransition,
            transitionId: transData.transitionId,
            shouldAnimate: transData.shouldAnimate,
            enableBack: transData.enableBack,
            showBack: !attrTrue('hideBackButton'),
            navBarItems: navBarItems,
            navBarDelegate: navBarDelegateHandle || null,
            showNavBar: !attrTrue('hideNavBar'),
            hasHeaderBar: !!hasViewHeaderBar
          });
          deregisterFns();
        }
      };
      function afterEnter() {
        var viewTitleAttr = isDefined($attrs.viewTitle) && 'viewTitle' || isDefined($attrs.title) && 'title';
        if (viewTitleAttr) {
          titleUpdate($attrs[viewTitleAttr]);
          deregisters.push($attrs.$observe(viewTitleAttr, titleUpdate));
        }
        if (isDefined($attrs.hideBackButton)) {
          deregisters.push($scope.$watch($attrs.hideBackButton, function(val) {
            navViewCtrl.showBackButton(!val);
          }));
        }
        if (isDefined($attrs.hideNavBar)) {
          deregisters.push($scope.$watch($attrs.hideNavBar, function(val) {
            navViewCtrl.showBar(!val);
          }));
        }
      }
      function titleUpdate(newTitle) {
        if (isDefined(newTitle) && newTitle !== viewTitle) {
          viewTitle = newTitle;
          navViewCtrl.title(viewTitle);
        }
      }
      function deregisterFns() {
        for (var x = 0; x < deregisters.length; x++) {
          deregisters[x]();
        }
        deregisters = [];
      }
      function generateNavBarItem(html) {
        if (html) {
          return $compile(html)($scope.$new());
        }
      }
      function attrTrue(key) {
        return !!$scope.$eval($attrs[key]);
      }
      self.navElement = function(type, html) {
        navElementHtml[type] = html;
      };
    }]);
    IonicModule.directive('ionActionSheet', ['$document', function($document) {
      return {
        restrict: 'E',
        scope: true,
        replace: true,
        link: function($scope, $element) {
          var keyUp = function(e) {
            if (e.which == 27) {
              $scope.cancel();
              $scope.$apply();
            }
          };
          var backdropClick = function(e) {
            if (e.target == $element[0]) {
              $scope.cancel();
              $scope.$apply();
            }
          };
          $scope.$on('$destroy', function() {
            $element.remove();
            $document.unbind('keyup', keyUp);
          });
          $document.bind('keyup', keyUp);
          $element.bind('click', backdropClick);
        },
        template: '<div class="action-sheet-backdrop">' + '<div class="action-sheet-wrapper">' + '<div class="action-sheet">' + '<div class="action-sheet-group">' + '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' + '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons" ng-bind-html="button.text"></button>' + '</div>' + '<div class="action-sheet-group" ng-if="destructiveText">' + '<button class="button destructive" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' + '</div>' + '<div class="action-sheet-group" ng-if="cancelText">' + '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' + '</div>' + '</div>' + '</div>' + '</div>'
      };
    }]);
    IonicModule.directive('ionCheckbox', ['$ionicConfig', function($ionicConfig) {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        transclude: true,
        template: '<label class="item item-checkbox">' + '<div class="checkbox checkbox-input-hidden disable-pointer-events">' + '<input type="checkbox">' + '<i class="checkbox-icon"></i>' + '</div>' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '</label>',
        compile: function(element, attr) {
          var input = element.find('input');
          forEach({
            'name': attr.name,
            'ng-value': attr.ngValue,
            'ng-model': attr.ngModel,
            'ng-checked': attr.ngChecked,
            'ng-disabled': attr.ngDisabled,
            'ng-true-value': attr.ngTrueValue,
            'ng-false-value': attr.ngFalseValue,
            'ng-change': attr.ngChange
          }, function(value, name) {
            if (isDefined(value)) {
              input.attr(name, value);
            }
          });
          var checkboxWrapper = element[0].querySelector('.checkbox');
          checkboxWrapper.classList.add('checkbox-' + $ionicConfig.form.checkbox());
        }
      };
    }]);
    var COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR = "Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.";
    var COLLECTION_REPEAT_ATTR_HEIGHT_ERROR = "collection-repeat expected attribute collection-item-height to be a an expression that returns a number (in pixels) or percentage.";
    var COLLECTION_REPEAT_ATTR_WIDTH_ERROR = "collection-repeat expected attribute collection-item-width to be a an expression that returns a number (in pixels) or percentage.";
    var COLLECTION_REPEAT_ATTR_REPEAT_ERROR = "collection-repeat expected expression in form of '_item_ in _collection_[ track by _id_]' but got '%'";
    IonicModule.directive('collectionRepeat', ['$collectionRepeatManager', '$collectionDataSource', '$parse', function($collectionRepeatManager, $collectionDataSource, $parse) {
      return {
        priority: 1000,
        transclude: 'element',
        terminal: true,
        $$tlb: true,
        require: ['^$ionicScroll', '^?ionNavView'],
        controller: [function() {}],
        link: function($scope, $element, $attr, ctrls, $transclude) {
          var scrollCtrl = ctrls[0];
          var navViewCtrl = ctrls[1];
          var wrap = jqLite('<div style="position:relative;">');
          $element.parent()[0].insertBefore(wrap[0], $element[0]);
          wrap.append($element);
          var scrollView = scrollCtrl.scrollView;
          if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
            throw new Error(COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR);
          }
          var isVertical = !!scrollView.options.scrollingY;
          if (isVertical && !$attr.collectionItemHeight) {
            throw new Error(COLLECTION_REPEAT_ATTR_HEIGHT_ERROR);
          } else if (!isVertical && !$attr.collectionItemWidth) {
            throw new Error(COLLECTION_REPEAT_ATTR_WIDTH_ERROR);
          }
          var heightParsed = $parse($attr.collectionItemHeight || '"100%"');
          var widthParsed = $parse($attr.collectionItemWidth || '"100%"');
          var heightGetter = function(scope, locals) {
            var result = heightParsed(scope, locals);
            if (isString(result) && result.indexOf('%') > -1) {
              return Math.floor(parseInt(result) / 100 * scrollView.__clientHeight);
            }
            return parseInt(result);
          };
          var widthGetter = function(scope, locals) {
            var result = widthParsed(scope, locals);
            if (isString(result) && result.indexOf('%') > -1) {
              return Math.floor(parseInt(result) / 100 * scrollView.__clientWidth);
            }
            return parseInt(result);
          };
          var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          if (!match) {
            throw new Error(COLLECTION_REPEAT_ATTR_REPEAT_ERROR.replace('%', $attr.collectionRepeat));
          }
          var keyExpr = match[1];
          var listExpr = match[2];
          var trackByExpr = match[3];
          var dataSource = new $collectionDataSource({
            scope: $scope,
            transcludeFn: $transclude,
            transcludeParent: $element.parent(),
            keyExpr: keyExpr,
            listExpr: listExpr,
            trackByExpr: trackByExpr,
            heightGetter: heightGetter,
            widthGetter: widthGetter
          });
          var collectionRepeatManager = new $collectionRepeatManager({
            dataSource: dataSource,
            element: scrollCtrl.$element,
            scrollView: scrollCtrl.scrollView
          });
          var listExprParsed = $parse(listExpr);
          $scope.$watchCollection(listExprParsed, function(value) {
            if (value && !angular.isArray(value)) {
              throw new Error("collection-repeat expects an array to repeat over, but instead got '" + typeof value + "'.");
            }
            rerender(value);
          });
          var scrollViewContent = scrollCtrl.scrollView.__content;
          function rerender(value) {
            var beforeSiblings = [];
            var afterSiblings = [];
            var before = true;
            forEach(scrollViewContent.children, function(node, i) {
              if (ionic.DomUtil.elementIsDescendant($element[0], node, scrollViewContent)) {
                before = false;
              } else {
                if (node.hasAttribute('collection-repeat-ignore'))
                  return;
                var width = node.offsetWidth;
                var height = node.offsetHeight;
                if (width && height) {
                  var element = jqLite(node);
                  (before ? beforeSiblings : afterSiblings).push({
                    width: node.offsetWidth,
                    height: node.offsetHeight,
                    element: element,
                    scope: element.isolateScope() || element.scope(),
                    isOutside: true
                  });
                }
              }
            });
            scrollView.resize();
            dataSource.setData(value, beforeSiblings, afterSiblings);
            collectionRepeatManager.resize();
          }
          var requiresRerender;
          function rerenderOnResize() {
            rerender(listExprParsed($scope));
            requiresRerender = (!scrollViewContent.clientWidth && !scrollViewContent.clientHeight);
          }
          function viewEnter() {
            if (requiresRerender) {
              rerenderOnResize();
            }
          }
          scrollCtrl.$element.on('scroll.resize', rerenderOnResize);
          ionic.on('resize', rerenderOnResize, window);
          var deregisterViewListener;
          if (navViewCtrl) {
            deregisterViewListener = navViewCtrl.scope.$on('$ionicView.afterEnter', viewEnter);
          }
          $scope.$on('$destroy', function() {
            collectionRepeatManager.destroy();
            dataSource.destroy();
            ionic.off('resize', rerenderOnResize, window);
            (deregisterViewListener || angular.noop)();
          });
        }
      };
    }]).directive({
      ngSrc: collectionRepeatSrcDirective('ngSrc', 'src'),
      ngSrcset: collectionRepeatSrcDirective('ngSrcset', 'srcset'),
      ngHref: collectionRepeatSrcDirective('ngHref', 'href')
    });
    function collectionRepeatSrcDirective(ngAttrName, attrName) {
      return [function() {
        return {
          priority: '99',
          link: function(scope, element, attr) {
            attr.$observe(ngAttrName, function(value) {
              if (!value) {
                element[0].removeAttribute(attrName);
              }
            });
          }
        };
      }];
    }
    IonicModule.directive('ionContent', ['$timeout', '$controller', '$ionicBind', function($timeout, $controller, $ionicBind) {
      return {
        restrict: 'E',
        require: '^?ionNavView',
        scope: true,
        priority: 800,
        compile: function(element, attr) {
          var innerElement;
          element.addClass('scroll-content ionic-scroll');
          if (attr.scroll != 'false') {
            innerElement = jqLite('<div class="scroll"></div>');
            innerElement.append(element.contents());
            element.append(innerElement);
          } else {
            element.addClass('scroll-content-false');
          }
          return {pre: prelink};
          function prelink($scope, $element, $attr, navViewCtrl) {
            var parentScope = $scope.$parent;
            $scope.$watch(function() {
              return (parentScope.$hasHeader ? ' has-header' : '') + (parentScope.$hasSubheader ? ' has-subheader' : '') + (parentScope.$hasFooter ? ' has-footer' : '') + (parentScope.$hasSubfooter ? ' has-subfooter' : '') + (parentScope.$hasTabs ? ' has-tabs' : '') + (parentScope.$hasTabsTop ? ' has-tabs-top' : '');
            }, function(className, oldClassName) {
              $element.removeClass(oldClassName);
              $element.addClass(className);
            });
            $scope.$hasHeader = $scope.$hasSubheader = $scope.$hasFooter = $scope.$hasSubfooter = $scope.$hasTabs = $scope.$hasTabsTop = false;
            $ionicBind($scope, $attr, {
              $onScroll: '&onScroll',
              $onScrollComplete: '&onScrollComplete',
              hasBouncing: '@',
              padding: '@',
              direction: '@',
              scrollbarX: '@',
              scrollbarY: '@',
              startX: '@',
              startY: '@',
              scrollEventInterval: '@'
            });
            $scope.direction = $scope.direction || 'y';
            if (angular.isDefined($attr.padding)) {
              $scope.$watch($attr.padding, function(newVal) {
                (innerElement || $element).toggleClass('padding', !!newVal);
              });
            }
            if ($attr.scroll === "false") {} else if (attr.overflowScroll === "true") {
              $element.addClass('overflow-scroll');
            } else {
              var scrollViewOptions = {
                el: $element[0],
                delegateHandle: attr.delegateHandle,
                locking: (attr.locking || 'true') === 'true',
                bouncing: $scope.$eval($scope.hasBouncing),
                startX: $scope.$eval($scope.startX) || 0,
                startY: $scope.$eval($scope.startY) || 0,
                scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                scrollingX: $scope.direction.indexOf('x') >= 0,
                scrollingY: $scope.direction.indexOf('y') >= 0,
                scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 10,
                scrollingComplete: function() {
                  $scope.$onScrollComplete({
                    scrollTop: this.__scrollTop,
                    scrollLeft: this.__scrollLeft
                  });
                }
              };
              $controller('$ionicScroll', {
                $scope: $scope,
                scrollViewOptions: scrollViewOptions
              });
              $scope.$on('$destroy', function() {
                scrollViewOptions.scrollingComplete = angular.noop;
                delete scrollViewOptions.el;
                innerElement = null;
                $element = null;
                attr.$$element = null;
              });
            }
          }
        }
      };
    }]);
    IonicModule.directive('exposeAsideWhen', ['$window', function($window) {
      return {
        restrict: 'A',
        require: '^ionSideMenus',
        link: function($scope, $element, $attr, sideMenuCtrl) {
          function checkAsideExpose() {
            var mq = $attr.exposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.exposeAsideWhen;
            sideMenuCtrl.exposeAside($window.matchMedia(mq).matches);
            sideMenuCtrl.activeAsideResizing(false);
          }
          function onResize() {
            sideMenuCtrl.activeAsideResizing(true);
            debouncedCheck();
          }
          var debouncedCheck = ionic.debounce(function() {
            $scope.$apply(function() {
              checkAsideExpose();
            });
          }, 300, false);
          checkAsideExpose();
          ionic.on('resize', onResize, $window);
          $scope.$on('$destroy', function() {
            ionic.off('resize', onResize, $window);
          });
        }
      };
    }]);
    var GESTURE_DIRECTIVES = 'onHold onTap onTouch onRelease onDrag onDragUp onDragRight onDragDown onDragLeft onSwipe onSwipeUp onSwipeRight onSwipeDown onSwipeLeft'.split(' ');
    GESTURE_DIRECTIVES.forEach(function(name) {
      IonicModule.directive(name, gestureDirective(name));
    });
    function gestureDirective(directiveName) {
      return ['$ionicGesture', '$parse', function($ionicGesture, $parse) {
        var eventType = directiveName.substr(2).toLowerCase();
        return function(scope, element, attr) {
          var fn = $parse(attr[directiveName]);
          var listener = function(ev) {
            scope.$apply(function() {
              fn(scope, {$event: ev});
            });
          };
          var gesture = $ionicGesture.on(eventType, listener, element);
          scope.$on('$destroy', function() {
            $ionicGesture.off(gesture, eventType, listener);
          });
        };
      }];
    }
    IonicModule.directive('ionHeaderBar', tapScrollToTopDirective()).directive('ionHeaderBar', headerFooterBarDirective(true)).directive('ionFooterBar', headerFooterBarDirective(false));
    function tapScrollToTopDirective() {
      return ['$ionicScrollDelegate', function($ionicScrollDelegate) {
        return {
          restrict: 'E',
          link: function($scope, $element, $attr) {
            if ($attr.noTapScroll == 'true') {
              return;
            }
            ionic.on('tap', onTap, $element[0]);
            $scope.$on('$destroy', function() {
              ionic.off('tap', onTap, $element[0]);
            });
            function onTap(e) {
              var depth = 3;
              var current = e.target;
              while (depth-- && current) {
                if (current.classList.contains('button') || current.tagName.match(/input|textarea|select/i) || current.isContentEditable) {
                  return;
                }
                current = current.parentNode;
              }
              var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
              var bounds = $element[0].getBoundingClientRect();
              if (ionic.DomUtil.rectContains(touch.pageX, touch.pageY, bounds.left, bounds.top - 20, bounds.left + bounds.width, bounds.top + bounds.height)) {
                $ionicScrollDelegate.scrollTop(true);
              }
            }
          }
        };
      }];
    }
    function headerFooterBarDirective(isHeader) {
      return ['$document', '$timeout', function($document, $timeout) {
        return {
          restrict: 'E',
          controller: '$ionicHeaderBar',
          compile: function(tElement, $attr) {
            tElement.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
            $timeout(function() {
              if (isHeader && $document[0].getElementsByClassName('tabs-top').length)
                tElement.addClass('has-tabs-top');
            });
            return {pre: prelink};
            function prelink($scope, $element, $attr, ctrl) {
              if (isHeader) {
                $scope.$watch(function() {
                  return $element[0].className;
                }, function(value) {
                  var isShown = value.indexOf('ng-hide') === -1;
                  var isSubheader = value.indexOf('bar-subheader') !== -1;
                  $scope.$hasHeader = isShown && !isSubheader;
                  $scope.$hasSubheader = isShown && isSubheader;
                });
                $scope.$on('$destroy', function() {
                  delete $scope.$hasHeader;
                  delete $scope.$hasSubheader;
                });
                ctrl.align();
                $scope.$on('$ionicHeader.align', function() {
                  ionic.requestAnimationFrame(ctrl.align);
                });
              } else {
                $scope.$watch(function() {
                  return $element[0].className;
                }, function(value) {
                  var isShown = value.indexOf('ng-hide') === -1;
                  var isSubfooter = value.indexOf('bar-subfooter') !== -1;
                  $scope.$hasFooter = isShown && !isSubfooter;
                  $scope.$hasSubfooter = isShown && isSubfooter;
                });
                $scope.$on('$destroy', function() {
                  delete $scope.$hasFooter;
                  delete $scope.$hasSubfooter;
                });
                $scope.$watch('$hasTabs', function(val) {
                  $element.toggleClass('has-tabs', !!val);
                });
              }
            }
          }
        };
      }];
    }
    IonicModule.directive('ionInfiniteScroll', ['$timeout', function($timeout) {
      function calculateMaxValue(distance, maximum, isPercent) {
        return isPercent ? maximum * (1 - parseFloat(distance, 10) / 100) : maximum - parseFloat(distance, 10);
      }
      return {
        restrict: 'E',
        require: ['^$ionicScroll', 'ionInfiniteScroll'],
        template: '<i class="icon {{icon()}} icon-refreshing"></i>',
        scope: {load: '&onInfinite'},
        controller: ['$scope', '$attrs', function($scope, $attrs) {
          this.isLoading = false;
          this.scrollView = null;
          this.getMaxScroll = function() {
            var distance = ($attrs.distance || '2.5%').trim();
            var isPercent = distance.indexOf('%') !== -1;
            var maxValues = this.scrollView.getScrollMax();
            return {
              left: this.scrollView.options.scrollingX ? calculateMaxValue(distance, maxValues.left, isPercent) : -1,
              top: this.scrollView.options.scrollingY ? calculateMaxValue(distance, maxValues.top, isPercent) : -1
            };
          };
        }],
        link: function($scope, $element, $attrs, ctrls) {
          var scrollCtrl = ctrls[0];
          var infiniteScrollCtrl = ctrls[1];
          var scrollView = infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
          $scope.icon = function() {
            return angular.isDefined($attrs.icon) ? $attrs.icon : 'ion-loading-d';
          };
          var onInfinite = function() {
            $element[0].classList.add('active');
            infiniteScrollCtrl.isLoading = true;
            $scope.load();
          };
          var finishInfiniteScroll = function() {
            $element[0].classList.remove('active');
            $timeout(function() {
              scrollView.resize();
              checkBounds();
            }, 0, false);
            infiniteScrollCtrl.isLoading = false;
          };
          $scope.$on('scroll.infiniteScrollComplete', function() {
            finishInfiniteScroll();
          });
          $scope.$on('$destroy', function() {
            if (scrollCtrl && scrollCtrl.$element)
              scrollCtrl.$element.off('scroll', checkBounds);
          });
          var checkBounds = ionic.animationFrameThrottle(checkInfiniteBounds);
          $timeout(checkBounds, 0, false);
          scrollCtrl.$element.on('scroll', checkBounds);
          function checkInfiniteBounds() {
            if (infiniteScrollCtrl.isLoading)
              return;
            var scrollValues = scrollView.getValues();
            var maxScroll = infiniteScrollCtrl.getMaxScroll();
            if ((maxScroll.left !== -1 && scrollValues.left >= maxScroll.left) || (maxScroll.top !== -1 && scrollValues.top >= maxScroll.top)) {
              onInfinite();
            }
          }
        }
      };
    }]);
    var ITEM_TPL_CONTENT_ANCHOR = '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
    var ITEM_TPL_CONTENT = '<div class="item-content"></div>';
    IonicModule.directive('ionItem', function() {
      return {
        restrict: 'E',
        controller: ['$scope', '$element', function($scope, $element) {
          this.$scope = $scope;
          this.$element = $element;
        }],
        scope: true,
        compile: function($element, $attrs) {
          var isAnchor = angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref) || angular.isDefined($attrs.uiSref);
          var isComplexItem = isAnchor || /ion-(delete|option|reorder)-button/i.test($element.html());
          if (isComplexItem) {
            var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
            innerElement.append($element.contents());
            $element.append(innerElement);
            $element.addClass('item item-complex');
          } else {
            $element.addClass('item');
          }
          return function link($scope, $element, $attrs) {
            $scope.$href = function() {
              return $attrs.href || $attrs.ngHref;
            };
            $scope.$target = function() {
              return $attrs.target || '_self';
            };
          };
        }
      };
    });
    var ITEM_TPL_DELETE_BUTTON = '<div class="item-left-edit item-delete enable-pointer-events">' + '</div>';
    IonicModule.directive('ionDeleteButton', function() {
      return {
        restrict: 'E',
        require: ['^ionItem', '^?ionList'],
        priority: Number.MAX_VALUE,
        compile: function($element, $attr) {
          $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
          return function($scope, $element, $attr, ctrls) {
            var itemCtrl = ctrls[0];
            var listCtrl = ctrls[1];
            var container = jqLite(ITEM_TPL_DELETE_BUTTON);
            container.append($element);
            itemCtrl.$element.append(container).addClass('item-left-editable');
            if (listCtrl && listCtrl.showDelete()) {
              container.addClass('visible active');
            }
          };
        }
      };
    });
    IonicModule.directive('itemFloatingLabel', function() {
      return {
        restrict: 'C',
        link: function(scope, element) {
          var el = element[0];
          var input = el.querySelector('input, textarea');
          var inputLabel = el.querySelector('.input-label');
          if (!input || !inputLabel)
            return;
          var onInput = function() {
            if (input.value) {
              inputLabel.classList.add('has-input');
            } else {
              inputLabel.classList.remove('has-input');
            }
          };
          input.addEventListener('input', onInput);
          var ngModelCtrl = angular.element(input).controller('ngModel');
          if (ngModelCtrl) {
            ngModelCtrl.$render = function() {
              input.value = ngModelCtrl.$viewValue || '';
              onInput();
            };
          }
          scope.$on('$destroy', function() {
            input.removeEventListener('input', onInput);
          });
        }
      };
    });
    var ITEM_TPL_OPTION_BUTTONS = '<div class="item-options invisible">' + '</div>';
    IonicModule.directive('ionOptionButton', ['$compile', function($compile) {
      function stopPropagation(e) {
        e.stopPropagation();
      }
      return {
        restrict: 'E',
        require: '^ionItem',
        priority: Number.MAX_VALUE,
        compile: function($element, $attr) {
          $attr.$set('class', ($attr['class'] || '') + ' button', true);
          return function($scope, $element, $attr, itemCtrl) {
            if (!itemCtrl.optionsContainer) {
              itemCtrl.optionsContainer = jqLite(ITEM_TPL_OPTION_BUTTONS);
              itemCtrl.$element.append(itemCtrl.optionsContainer);
            }
            itemCtrl.optionsContainer.append($element);
            itemCtrl.$element.addClass('item-right-editable');
            $element.on('click', stopPropagation);
          };
        }
      };
    }]);
    var ITEM_TPL_REORDER_BUTTON = '<div data-prevent-scroll="true" class="item-right-edit item-reorder enable-pointer-events">' + '</div>';
    IonicModule.directive('ionReorderButton', ['$parse', function($parse) {
      return {
        restrict: 'E',
        require: ['^ionItem', '^?ionList'],
        priority: Number.MAX_VALUE,
        compile: function($element, $attr) {
          $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
          $element[0].setAttribute('data-prevent-scroll', true);
          return function($scope, $element, $attr, ctrls) {
            var itemCtrl = ctrls[0];
            var listCtrl = ctrls[1];
            var onReorderFn = $parse($attr.onReorder);
            $scope.$onReorder = function(oldIndex, newIndex) {
              onReorderFn($scope, {
                $fromIndex: oldIndex,
                $toIndex: newIndex
              });
            };
            if (!$attr.ngClick && !$attr.onClick && !$attr.onclick) {
              $element[0].onclick = function(e) {
                e.stopPropagation();
                return false;
              };
            }
            var container = jqLite(ITEM_TPL_REORDER_BUTTON);
            container.append($element);
            itemCtrl.$element.append(container).addClass('item-right-editable');
            if (listCtrl && listCtrl.showReorder()) {
              container.addClass('visible active');
            }
          };
        }
      };
    }]);
    IonicModule.directive('keyboardAttach', function() {
      return function(scope, element, attrs) {
        ionic.on('native.keyboardshow', onShow, window);
        ionic.on('native.keyboardhide', onHide, window);
        ionic.on('native.showkeyboard', onShow, window);
        ionic.on('native.hidekeyboard', onHide, window);
        var scrollCtrl;
        function onShow(e) {
          if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
            return;
          }
          var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
          element.css('bottom', keyboardHeight + "px");
          scrollCtrl = element.controller('$ionicScroll');
          if (scrollCtrl) {
            scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
          }
        }
        function onHide() {
          if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
            return;
          }
          element.css('bottom', '');
          if (scrollCtrl) {
            scrollCtrl.scrollView.__container.style.bottom = '';
          }
        }
        scope.$on('$destroy', function() {
          ionic.off('native.keyboardshow', onShow, window);
          ionic.off('native.keyboardhide', onHide, window);
          ionic.off('native.showkeyboard', onShow, window);
          ionic.off('native.hidekeyboard', onHide, window);
        });
      };
    });
    function keyboardAttachGetClientHeight(element) {
      return element.clientHeight;
    }
    IonicModule.directive('ionList', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        require: ['ionList', '^?$ionicScroll'],
        controller: '$ionicList',
        compile: function($element, $attr) {
          var listEl = jqLite('<div class="list">').append($element.contents()).addClass($attr.type);
          $element.append(listEl);
          return function($scope, $element, $attrs, ctrls) {
            var listCtrl = ctrls[0];
            var scrollCtrl = ctrls[1];
            $timeout(init);
            function init() {
              var listView = listCtrl.listView = new ionic.views.ListView({
                el: $element[0],
                listEl: $element.children()[0],
                scrollEl: scrollCtrl && scrollCtrl.element,
                scrollView: scrollCtrl && scrollCtrl.scrollView,
                onReorder: function(el, oldIndex, newIndex) {
                  var itemScope = jqLite(el).scope();
                  if (itemScope && itemScope.$onReorder) {
                    $timeout(function() {
                      itemScope.$onReorder(oldIndex, newIndex);
                    });
                  }
                },
                canSwipe: function() {
                  return listCtrl.canSwipeItems();
                }
              });
              $scope.$on('$destroy', function() {
                if (listView) {
                  listView.deregister && listView.deregister();
                  listView = null;
                }
              });
              if (isDefined($attr.canSwipe)) {
                $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
                  listCtrl.canSwipeItems(value);
                });
              }
              if (isDefined($attr.showDelete)) {
                $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
                  listCtrl.showDelete(value);
                });
              }
              if (isDefined($attr.showReorder)) {
                $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
                  listCtrl.showReorder(value);
                });
              }
              $scope.$watch(function() {
                return listCtrl.showDelete();
              }, function(isShown, wasShown) {
                if (!isShown && !wasShown) {
                  return;
                }
                if (isShown)
                  listCtrl.closeOptionButtons();
                listCtrl.canSwipeItems(!isShown);
                $element.children().toggleClass('list-left-editing', isShown);
                $element.toggleClass('disable-pointer-events', isShown);
                var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
                setButtonShown(deleteButton, listCtrl.showDelete);
              });
              $scope.$watch(function() {
                return listCtrl.showReorder();
              }, function(isShown, wasShown) {
                if (!isShown && !wasShown) {
                  return;
                }
                if (isShown)
                  listCtrl.closeOptionButtons();
                listCtrl.canSwipeItems(!isShown);
                $element.children().toggleClass('list-right-editing', isShown);
                $element.toggleClass('disable-pointer-events', isShown);
                var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
                setButtonShown(reorderButton, listCtrl.showReorder);
              });
              function setButtonShown(el, shown) {
                shown() && el.addClass('visible') || el.removeClass('active');
                ionic.requestAnimationFrame(function() {
                  shown() && el.addClass('active') || el.removeClass('visible');
                });
              }
            }
          };
        }
      };
    }]);
    IonicModule.directive('menuClose', ['$ionicHistory', function($ionicHistory) {
      return {
        restrict: 'AC',
        link: function($scope, $element) {
          $element.bind('click', function() {
            var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
            if (sideMenuCtrl) {
              $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: true,
                expire: 300
              });
              sideMenuCtrl.close();
            }
          });
        }
      };
    }]);
    IonicModule.directive('menuToggle', function() {
      return {
        restrict: 'AC',
        link: function($scope, $element, $attr) {
          $scope.$on('$ionicView.beforeEnter', function(ev, viewData) {
            if (viewData.enableBack) {
              var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
              if (!sideMenuCtrl.enableMenuWithBackViews()) {
                $element.addClass('hide');
              }
            } else {
              $element.removeClass('hide');
            }
          });
          $element.bind('click', function() {
            var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
            sideMenuCtrl && sideMenuCtrl.toggle($attr.menuToggle);
          });
        }
      };
    });
    IonicModule.directive('ionModal', [function() {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        controller: [function() {}],
        template: '<div class="modal-backdrop">' + '<div class="modal-wrapper" ng-transclude></div>' + '</div>'
      };
    }]);
    IonicModule.directive('ionModalView', function() {
      return {
        restrict: 'E',
        compile: function(element, attr) {
          element.addClass('modal');
        }
      };
    });
    IonicModule.directive('ionNavBackButton', ['$ionicConfig', '$document', function($ionicConfig, $document) {
      return {
        restrict: 'E',
        require: '^ionNavBar',
        compile: function(tElement, tAttrs) {
          var buttonEle = $document[0].createElement('button');
          for (var n in tAttrs.$attr) {
            buttonEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
          }
          if (!tAttrs.ngClick) {
            buttonEle.setAttribute('ng-click', '$ionicGoBack($event)');
          }
          buttonEle.className = 'button back-button hide buttons ' + (tElement.attr('class') || '');
          buttonEle.innerHTML = tElement.html() || '';
          var childNode;
          var hasIcon = hasIconClass(tElement[0]);
          var hasInnerText;
          var hasButtonText;
          var hasPreviousTitle;
          for (var x = 0; x < tElement[0].childNodes.length; x++) {
            childNode = tElement[0].childNodes[x];
            if (childNode.nodeType === 1) {
              if (hasIconClass(childNode)) {
                hasIcon = true;
              } else if (childNode.classList.contains('default-title')) {
                hasButtonText = true;
              } else if (childNode.classList.contains('previous-title')) {
                hasPreviousTitle = true;
              }
            } else if (!hasInnerText && childNode.nodeType === 3) {
              hasInnerText = !!childNode.nodeValue.trim();
            }
          }
          function hasIconClass(ele) {
            return /ion-|icon/.test(ele.className);
          }
          var defaultIcon = $ionicConfig.backButton.icon();
          if (!hasIcon && defaultIcon && defaultIcon !== 'none') {
            buttonEle.innerHTML = '<i class="icon ' + defaultIcon + '"></i> ' + buttonEle.innerHTML;
            buttonEle.className += ' button-clear';
          }
          if (!hasInnerText) {
            var buttonTextEle = $document[0].createElement('span');
            buttonTextEle.className = 'back-text';
            if (!hasButtonText && $ionicConfig.backButton.text()) {
              buttonTextEle.innerHTML += '<span class="default-title">' + $ionicConfig.backButton.text() + '</span>';
            }
            if (!hasPreviousTitle && $ionicConfig.backButton.previousTitleText()) {
              buttonTextEle.innerHTML += '<span class="previous-title"></span>';
            }
            buttonEle.appendChild(buttonTextEle);
          }
          tElement.attr('class', 'hide');
          tElement.empty();
          return {pre: function($scope, $element, $attr, navBarCtrl) {
              navBarCtrl.navElement('backButton', buttonEle.outerHTML);
              buttonEle = null;
            }};
        }
      };
    }]);
    IonicModule.directive('ionNavBar', function() {
      return {
        restrict: 'E',
        controller: '$ionicNavBar',
        scope: true,
        link: function($scope, $element, $attr, ctrl) {
          ctrl.init();
        }
      };
    });
    IonicModule.directive('ionNavButtons', ['$document', function($document) {
      return {
        require: '^ionNavBar',
        restrict: 'E',
        compile: function(tElement, tAttrs) {
          var side = 'left';
          if (/^primary|secondary|right$/i.test(tAttrs.side || '')) {
            side = tAttrs.side.toLowerCase();
          }
          var spanEle = $document[0].createElement('span');
          spanEle.className = side + '-buttons';
          spanEle.innerHTML = tElement.html();
          var navElementType = side + 'Buttons';
          tElement.attr('class', 'hide');
          tElement.empty();
          return {pre: function($scope, $element, $attrs, navBarCtrl) {
              var parentViewCtrl = $element.parent().data('$ionViewController');
              if (parentViewCtrl) {
                parentViewCtrl.navElement(navElementType, spanEle.outerHTML);
              } else {
                navBarCtrl.navElement(navElementType, spanEle.outerHTML);
              }
              spanEle = null;
            }};
        }
      };
    }]);
    IonicModule.directive('navDirection', ['$ionicViewSwitcher', function($ionicViewSwitcher) {
      return {
        restrict: 'A',
        priority: 1000,
        link: function($scope, $element, $attr) {
          $element.bind('click', function() {
            $ionicViewSwitcher.nextDirection($attr.navDirection);
          });
        }
      };
    }]);
    IonicModule.directive('ionNavTitle', ['$document', function($document) {
      return {
        require: '^ionNavBar',
        restrict: 'E',
        compile: function(tElement, tAttrs) {
          var navElementType = 'title';
          var spanEle = $document[0].createElement('span');
          for (var n in tAttrs.$attr) {
            spanEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
          }
          spanEle.classList.add('nav-bar-title');
          spanEle.innerHTML = tElement.html();
          tElement.attr('class', 'hide');
          tElement.empty();
          return {pre: function($scope, $element, $attrs, navBarCtrl) {
              var parentViewCtrl = $element.parent().data('$ionViewController');
              if (parentViewCtrl) {
                parentViewCtrl.navElement(navElementType, spanEle.outerHTML);
              } else {
                navBarCtrl.navElement(navElementType, spanEle.outerHTML);
              }
              spanEle = null;
            }};
        }
      };
    }]);
    IonicModule.directive('navTransition', ['$ionicViewSwitcher', function($ionicViewSwitcher) {
      return {
        restrict: 'A',
        priority: 1000,
        link: function($scope, $element, $attr) {
          $element.bind('click', function() {
            $ionicViewSwitcher.nextTransition($attr.navTransition);
          });
        }
      };
    }]);
    IonicModule.directive('ionNavView', ['$state', '$ionicConfig', function($state, $ionicConfig) {
      return {
        restrict: 'E',
        terminal: true,
        priority: 2000,
        transclude: true,
        controller: '$ionicNavView',
        compile: function(tElement, tAttrs, transclude) {
          tElement.addClass('view-container');
          ionic.DomUtil.cachedAttr(tElement, 'nav-view-transition', $ionicConfig.views.transition());
          return function($scope, $element, $attr, navViewCtrl) {
            var latestLocals;
            transclude($scope, function(clone) {
              $element.append(clone);
            });
            var viewData = navViewCtrl.init();
            $scope.$on('$stateChangeSuccess', function() {
              updateView(false);
            });
            $scope.$on('$viewContentLoading', function() {
              updateView(false);
            });
            updateView(true);
            function updateView(firstTime) {
              var viewLocals = $state.$current && $state.$current.locals[viewData.name];
              if (!viewLocals || (!firstTime && viewLocals === latestLocals))
                return;
              latestLocals = viewLocals;
              viewData.state = viewLocals.$$state;
              navViewCtrl.register(viewLocals);
            }
          };
        }
      };
    }]);
    IonicModule.config(['$provide', function($provide) {
      $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
        $delegate.shift();
        return $delegate;
      }]);
    }]).factory('$ionicNgClick', ['$parse', function($parse) {
      return function(scope, element, clickExpr) {
        var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);
        element.on('click', function(event) {
          scope.$apply(function() {
            clickHandler(scope, {$event: (event)});
          });
        });
        element.onclick = function(event) {};
      };
    }]).directive('ngClick', ['$ionicNgClick', function($ionicNgClick) {
      return function(scope, element, attr) {
        $ionicNgClick(scope, element, attr.ngClick);
      };
    }]).directive('ionStopEvent', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind(attr.ionStopEvent, eventStopPropagation);
        }
      };
    });
    function eventStopPropagation(e) {
      e.stopPropagation();
    }
    IonicModule.directive('ionPane', function() {
      return {
        restrict: 'E',
        link: function(scope, element, attr) {
          element.addClass('pane');
        }
      };
    });
    IonicModule.directive('ionPopover', [function() {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        controller: [function() {}],
        template: '<div class="popover-backdrop">' + '<div class="popover-wrapper" ng-transclude></div>' + '</div>'
      };
    }]);
    IonicModule.directive('ionPopoverView', function() {
      return {
        restrict: 'E',
        compile: function(element) {
          element.append(angular.element('<div class="popover-arrow"></div>'));
          element.addClass('popover');
        }
      };
    });
    IonicModule.directive('ionRadio', function() {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        transclude: true,
        template: '<label class="item item-radio">' + '<input type="radio" name="radio-group">' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' + '</label>',
        compile: function(element, attr) {
          if (attr.icon)
            element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
          var input = element.find('input');
          forEach({
            'name': attr.name,
            'value': attr.value,
            'disabled': attr.disabled,
            'ng-value': attr.ngValue,
            'ng-model': attr.ngModel,
            'ng-disabled': attr.ngDisabled,
            'ng-change': attr.ngChange
          }, function(value, name) {
            if (isDefined(value)) {
              input.attr(name, value);
            }
          });
          return function(scope, element, attr) {
            scope.getValue = function() {
              return scope.ngValue || attr.value;
            };
          };
        }
      };
    });
    IonicModule.directive('ionRefresher', ['$ionicBind', function($ionicBind) {
      return {
        restrict: 'E',
        replace: true,
        require: '^$ionicScroll',
        template: '<div class="scroll-refresher" collection-repeat-ignore>' + '<div class="ionic-refresher-content" ' + 'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' + '<div class="icon-pulling" ng-class="{\'pulling-rotation-disabled\':disablePullingRotation}">' + '<i class="icon {{pullingIcon}}"></i>' + '</div>' + '<div class="text-pulling" ng-bind-html="pullingText"></div>' + '<div class="icon-refreshing"><i class="icon {{refreshingIcon}}"></i></div>' + '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' + '</div>' + '</div>',
        compile: function($element, $attrs) {
          if (angular.isUndefined($attrs.pullingIcon)) {
            $attrs.$set('pullingIcon', 'ion-ios7-arrow-down');
          }
          if (angular.isUndefined($attrs.refreshingIcon)) {
            $attrs.$set('refreshingIcon', 'ion-loading-d');
          }
          return function($scope, $element, $attrs, scrollCtrl) {
            $ionicBind($scope, $attrs, {
              pullingIcon: '@',
              pullingText: '@',
              refreshingIcon: '@',
              refreshingText: '@',
              disablePullingRotation: '@',
              $onRefresh: '&onRefresh',
              $onPulling: '&onPulling'
            });
            scrollCtrl._setRefresher($scope, $element[0]);
            $scope.$on('scroll.refreshComplete', function() {
              $scope.$evalAsync(function() {
                scrollCtrl.scrollView.finishPullToRefresh();
              });
            });
          };
        }
      };
    }]);
    IonicModule.directive('ionScroll', ['$timeout', '$controller', '$ionicBind', function($timeout, $controller, $ionicBind) {
      return {
        restrict: 'E',
        scope: true,
        controller: function() {},
        compile: function(element, attr) {
          element.addClass('scroll-view ionic-scroll');
          var innerElement = jqLite('<div class="scroll"></div>');
          innerElement.append(element.contents());
          element.append(innerElement);
          return {pre: prelink};
          function prelink($scope, $element, $attr) {
            var scrollView,
                scrollCtrl;
            $ionicBind($scope, $attr, {
              direction: '@',
              paging: '@',
              $onScroll: '&onScroll',
              scroll: '@',
              scrollbarX: '@',
              scrollbarY: '@',
              zooming: '@',
              minZoom: '@',
              maxZoom: '@'
            });
            $scope.direction = $scope.direction || 'y';
            if (angular.isDefined($attr.padding)) {
              $scope.$watch($attr.padding, function(newVal) {
                innerElement.toggleClass('padding', !!newVal);
              });
            }
            if ($scope.$eval($scope.paging) === true) {
              innerElement.addClass('scroll-paging');
            }
            if (!$scope.direction) {
              $scope.direction = 'y';
            }
            var isPaging = $scope.$eval($scope.paging) === true;
            var scrollViewOptions = {
              el: $element[0],
              delegateHandle: $attr.delegateHandle,
              locking: ($attr.locking || 'true') === 'true',
              bouncing: $scope.$eval($attr.hasBouncing),
              paging: isPaging,
              scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
              scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
              scrollingX: $scope.direction.indexOf('x') >= 0,
              scrollingY: $scope.direction.indexOf('y') >= 0,
              zooming: $scope.$eval($scope.zooming) === true,
              maxZoom: $scope.$eval($scope.maxZoom) || 3,
              minZoom: $scope.$eval($scope.minZoom) || 0.5,
              preventDefault: true
            };
            if (isPaging) {
              scrollViewOptions.speedMultiplier = 0.8;
              scrollViewOptions.bouncing = false;
            }
            scrollCtrl = $controller('$ionicScroll', {
              $scope: $scope,
              scrollViewOptions: scrollViewOptions
            });
            scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;
          }
        }
      };
    }]);
    IonicModule.directive('ionSideMenu', function() {
      return {
        restrict: 'E',
        require: '^ionSideMenus',
        scope: true,
        compile: function(element, attr) {
          angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
          angular.isUndefined(attr.width) && attr.$set('width', '275');
          element.addClass('menu menu-' + attr.side);
          return function($scope, $element, $attr, sideMenuCtrl) {
            $scope.side = $attr.side || 'left';
            var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
              width: attr.width,
              el: $element[0],
              isEnabled: true
            });
            $scope.$watch($attr.width, function(val) {
              var numberVal = +val;
              if (numberVal && numberVal == val) {
                sideMenu.setWidth(+val);
              }
            });
            $scope.$watch($attr.isEnabled, function(val) {
              sideMenu.setIsEnabled(!!val);
            });
          };
        }
      };
    });
    IonicModule.directive('ionSideMenuContent', ['$timeout', '$ionicGesture', '$window', function($timeout, $ionicGesture, $window) {
      return {
        restrict: 'EA',
        require: '^ionSideMenus',
        scope: true,
        compile: function(element, attr) {
          element.addClass('menu-content pane');
          return {pre: prelink};
          function prelink($scope, $element, $attr, sideMenuCtrl) {
            var startCoord = null;
            var primaryScrollAxis = null;
            if (isDefined(attr.dragContent)) {
              $scope.$watch(attr.dragContent, function(value) {
                sideMenuCtrl.canDragContent(value);
              });
            } else {
              sideMenuCtrl.canDragContent(true);
            }
            if (isDefined(attr.edgeDragThreshold)) {
              $scope.$watch(attr.edgeDragThreshold, function(value) {
                sideMenuCtrl.edgeDragThreshold(value);
              });
            }
            function onContentTap(gestureEvt) {
              if (sideMenuCtrl.getOpenAmount() !== 0) {
                sideMenuCtrl.close();
                gestureEvt.gesture.srcEvent.preventDefault();
                startCoord = null;
                primaryScrollAxis = null;
              } else if (!startCoord) {
                startCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
              }
            }
            function onDragX(e) {
              if (!sideMenuCtrl.isDraggableTarget(e))
                return;
              if (getPrimaryScrollAxis(e) == 'x') {
                sideMenuCtrl._handleDrag(e);
                e.gesture.srcEvent.preventDefault();
              }
            }
            function onDragY(e) {
              if (getPrimaryScrollAxis(e) == 'x') {
                e.gesture.srcEvent.preventDefault();
              }
            }
            function onDragRelease(e) {
              sideMenuCtrl._endDrag(e);
              startCoord = null;
              primaryScrollAxis = null;
            }
            function getPrimaryScrollAxis(gestureEvt) {
              if (primaryScrollAxis) {
                return primaryScrollAxis;
              }
              if (gestureEvt && gestureEvt.gesture) {
                if (!startCoord) {
                  startCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
                } else {
                  var endCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
                  var xDistance = Math.abs(endCoord.x - startCoord.x);
                  var yDistance = Math.abs(endCoord.y - startCoord.y);
                  var scrollAxis = (xDistance < yDistance ? 'y' : 'x');
                  if (Math.max(xDistance, yDistance) > 30) {
                    primaryScrollAxis = scrollAxis;
                  }
                  return scrollAxis;
                }
              }
              return 'y';
            }
            var content = {
              element: element[0],
              onDrag: function(e) {},
              endDrag: function(e) {},
              getTranslateX: function() {
                return $scope.sideMenuContentTranslateX || 0;
              },
              setTranslateX: ionic.animationFrameThrottle(function(amount) {
                var xTransform = content.offsetX + amount;
                $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + xTransform + 'px,0,0)';
                $timeout(function() {
                  $scope.sideMenuContentTranslateX = amount;
                });
              }),
              setMarginLeft: ionic.animationFrameThrottle(function(amount) {
                if (amount) {
                  amount = parseInt(amount, 10);
                  $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px,0,0)';
                  $element[0].style.width = ($window.innerWidth - amount) + 'px';
                  content.offsetX = amount;
                } else {
                  $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,0,0)';
                  $element[0].style.width = '';
                  content.offsetX = 0;
                }
              }),
              setMarginRight: ionic.animationFrameThrottle(function(amount) {
                if (amount) {
                  amount = parseInt(amount, 10);
                  $element[0].style.width = ($window.innerWidth - amount) + 'px';
                  content.offsetX = amount;
                } else {
                  $element[0].style.width = '';
                  content.offsetX = 0;
                }
                $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,0,0)';
              }),
              enableAnimation: function() {
                $scope.animationEnabled = true;
                $element[0].classList.add('menu-animated');
              },
              disableAnimation: function() {
                $scope.animationEnabled = false;
                $element[0].classList.remove('menu-animated');
              },
              offsetX: 0
            };
            sideMenuCtrl.setContent(content);
            var gestureOpts = {stop_browser_behavior: false};
            var contentTapGesture = $ionicGesture.on('tap', onContentTap, $element, gestureOpts);
            var dragRightGesture = $ionicGesture.on('dragright', onDragX, $element, gestureOpts);
            var dragLeftGesture = $ionicGesture.on('dragleft', onDragX, $element, gestureOpts);
            var dragUpGesture = $ionicGesture.on('dragup', onDragY, $element, gestureOpts);
            var dragDownGesture = $ionicGesture.on('dragdown', onDragY, $element, gestureOpts);
            var releaseGesture = $ionicGesture.on('release', onDragRelease, $element, gestureOpts);
            $scope.$on('$destroy', function() {
              if (content) {
                content.element = null;
                content = null;
              }
              $ionicGesture.off(dragLeftGesture, 'dragleft', onDragX);
              $ionicGesture.off(dragRightGesture, 'dragright', onDragX);
              $ionicGesture.off(dragUpGesture, 'dragup', onDragY);
              $ionicGesture.off(dragDownGesture, 'dragdown', onDragY);
              $ionicGesture.off(releaseGesture, 'release', onDragRelease);
              $ionicGesture.off(contentTapGesture, 'tap', onContentTap);
            });
          }
        }
      };
    }]);
    IonicModule.directive('ionSideMenus', ['$ionicBody', function($ionicBody) {
      return {
        restrict: 'ECA',
        controller: '$ionicSideMenus',
        compile: function(element, attr) {
          attr.$set('class', (attr['class'] || '') + ' view');
          return {pre: prelink};
          function prelink($scope, $element, $attrs, ctrl) {
            ctrl.enableMenuWithBackViews($scope.$eval($attrs.enableMenuWithBackViews));
            $scope.$on('$ionicExposeAside', function(evt, isAsideExposed) {
              if (!$scope.$exposeAside)
                $scope.$exposeAside = {};
              $scope.$exposeAside.active = isAsideExposed;
              $ionicBody.enableClass(isAsideExposed, 'aside-open');
            });
            $scope.$on('$ionicView.beforeEnter', function(ev, d) {
              if (d.historyId) {
                $scope.$activeHistoryId = d.historyId;
              }
            });
            $scope.$on('$destroy', function() {
              $ionicBody.removeClass('menu-open', 'aside-open');
            });
          }
        }
      };
    }]);
    IonicModule.directive('ionSlideBox', ['$timeout', '$compile', '$ionicSlideBoxDelegate', '$ionicHistory', function($timeout, $compile, $ionicSlideBoxDelegate, $ionicHistory) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          autoPlay: '=',
          doesContinue: '@',
          slideInterval: '@',
          showPager: '@',
          pagerClick: '&',
          disableScroll: '@',
          onSlideChanged: '&',
          activeSlide: '=?'
        },
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var _this = this;
          var continuous = $scope.$eval($scope.doesContinue) === true;
          var shouldAutoPlay = isDefined($attrs.autoPlay) ? !!$scope.autoPlay : false;
          var slideInterval = shouldAutoPlay ? $scope.$eval($scope.slideInterval) || 4000 : 0;
          var slider = new ionic.views.Slider({
            el: $element[0],
            auto: slideInterval,
            continuous: continuous,
            startSlide: $scope.activeSlide,
            slidesChanged: function() {
              $scope.currentSlide = slider.currentIndex();
              $timeout(function() {});
            },
            callback: function(slideIndex) {
              $scope.currentSlide = slideIndex;
              $scope.onSlideChanged({
                index: $scope.currentSlide,
                $index: $scope.currentSlide
              });
              $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
              $scope.activeSlide = slideIndex;
              $timeout(function() {});
            }
          });
          slider.enableSlide($scope.$eval($attrs.disableScroll) !== true);
          $scope.$watch('activeSlide', function(nv) {
            if (angular.isDefined(nv)) {
              slider.slide(nv);
            }
          });
          $scope.$on('slideBox.nextSlide', function() {
            slider.next();
          });
          $scope.$on('slideBox.prevSlide', function() {
            slider.prev();
          });
          $scope.$on('slideBox.setSlide', function(e, index) {
            slider.slide(index);
          });
          this.__slider = slider;
          var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(slider, $attrs.delegateHandle, function() {
            return $ionicHistory.isActiveScope($scope);
          });
          $scope.$on('$destroy', deregisterInstance);
          this.slidesCount = function() {
            return slider.slidesCount();
          };
          this.onPagerClick = function(index) {
            void 0;
            $scope.pagerClick({index: index});
          };
          $timeout(function() {
            slider.load();
          });
        }],
        template: '<div class="slider">' + '<div class="slider-slides" ng-transclude>' + '</div>' + '</div>',
        link: function($scope, $element, $attr, slideBoxCtrl) {
          if ($scope.$eval($scope.showPager) !== false) {
            var childScope = $scope.$new();
            var pager = jqLite('<ion-pager></ion-pager>');
            $element.append(pager);
            $compile(pager)(childScope);
          }
        }
      };
    }]).directive('ionSlide', function() {
      return {
        restrict: 'E',
        require: '^ionSlideBox',
        compile: function(element, attr) {
          element.addClass('slider-slide');
          return function($scope, $element, $attr) {};
        }
      };
    }).directive('ionPager', function() {
      return {
        restrict: 'E',
        replace: true,
        require: '^ionSlideBox',
        template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
        link: function($scope, $element, $attr, slideBox) {
          var selectPage = function(index) {
            var children = $element[0].children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
              if (i == index) {
                children[i].classList.add('active');
              } else {
                children[i].classList.remove('active');
              }
            }
          };
          $scope.pagerClick = function(index) {
            slideBox.onPagerClick(index);
          };
          $scope.numSlides = function() {
            return new Array(slideBox.slidesCount());
          };
          $scope.$watch('currentSlide', function(v) {
            selectPage(v);
          });
        }
      };
    });
    IonicModule.directive('ionTab', ['$compile', '$ionicConfig', '$ionicBind', '$ionicViewSwitcher', function($compile, $ionicConfig, $ionicBind, $ionicViewSwitcher) {
      function attrStr(k, v) {
        return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
      }
      return {
        restrict: 'E',
        require: ['^ionTabs', 'ionTab'],
        controller: '$ionicTab',
        scope: true,
        compile: function(element, attr) {
          var tabNavTemplate = '<ion-tab-nav' + attrStr('ng-click', attr.ngClick) + attrStr('title', attr.title) + attrStr('icon', attr.icon) + attrStr('icon-on', attr.iconOn) + attrStr('icon-off', attr.iconOff) + attrStr('badge', attr.badge) + attrStr('badge-style', attr.badgeStyle) + attrStr('hidden', attr.hidden) + attrStr('class', attr['class']) + '></ion-tab-nav>';
          var tabContentEle = document.createElement('div');
          for (var x = 0; x < element[0].children.length; x++) {
            tabContentEle.appendChild(element[0].children[x].cloneNode(true));
          }
          var childElementCount = tabContentEle.childElementCount;
          element.empty();
          var navViewName,
              isNavView;
          if (childElementCount) {
            if (tabContentEle.children[0].tagName === 'ION-NAV-VIEW') {
              navViewName = tabContentEle.children[0].getAttribute('name');
              tabContentEle.children[0].classList.add('view-container');
              isNavView = true;
            }
            if (childElementCount === 1) {
              tabContentEle = tabContentEle.children[0];
            }
            if (!isNavView)
              tabContentEle.classList.add('pane');
            tabContentEle.classList.add('tab-content');
          }
          return function link($scope, $element, $attr, ctrls) {
            var childScope;
            var childElement;
            var tabsCtrl = ctrls[0];
            var tabCtrl = ctrls[1];
            var isTabContentAttached = false;
            $ionicBind($scope, $attr, {
              onSelect: '&',
              onDeselect: '&',
              title: '@',
              uiSref: '@',
              href: '@'
            });
            tabsCtrl.add($scope);
            $scope.$on('$destroy', function() {
              if (!$scope.$tabsDestroy) {
                tabsCtrl.remove($scope);
              }
              tabNavElement.isolateScope().$destroy();
              tabNavElement.remove();
              tabNavElement = tabContentEle = childElement = null;
            });
            $element[0].removeAttribute('title');
            if (navViewName) {
              tabCtrl.navViewName = $scope.navViewName = navViewName;
            }
            $scope.$on('$stateChangeSuccess', selectIfMatchesState);
            selectIfMatchesState();
            function selectIfMatchesState() {
              if (tabCtrl.tabMatchesState()) {
                tabsCtrl.select($scope, false);
              }
            }
            var tabNavElement = jqLite(tabNavTemplate);
            tabNavElement.data('$ionTabsController', tabsCtrl);
            tabNavElement.data('$ionTabController', tabCtrl);
            tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));
            function tabSelected(isSelected) {
              if (isSelected && childElementCount) {
                if (!isTabContentAttached) {
                  childScope = $scope.$new();
                  childElement = jqLite(tabContentEle);
                  $ionicViewSwitcher.viewEleIsActive(childElement, true);
                  tabsCtrl.$element.append(childElement);
                  $compile(childElement)(childScope);
                  isTabContentAttached = true;
                }
                $ionicViewSwitcher.viewEleIsActive(childElement, true);
              } else if (isTabContentAttached && childElement) {
                if ($ionicConfig.views.maxCache() > 0) {
                  $ionicViewSwitcher.viewEleIsActive(childElement, false);
                } else {
                  destroyTab();
                }
              }
            }
            function destroyTab() {
              childScope && childScope.$destroy();
              isTabContentAttached && childElement && childElement.remove();
              isTabContentAttached = childScope = childElement = null;
            }
            $scope.$watch('$tabSelected', tabSelected);
            $scope.$on('$ionicView.afterEnter', function() {
              $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
            });
            $scope.$on('$ionicView.clearCache', function() {
              if (!$scope.$tabSelected) {
                destroyTab();
              }
            });
          };
        }
      };
    }]);
    IonicModule.directive('ionTabNav', [function() {
      return {
        restrict: 'E',
        replace: true,
        require: ['^ionTabs', '^ionTab'],
        template: '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge, \'tab-hidden\':isHidden()}" ' + ' class="tab-item">' + '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' + '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' + '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' + '<span class="tab-title" ng-bind-html="title"></span>' + '</a>',
        scope: {
          title: '@',
          icon: '@',
          iconOn: '@',
          iconOff: '@',
          badge: '=',
          hidden: '@',
          badgeStyle: '@',
          'class': '@'
        },
        compile: function(element, attr, transclude) {
          return function link($scope, $element, $attrs, ctrls) {
            var tabsCtrl = ctrls[0],
                tabCtrl = ctrls[1];
            $element[0].removeAttribute('title');
            $scope.selectTab = function(e) {
              e.preventDefault();
              tabsCtrl.select(tabCtrl.$scope, true);
            };
            if (!$attrs.ngClick) {
              $element.on('click', function(event) {
                $scope.$apply(function() {
                  $scope.selectTab(event);
                });
              });
            }
            $scope.isHidden = function() {
              if ($attrs.hidden === 'true' || $attrs.hidden === true)
                return true;
              return false;
            };
            $scope.getIconOn = function() {
              return $scope.iconOn || $scope.icon;
            };
            $scope.getIconOff = function() {
              return $scope.iconOff || $scope.icon;
            };
            $scope.isTabActive = function() {
              return tabsCtrl.selectedTab() === tabCtrl.$scope;
            };
          };
        }
      };
    }]);
    IonicModule.directive('ionTabs', ['$ionicTabsDelegate', '$ionicConfig', '$ionicHistory', function($ionicTabsDelegate, $ionicConfig, $ionicHistory) {
      return {
        restrict: 'E',
        scope: true,
        controller: '$ionicTabs',
        compile: function(tElement) {
          var innerElement = jqLite('<div class="tab-nav tabs">');
          innerElement.append(tElement.contents());
          tElement.append(innerElement).addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());
          return {
            pre: prelink,
            post: postLink
          };
          function prelink($scope, $element, $attr, tabsCtrl) {
            var deregisterInstance = $ionicTabsDelegate._registerInstance(tabsCtrl, $attr.delegateHandle, tabsCtrl.hasActiveScope);
            tabsCtrl.$scope = $scope;
            tabsCtrl.$element = $element;
            tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));
            $scope.$watch(function() {
              return $element[0].className;
            }, function(value) {
              var isTabsTop = value.indexOf('tabs-top') !== -1;
              var isHidden = value.indexOf('tabs-item-hide') !== -1;
              $scope.$hasTabs = !isTabsTop && !isHidden;
              $scope.$hasTabsTop = isTabsTop && !isHidden;
            });
            $scope.$on('$destroy', function() {
              $scope.$tabsDestroy = true;
              deregisterInstance();
              tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
              delete $scope.$hasTabs;
              delete $scope.$hasTabsTop;
            });
          }
          function postLink($scope, $element, $attr, tabsCtrl) {
            if (!tabsCtrl.selectedTab()) {
              tabsCtrl.select(0);
            }
          }
        }
      };
    }]);
    IonicModule.directive('ionToggle', ['$ionicGesture', '$timeout', function($ionicGesture, $timeout) {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        transclude: true,
        template: '<div class="item item-toggle">' + '<div ng-transclude></div>' + '<label class="toggle">' + '<input type="checkbox">' + '<div class="track">' + '<div class="handle"></div>' + '</div>' + '</label>' + '</div>',
        compile: function(element, attr) {
          var input = element.find('input');
          forEach({
            'name': attr.name,
            'ng-value': attr.ngValue,
            'ng-model': attr.ngModel,
            'ng-checked': attr.ngChecked,
            'ng-disabled': attr.ngDisabled,
            'ng-true-value': attr.ngTrueValue,
            'ng-false-value': attr.ngFalseValue,
            'ng-change': attr.ngChange
          }, function(value, name) {
            if (isDefined(value)) {
              input.attr(name, value);
            }
          });
          if (attr.toggleClass) {
            element[0].getElementsByTagName('label')[0].classList.add(attr.toggleClass);
          }
          return function($scope, $element, $attr) {
            var el,
                checkbox,
                track,
                handle;
            el = $element[0].getElementsByTagName('label')[0];
            checkbox = el.children[0];
            track = el.children[1];
            handle = track.children[0];
            var ngModelController = jqLite(checkbox).controller('ngModel');
            $scope.toggle = new ionic.views.Toggle({
              el: el,
              track: track,
              checkbox: checkbox,
              handle: handle,
              onChange: function() {
                if (checkbox.checked) {
                  ngModelController.$setViewValue(true);
                } else {
                  ngModelController.$setViewValue(false);
                }
                $scope.$apply();
              }
            });
            $scope.$on('$destroy', function() {
              $scope.toggle.destroy();
            });
          };
        }
      };
    }]);
    IonicModule.directive('ionView', function() {
      return {
        restrict: 'EA',
        priority: 1000,
        controller: '$ionicView',
        compile: function(tElement) {
          tElement.addClass('pane');
          tElement[0].removeAttribute('title');
          return function link($scope, $element, $attrs, viewCtrl) {
            viewCtrl.init();
          };
        }
      };
    });
  })();
})(require("process"));
