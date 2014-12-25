let config = function config($stateProvider) {
  $stateProvider.state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "views/home/home.html"
        }
      }
    });
};

export default config;

