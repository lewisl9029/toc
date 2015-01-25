import angular from 'angular';

import R from 'ramda';

let library = angular.module('toc.libraries.ramda', [])
  .factory('R', () => R);

export default library;
