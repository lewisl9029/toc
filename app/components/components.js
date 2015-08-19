import angular from 'angular';

import autoFocus from './auto-focus/auto-focus';
import channelCard from './channel-card/channel-card';
import channelList from './channel-list/channel-list';
import cloudConnectForm from './cloud-connect-form/cloud-connect-form';
import cloudManageForm from './cloud-manage-form/cloud-manage-form';
import messageList from './message-list/message-list';
import notificationCard from './notification-card/notification-card';
import qrImage from './qr-image/qr-image';
import sideMenu from './side-menu/side-menu';
import signinForm from './signin-form/signin-form';
import signupForm from './signup-form/signup-form';
import spinnerButton from './spinner-button/spinner-button';
import userCard from './user-card/user-card';

export default angular.module('toc.components', [
  autoFocus.name,
  channelCard.name,
  channelList.name,
  cloudConnectForm.name,
  cloudManageForm.name,
  messageList.name,
  notificationCard.name,
  qrImage.name,
  sideMenu.name,
  signinForm.name,
  signupForm.name,
  spinnerButton.name,
  userCard.name
]);
