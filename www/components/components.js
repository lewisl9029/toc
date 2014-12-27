import angular from 'angular';

import header from './header/header';

let components = angular.module('toc.components', [
  header.name
]);

export default components;