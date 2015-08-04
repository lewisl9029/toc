import template from './cloud.html!text';
import controller, { controllerName } from './cloud-controller';

export default /*@ngInject*/ function configCloud($stateProvider) {
  $stateProvider.state('app.public.cloud', {
    url: '/cloud',
    template: template,
    controller: controllerName + ' as cloudView'
  });

  $stateProvider.state('app.private.cloud', {
    url: '/cloud',
    template: template,
    controller: controllerName + ' as cloudView'
  });
}
