import template from './welcome.html!text';
import controller from './welcome-controller';

export default function configWelcome($stateProvider) {
  $stateProvider.state('app.public.welcome', {
    url: '/welcome',
    template: template,
    controller: controller.name + ' as welcomeView'
  });
}
