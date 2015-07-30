import template from './cloud.html!text';
import controller from './cloud-controller';

export default function configCloud($stateProvider) {
  $stateProvider.state('app.public.cloud', {
    url: '/cloud',
    template: template,
    controller: controller.name + ' as cloudView'
  });

  $stateProvider.state('app.private.cloud', {
    url: '/cloud',
    template: template,
    controller: controller.name + ' as cloudView'
  });
}
