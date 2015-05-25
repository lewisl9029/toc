import angular from 'angular';

import channel from './channel/channel';
import home from './home/home';
import welcome from './welcome/welcome';
import signin from './signin/signin';
import signup from './signup/signup';
import cloud from './cloud/cloud';

export default angular.module('toc.views', [
  channel.name,
  home.name,
  welcome.name,
  signin.name,
  signup.name,
  cloud.name
]);
