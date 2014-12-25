import angular from 'angular';

import header from './header/header';

let components = angular.module('components', [
  header.name
]);

export default components;