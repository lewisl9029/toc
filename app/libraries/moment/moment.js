import angular from 'angular';

import moment from 'moment';

export default angular.module('toc.libraries.moment', [])
  .factory('moment', () => moment);
