import angular from 'angular';

import directive, { directiveName } from './begin-conversation-modal-directive';

export default angular.module('toc.components.begin-conversation-modal', [])
  .directive(directiveName, directive);
