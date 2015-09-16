import angular from 'angular';

import directive, { directiveName } from './notification-overlay-directive';

export default angular.module('toc.components.notification-overlay', [])
  .directive(directiveName, directive);
