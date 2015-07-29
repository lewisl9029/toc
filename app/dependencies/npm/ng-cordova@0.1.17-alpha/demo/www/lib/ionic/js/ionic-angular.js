/* */ 
(function(process) {
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
