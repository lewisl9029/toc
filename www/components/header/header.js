import angular from 'angular';

import directive from './header-directive';

let header = angular.module('toc.components.header', [])
  .directive(directive.name, directive);

export default header;
