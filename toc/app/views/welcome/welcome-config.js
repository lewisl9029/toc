import template from './welcome.html!text';
import controller, { controllerName } from './welcome-controller';

export default /*@ngInject*/ function configWelcome($stateProvider) {
  $stateProvider.state('public.welcome', {
    url: '/welcome',
    template: template,
    controller: controllerName + ' as welcomeView'
  });
}
