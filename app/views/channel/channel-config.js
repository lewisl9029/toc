import template from './channel.html!text';
import controller from './channel-controller';

export default function configChannel($stateProvider) {
  $stateProvider.state('app.private.channel', {
    url: '/channel/{channelId:string}',
    template: template,
    controller: controller.name + ' as channelView'
  });
}
