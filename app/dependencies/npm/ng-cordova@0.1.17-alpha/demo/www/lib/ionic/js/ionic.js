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
})(require("process"));
