import angular from 'angular';

import directive, { directiveName } from './cloud-connect-modal-directive';

export default angular.module('toc.components.cloud-connect-modal', [])
  .directive(directiveName, directive);
