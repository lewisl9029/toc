import angular from 'angular';

import header from './header/header';
import channelList from './channel-list/channel-list';
import messageList from './message-list/message-list';
import qrImage from './qr-image/qr-image';
import signupForm from './signup-form/signup-form';
import signinForm from './signin-form/signin-form';

export default angular.module('toc.components', [
  header.name,
  channelList.name,
  messageList.name,
  qrImage.name,
  signupForm.name,
  signinForm.name
]);
