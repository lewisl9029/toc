import angular from 'angular';

import header from './header/header';
import autoFocus from './auto-focus/auto-focus';
import channelList from './channel-list/channel-list';
import messageList from './message-list/message-list';
import qrImage from './qr-image/qr-image';
import spinnerButton from './spinner-button/spinner-button';
import signupForm from './signup-form/signup-form';
import signinForm from './signin-form/signin-form';
import cloudConnectForm from './cloud-connect-form/cloud-connect-form';

export default angular.module('toc.components', [
  header.name,
  autoFocus.name,
  channelList.name,
  messageList.name,
  qrImage.name,
  spinnerButton.name,
  signupForm.name,
  signinForm.name,
  cloudConnectForm.name
]);
