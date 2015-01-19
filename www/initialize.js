(function initialize() {
  var spinner = document.getElementsByClassName('spinner')[0];
  var spinnerArea = spinner.parentNode;
  spinnerArea.removeChild(spinner);

  var showSpinnerTimeout = setTimeout(function showSpinner() {
    spinnerArea.appendChild(spinner);
  }, 1000);

  System.import('app')
    .then(function initializeApp(app) {
      app.initialize();
    })
    .then(function hideSplashscreen() {
      clearTimeout(showSpinnerTimeout);
      var splashscreen = document.getElementsByClassName('splashscreen')[0];
      splashscreen.className += ' fadeout-splashscreen';
      setTimeout(function removeSplashscreen() {
        splashscreen.parentNode.removeChild(splashscreen);
      }, 1000);
    })
    .catch(console.log);
})();
