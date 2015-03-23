import angular from 'angular';

import directive from './progress-indicator-directive';

export default angular.module('toc.components.progress-indicator', [])
  .directive(directive.name, directive);
