import template from './home.html!text';
import controller from './home-controller';

let config = function config($stateProvider) {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content': {
        template: template,
        controller: controller.name + ' as vm'
      }
    }
  });
};

export default config;
