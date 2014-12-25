let config = function config($stateProvider) {
  $stateProvider.state('app.home', {
    url: "/home",
    views: {
      'content': {
        templateUrl: "views/home/home.html"
      }
    }
  });
};

export default config;

