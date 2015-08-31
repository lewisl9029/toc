import angular from 'angular';

import directive, { directiveName } from './update-profile-modal-directive';

export default angular.module('toc.components.update-profile-modal', [])
  .directive(directiveName, directive);
