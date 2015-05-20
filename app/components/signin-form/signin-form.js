import angular from 'angular';

import directive from './signin-form-directive';
import service from './signin-form-service';

export default angular.module('toc.components.signin-form', [])
  .directive(directive.name, directive)
  .factory(service.name, service);
