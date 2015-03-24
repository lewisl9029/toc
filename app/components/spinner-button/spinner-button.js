import angular from 'angular';

import directive from './spinner-button-directive';

export default angular.module('toc.components.spinner-button', [])
  .directive(directive.name, directive);
