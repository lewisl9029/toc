(function initialize() {
  // Custom IE9+ function.name polyfill
  // http://matt.scharley.me/2012/03/09/monkey-patch-name-ie.html
  if (Function.prototype.name === undefined &&
    Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
      get: function() {
        var funcNameRegex = /function\s([^(]{1,})\(/;
        var results = (funcNameRegex)
          .exec((this)
            .toString());
        return (results && results.length > 1) ? results[1].trim() : '';
      },
      set: function() {}
    });
  }
  // /Custom IE9+ function.name polyfill

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
    .catch(console.log);
})();
