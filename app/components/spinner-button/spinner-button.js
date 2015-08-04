import angular from 'angular';

import directive, { directiveName } from './spinner-button-directive';

export default angular.module('toc.components.spinner-button', [])
  .directive(directiveName, directive);
