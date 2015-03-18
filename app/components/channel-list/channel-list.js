import angular from 'angular';

import directive from './channel-list-directive';

export default angular.module('toc.components.channel-list', [])
  .directive(directive.name, directive);
