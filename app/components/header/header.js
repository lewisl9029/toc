import angular from 'angular';

import directive from './header-directive';

export default angular.module('toc.components.header', [])
  .directive(directive.name, directive);
