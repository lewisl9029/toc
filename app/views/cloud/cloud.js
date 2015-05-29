import angular from 'angular';

import config from './cloud-config';
import controller from './cloud-controller';

export default angular.module('toc.views.cloud', [])
  .config(config)
  .controller(controller.name, controller);
