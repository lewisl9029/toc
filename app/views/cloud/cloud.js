import angular from 'angular';

import config from './cloud-config';
import controller, { controllerName } from './cloud-controller';

export default angular.module('toc.views.cloud', [])
  .config(config)
  .controller(controllerName, controller);
