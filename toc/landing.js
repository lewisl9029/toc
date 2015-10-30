(function initialize(window) {
  'use strict';

  window.tocVersion = 'dev';
  window.tocProd = false;

  var queryString = window.location.search;

  if (queryString.substr(0, 10) === '?inviteid=') {
    var inviteId = queryString.substr(10, 64);

    window.localStorage.setItem(
      'toc-state-local.contacts.invites.' + inviteId, 'true'
    );
  }

  // for clearing localStorage and indexedDB
  window.tocState = {
    destroy: function() {
      window.localStorage.clear();

      var openDbRequest = window.indexedDB.open('remotestorage');

      openDbRequest.onerror = function (dbOpenEvent) {
        console.log('IndexedDB open failed: ' + dbOpenEvent.target.errorCode);
      };

      openDbRequest.onsuccess = function (dbOpenEvent) {
        var db = dbOpenEvent.target.result;

        var clearDbRequest = db.transaction(["nodes"], 'readwrite')
          .objectStore("nodes").clear();

        clearDbRequest.onerror = function (dbClearEvent) {
          console.log('IndexedDB clear failed: ' +
            dbClearEvent.target.errorCode);
        };

        // add timeout 0 to let queued operations complete
        clearDbRequest.onsuccess = function (dbClearEvent) {
          window.setTimeout(function () {
            window.location.reload();
          }, 0);
        };
      };
    }
  }

  var clearData = window.document.getElementsByClassName('toc-clear-data')[0];

  clearData.addEventListener('click', function(event) {
    window.tocState.destroy();
  });

  var tocBody = window.document.getElementsByClassName('toc-body')[0];

  var appLinks = window.document.getElementsByClassName('toc-app-link');

  var appLinkHandler = function appLinkHandler(event) {
    event.preventDefault();
    tocBody.classList.add('toc-hide');
    return setTimeout(function() {
      window.location.href = 'app/';
    }, 1000);
  };

  window.Array.prototype.forEach.call(appLinks,
    function (appLink, index) {
      appLink.addEventListener('click', appLinkHandler);
    }
  );

  var scrollLinks =
    window.document.getElementsByClassName('toc-anchor-scroll-link');

  var scrollLinkHandlers = window.Array.prototype.map.call(scrollLinks,
    function (scrollLink) {
      var scrollTargetId = scrollLink.dataset.tocScroll;

      return function (event) {
        window.location.href = '#' + scrollTargetId;
      };
    }
  );

  window.Array.prototype.forEach.call(scrollLinks,
    function (scrollLink, index) {
      scrollLink.addEventListener('click', scrollLinkHandlers[index]);
    }
  );

  var smoothScrollSupported =
    window.document.documentElement.style.scrollBehavior;
  if (smoothScrollSupported === undefined) {
    // polyfills smooth scrolling functionality
    var createSmoothScrollPolyfill = function () {
      /**
       * @fileoverview naturalScroll - scrolls a viewport naturally
       * @version 0.2.1
       *
       * @license MIT, see http://github.com/asvd/naturalScroll
       * @copyright 2015 asvd <heliosframework@gmail.com>
       */


      (function (root, factory) {
          if (typeof define === 'function' && define.amd) {
              define(['exports'], factory);
          } else if (typeof exports !== 'undefined') {
              factory(exports);
          } else {
              factory((root.naturalScroll = {}));
          }
      //EDIT: allow library to attach to window in different context
      // }(this, function (exports) {
      }(window, function (exports) {
          var allAnimations = [
              [],  // vertical scrolling animations, one for a viewport
              []   // horizontal animations
          ];

          // for better compression
          var scrollTop = 'scrollTop';
          var scrollLeft = 'scrollLeft';

          // returns scrollTop() if argument is given, scrollLeft() otherwise
          var genScroll = function(top) {

              // exported method
              return function(elem, target, time) {
                  elem = elem.scroller || elem;  // needed for intence
                  time = time || 600;

                  // all animations for the particular direction
                  var dirAnimations = allAnimations[top ? 0 : 1];
                  var prop = top ? scrollTop : scrollLeft;

                  var animation,
                      tick,
                      i = 0,
                      f0 = elem[prop],  // current coordinate
                      f1 = 0,           // current speed
                      f2 = 0;           // current acceleration

                  // searching for the element's animation
                  for (;i < dirAnimations.length; i++) {
                      animation = (dirAnimations[i].e == elem) ?
                          dirAnimations[i] : animation;
                  }

                  if (animation) {
                      // taking speed and accel. from the running animation
                      f1 = animation.f[1];
                      f2 = animation.f[2];
                  } else {
                      // generating a new animation which contains:
                      // .e - element on which the animation is performed
                      // .f - current animation frame data
                      // .n - remaining frames number
                      // .t - animation end timestamp
                      dirAnimations.push(animation = {e : elem});
                  }

                  animation.t = (new Date).getTime() + time;

                  // total number of frames (most will be dropped though)
                  var fnum = animation.n = time;
                  var fnum2 = fnum * fnum;
                  var fnum3 = fnum2 * fnum;
                  var f0_target = f0-target;

                  // calculating initial frame
                  animation.f = [
                      f0,  // coordinate
                      f1,  // speed
                      f2,  // acceleration

                      // these magic formulae came from outer space
                      - ( 9 * f2 * fnum2 +
                          (36 * f1 -9 * f2) * fnum -
                          36 * f1 +
                          60 * f0_target
                      ) / (fnum3 - fnum),

                      6 * ( 6 * f2 * fnum2 +
                            (32 * f1 -6 * f2) * fnum -
                            32 * f1 +
                            60 * f0_target
                      ) / fnum / ( fnum3 + 2 * fnum2 - fnum - 2 ),

                      - 60 * ( f2 * fnum2 +
                               (6 * f1 - f2) * fnum -
                               6 * f1 +
                               12 * f0_target
                      ) / fnum / (
                          fnum2*fnum2  + 5*(fnum3 + fnum2-fnum) - 6
                      )
                  ];

                  // creating the timeout function
                  // and invoking it to apply the first frame instantly
                  // (if the animation is already running, another timeout
                  // is launched along with the existing, which is not a
                  // problem, since we are already spam with this function
                  // as fast as possible)
                  (tick = function(i) {
                       while (
                           // frames are not over
                           animation.n &&
                           // current frame is not yet reached
                           animation.n > animation.t - (new Date).getTime()
                       ) {
                           // calculating the next frame (i+1 means i>=0)
                           for (i = 4; i+1;) {
                               animation.f[i] += animation.f[i--+1];
                           }

                           animation.n--;
                       }

                       elem[prop] = animation.f[0];

                       if (animation.n) {
                           // scheduling the next frame
                           //EDIT: added requestAnimationFrame-based scheduling
                           //setTimeout(tick, 1);
                           if (!window.requestAnimationFrame) {
                             setTimeout(tick, 1);
                           }
                           requestAnimationFrame(tick);
                       } else {
                           // stopping animation
                           animation.f[1] = animation.f[2] = 0;
                       }
                  })();
              }
          }

          exports[scrollTop] = genScroll(
              exports[scrollLeft] = genScroll()
          );
      }));
    };
    createSmoothScrollPolyfill();

    var viewport = window.document.getElementsByClassName('toc-body')[0];

    window.Array.prototype.forEach.call(scrollLinks,
      function (scrollLink, index) {
        var scrollTargetId = scrollLink.dataset.tocScroll;
        var scrollTarget = window.document.getElementById(scrollTargetId);

        scrollLink.removeEventListener('click', scrollLinkHandlers[index]);
        scrollLink.addEventListener('click', function (event) {
          if (event.invokeDefault) {
            return;
          }

          event.preventDefault();

          var scrollPosition = scrollTarget.getBoundingClientRect().top +
            document.body.scrollTop;
          window.naturalScroll.scrollTop(viewport, scrollPosition);

          // ensure scrolling animation has enough time to finish
          window.setTimeout(function() {
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });

            clickEvent.invokeDefault = true;
            scrollLink.dispatchEvent(clickEvent);
          }, 600);
        });
      }
    );
  }

})(window);
