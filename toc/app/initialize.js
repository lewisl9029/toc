(function initialize(window) {
  'use strict';

  window.tocVersion='dev';
  window.tocProd=false;

  var initializeApp = function initializeApp() {
    var disableLogging = function disableLogging() {
      window.console.log = function () {};
      window.console.debug = function () {};
    };
    // need to brute force this. telehash v2 has no config option for logging
    if (window.tocProd) {
      disableLogging();
    }

    var loadingScreen = window.document
      .getElementsByClassName('toc-loading-screen')[0];

    // attaches to window to call later in app
    // when loading screen is no longer necessary
    window.tocHideLoadingScreen = function hideLoadingScreen() {
      loadingScreen.classList.add('toc-loading-screen-hiding');

      window.setTimeout(function () {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }, 3000);
    };

    window.tocPauseLoadingAnimation = function tocPauseLoadingAnimation() {
      loadingScreen.classList.add('toc-loading-pause-animations');
    };

    window.tocResumeLoadingAnimation = function tocResumeLoadingAnimation() {
      loadingScreen.classList.remove('toc-loading-pause-animations');
    };

    // initializes app
    System.import('app')
      .then(function (app) {
        app.initialize();
      })
      .catch(console.error.bind(console));
  };

  initializeApp();
})(window);
