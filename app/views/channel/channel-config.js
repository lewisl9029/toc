import template from './channel.html!text';
import controller from './channel-controller';

export default function configHome($stateProvider) {
  $stateProvider.state('app.channel', {
    url: '/channel/{channelId:string}',
    template: template,
    controller: controller.name + ' as channelView'
  });
}
