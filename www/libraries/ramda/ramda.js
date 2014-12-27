import angular from 'angular';

import R from 'ramda';

let library = angular.module('ramda', [])
  .factory('R', () => R);

export default library;