(function initialize() {
  //TODO: optimize spinner removal timing UX
  // Record time here
  var loadingIndicator;
  var loadingStartTime;
  var QUERY_DURATION = 2800;
  var FADEOUT_DURATION = 1500;

  var loadingScreen = document.getElementsByClassName('toc-loading-screen')[0];
  loadingStartTime = Date.now();

  System.import('app')
    .then(function initializeApp(app) {
      app.initialize();
    })
    .then(function hideLoadingScreen() {
      // loadingIndicator.set(0.99);
      var loadingEndTime = Date.now();
      var queryElapsedTime =
        (loadingEndTime - loadingStartTime) % QUERY_DURATION;

      setTimeout(function() {
        loadingScreen.className += ' toc-fadeout-loading-screen';

        setTimeout(function() {
          loadingScreen.className += ' toc-non-interactive';
        }, FADEOUT_DURATION);
      }, QUERY_DURATION - queryElapsedTime);
    })
    .catch(console.onerror);
})();
