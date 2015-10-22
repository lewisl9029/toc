import angular from 'angular';

import directive, { directiveName } from './id-scanner-directive';

export default angular.module('toc.components.id-scanner', [])
  .directive(directiveName, directive);
