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
    var landingPageContent =
      window.document.getElementsByClassName('toc-landing-content')[0];

    //TODO: animate the transition to app
    landingPageContent.parentNode.removeChild(landingPageContent);

    System.import('app.css!')
      .then(function () { return System.import('app'); })
      .then(function (app) {
        return app.initialize();
      })
      .catch(console.error.bind(console));
  };

  var initializeAppButtons =
    window.document.getElementsByClassName('toc-initialize-app-button');

  window.Array.prototype.forEach
    .call(initializeAppButtons, function (initializeAppButton) {
      initializeAppButton.addEventListener('click', initializeApp);
    });
})();
