'use strict';
(function initialize(window) {
  var smoothScrollSupported =
    window.document.documentElement.style.scrollBehavior;
  if (!smoothScrollSupported) {
    //polyfill here
  }
})(window);
