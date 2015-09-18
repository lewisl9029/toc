(function initialize() {
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
        return app.initialize();
      })
      .catch(console.error.bind(console));
  };

  // initializeApp();
})();
