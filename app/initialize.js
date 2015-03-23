(function initialize() {
  //TODO: optimize spinner removal timing UX
  // Record time here
  var loadingIndicator;
  var loadingStartTime;
  var queryAnimationTime = 2800;
  var fadeoutAnimationTime = 1500;

  var loadingScreen = document.getElementsByClassName('loading-screen')[0];


  System.import('mprogress')
    .then(function initializeLoadingIndicator() {
      loadingIndicator = new Mprogress({template: 4});
      loadingStartTime = Date.now();
      loadingIndicator.start();

      return System.import('app');
    })
    .then(function initializeApp(app) {
      app.initialize();
    })
    .then(function hideLoadingScreen() {
      // loadingIndicator.set(0.99);
      var loadingEndTime = Date.now();
      var queryElapsedTime =
        (loadingEndTime - loadingStartTime) % queryAnimationTime;

      setTimeout(function() {
        loadingIndicator.end();
        loadingScreen.className += ' fadeout-loading-screen';

        setTimeout(function() {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }, fadeoutAnimationTime);
      }, queryAnimationTime - queryElapsedTime);
    })
    .catch(console.onerror);
})();
