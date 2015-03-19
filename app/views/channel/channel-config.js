import template from './channel.html!text';
import controller from './channel-controller';

import menuTemplate from './channel-menu.html!text';
import menuController from './channel-menu-controller';

export default function configHome($stateProvider) {
  $stateProvider.state('app.channel', {
    url: '/channel/{channelId:string}',
    views: {
      'content': {
        template: template,
        controller: controller.name + ' as channelView'
      },
      'menu': {
        template: menuTemplate,
        controller: menuController.name + ' as channelMenu'
      }
    }
  });
}
