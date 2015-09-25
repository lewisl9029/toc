import angular from 'angular';

import directive, { directiveName } from './invite-message-modal-directive';

export default angular.module('toc.components.invite-message-modal', [])
  .directive(directiveName, directive);
