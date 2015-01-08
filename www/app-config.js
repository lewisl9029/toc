import template from 'app.html!';

let config = function config($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: "/app",
    abstract: true,
    template: template
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
};

export default config;