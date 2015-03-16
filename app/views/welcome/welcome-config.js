import template from './welcome.html!text';
import controller from './welcome-controller';

import menuTemplate from './welcome-menu.html!text';
import menuController from './welcome-menu-controller';

export default function configWelcome($stateProvider) {
  $stateProvider.state('app.welcome', {
    url: '/welcome',
    views: {
      'content': {
        template: template,
        controller: controller.name + ' as welcomeView'
      },
      'menu': {
        template: menuTemplate,
        controller: menuController.name + ' as welcomeMenu'
      }
    }
  });
}
