import angular from 'angular';

import ramda from './ramda/ramda';

let libraries = angular.module('toc.libraries', [
  ramda.name
]);

export default libraries;
