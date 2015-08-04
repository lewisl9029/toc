import angular from 'angular';

import config from './welcome-config';
import controller, { controllerName } from './welcome-controller';

export default angular.module('toc.views.welcome', [])
  .config(config)
  .controller(controllerName, controller);
