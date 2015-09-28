import template from './home.html!text';
import controller, { controllerName } from './home-controller';

export default /*@ngInject*/ function configHome($stateProvider) {
  $stateProvider.state('private.home', {
    url: '/home',
    template: template,
    controller: controllerName + ' as homeView'
  });
}
