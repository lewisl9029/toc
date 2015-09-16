import angular from 'angular';

import directive, { directiveName } from './channel-card-directive';

export default angular.module('toc.components.channel-card', [])
  .directive(directiveName, directive);
