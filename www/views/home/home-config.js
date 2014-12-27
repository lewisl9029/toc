import controller from './home-controller';

let config = function config($stateProvider) {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content': {
        templateUrl: 'views/home/home.html',
        controller: controller.name + ' as vm'
      }
    }
  });
};

export default config;

