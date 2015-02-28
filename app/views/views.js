import angular from 'angular';

import home from './home/home';
import welcome from './welcome/welcome';

export default angular.module('toc.views', [
  home.name,
  welcome.name
]);
