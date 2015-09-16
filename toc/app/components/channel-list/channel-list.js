import angular from 'angular';

import directive, { directiveName } from './channel-list-directive';

export default angular.module('toc.components.channel-list', [])
  .directive(directiveName, directive);
