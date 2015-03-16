import angular from 'angular';

import config from './home-config';
import controller from './home-controller';
import menuController from './home-menu-controller';
import service from './home-service';

export default angular.module('toc.views.home', [
  ])
  .config(config)
  .controller(controller.name, controller)
  .controller(menuController.name, menuController)
  .factory(service.name, service);
