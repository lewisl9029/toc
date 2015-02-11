import template from './home.html!text';
import controller from './home-controller';

export default function configHome($stateProvider) {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content': {
        template: template,
        controller: controller.name + ' as vm'
      }
    }
  });
}
