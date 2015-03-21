import angular from 'angular';

import directive from './auto-focus-directive';

export default angular.module('toc.components.auto-focus', [])
  .directive(directive.name, directive);
