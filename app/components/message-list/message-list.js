import angular from 'angular';

import directive from './message-list-directive';

export default angular.module('toc.components.message-list', [])
  .directive(directive.name, directive);
