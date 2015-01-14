import angular from 'angular';

import home from './home/home';

let views = angular.module('toc.views', [
  home.name
]);

export default views;
