import angular from 'angular';

import directive, { directiveName } from './message-list-directive';

export default angular.module('toc.components.message-list', [])
  .directive(directiveName, directive);
