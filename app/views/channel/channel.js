import angular from 'angular';

import config from './channel-config';
import controller from './channel-controller';
import menuController from './channel-menu-controller';

export default angular.module('toc.views.channel', [
  ])
  .config(config)
  .controller(controller.name, controller)
  .controller(menuController.name, menuController);
