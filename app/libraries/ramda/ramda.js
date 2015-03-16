import angular from 'angular';

import R from 'ramda';

export default angular.module('toc.libraries.ramda', [])
  .factory('R', () => R);
