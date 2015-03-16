import template from './home.html!text';
import controller from './home-controller';

import menuTemplate from './home-menu.html!text';
import menuController from './home-menu-controller';

export default function configHome($stateProvider) {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content': {
        template: template,
        controller: controller.name + ' as homeView'
      },
      'menu': {
        template: menuTemplate,
        controller: menuController.name + ' as homeMenu'
      }
    }
  });
}
