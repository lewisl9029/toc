import angular from 'angular';

import autoFocus from './auto-focus/auto-focus';
import channelList from './channel-list/channel-list';
import messageList from './message-list/message-list';
import qrImage from './qr-image/qr-image';
import spinnerButton from './spinner-button/spinner-button';
import signupForm from './signup-form/signup-form';
import signinForm from './signin-form/signin-form';
import cloudConnectForm from './cloud-connect-form/cloud-connect-form';
import cloudManageForm from './cloud-manage-form/cloud-manage-form';

export default angular.module('toc.components', [
  autoFocus.name,
  channelList.name,
  messageList.name,
  qrImage.name,
  spinnerButton.name,
  signupForm.name,
  signinForm.name,
  cloudConnectForm.name,
  cloudManageForm.name
]);
