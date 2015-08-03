import angular from 'angular';

import directive, { directiveName } from './signin-form-directive';
import service, { serviceName } from './signin-form-service';

export default angular.module('toc.components.signin-form', [])
  .directive(directiveName, directive)
  .factory(serviceName, service);
