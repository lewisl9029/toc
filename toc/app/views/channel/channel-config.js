import template from './channel.html!text';
import controller, { controllerName } from './channel-controller';

export default /*@ngInject*/ function configChannel($stateProvider) {
  $stateProvider.state('private.channel', {
    url: '/channel/{channelId:string}',
    template: template,
    controller: controllerName + ' as channelView'
  });
}
