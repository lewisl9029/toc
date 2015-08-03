import angular from 'angular';

import config from './channel-config';
import controller, { controllerName } from './channel-controller';

export default angular.module('toc.views.channel', [])
  .config(config)
  .controller(controllerName, controller);
