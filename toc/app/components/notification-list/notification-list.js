import angular from 'angular';

import directive, { directiveName } from './notification-list-directive';

export default angular.module('toc.components.notification-list', [])
  .directive(directiveName, directive);
