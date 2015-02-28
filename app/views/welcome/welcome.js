import angular from 'angular';

import config from './welcome-config';
import controller from './welcome-controller';

export default angular.module('toc.views.welcome', [])
  .config(config)
  .controller(controller.name, controller);
