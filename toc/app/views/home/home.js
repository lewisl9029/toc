import angular from 'angular';

import config from './home-config';
import controller, { controllerName } from './home-controller';

export default angular.module('toc.views.home', [
  ])
  .config(config)
  .controller(controllerName, controller);
  // .factory(serviceName, service);
