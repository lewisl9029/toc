import angular from 'angular';

import 'angular-toastr';

export default angular.module('toc.libraries.angular-toastr', ['toastr'])
  .factory('angularToastr', /*@ngInject*/ (toastr) => toastr);
