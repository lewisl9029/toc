import angular from 'angular';

import components from './components/components';
import libraries from './libraries/libraries';
import services from './services/services';
import views from './views/views';

import run from './app-run';
import config from './app-config';
import controller, { controllerName } from './app-controller';

let appName = 'toc';

export default angular.module(appName, [
    components.name,
    libraries.name,
    services.name,
    views.name,
  ])
  .config(config)
  .run(run)
  .controller(controllerName, controller);

export function initialize() {
  angular.element(document)
    .ready(function bootstrap() {
      angular.bootstrap(document.querySelector('[data-toc-app]'), [
        appName
      ]);
    });
}
