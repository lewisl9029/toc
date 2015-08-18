import angular from 'angular';

import directive, { directiveName } from './notification-card-directive';

export default angular.module('toc.components.notification-card', [])
  .directive(directiveName, directive);
