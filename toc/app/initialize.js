(function initialize(window) {
  'use strict';
  var initializeApp = function initializeApp() {
    var disableLogging = function disableLogging() {
      window.console.log = function () {};
      window.console.debug = function () {};
    };
    // need to brute force this. telehash v2 has no config option for logging
    if (window.tocProd) {
      disableLogging();
    }

    System.import('app')
      .then(function (app) {
        app.initialize();

        var loadingScreen = window.document
          .getElementsByClassName('toc-loading-screen')[0];

        loadingScreen.parentNode.removeChild(loadingScreen);
      })
      .catch(console.error.bind(console));
  };

  initializeApp();
})(window);
