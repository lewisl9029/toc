import angular from 'angular';

import channel from './channel/channel';
import cloud from './cloud/cloud';
import home from './home/home';
import signin from './signin/signin';
import signup from './signup/signup';
import welcome from './welcome/welcome';

export default angular.module('toc.views', [
  channel.name,
  cloud.name,
  home.name,
  signin.name,
  signup.name,
  welcome.name
]);
