import angular from 'angular';

import directive, { directiveName } from './cloud-connect-form-directive';

export default angular.module('toc.components.cloud-connect-form', [])
  .directive(directiveName, directive);
