import angular from 'angular';

import channel from './channel/channel';
import home from './home/home';
import welcome from './welcome/welcome';

export default angular.module('toc.views', [
  channel.name,
  home.name,
  welcome.name
]);
