(function initialize() {
  //TODO: optimize spinner removal timing UX
  // Record time here
  System.import('app')
    .then(function initializeApp(app) {
      app.initialize();
    })
    .then(function hideSplashscreen() {
      // Remove if time elapsed < 1s
      // Else fadeout
      // var spinner = document.getElementsByClassName('spinner')[0];
      // spinner.className += ' fadeout-spinner';

      var splashscreen = document.getElementsByClassName('splashscreen')[0];
      splashscreen.className += ' fadeout-splashscreen';
      setTimeout(function removeSplashscreen() {
        splashscreen.parentNode.removeChild(splashscreen);
      }, 1000);
    })
    .catch(console.onerror);
})();
