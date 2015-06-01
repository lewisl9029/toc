import angular from 'angular';

import config from './home-config';
import controller from './home-controller';

export default angular.module('toc.views.home', [
  ])
  .config(config)
  .controller(controller.name, controller);
  // .factory(service.name, service);
