import angular from 'angular';

import directive from './cloud-connect-form-directive';

export default angular.module('toc.components.cloud-connect-form', [])
  .directive(directive.name, directive);
