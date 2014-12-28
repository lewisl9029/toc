import angular from 'angular';
import 'ionic';
import telehash from 'telehash';

import libraries from './libraries/libraries';
import views from './views/views';
import components from './components/components';

import run from './app-run';
import config from './app-config';

let app = angular.module('toc', [
  'ionic',
  views.name,
  components.name
]).run(run)
  .config(config);

angular.element(document).ready(function() {
  angular.bootstrap(document.querySelector('[data-toc-app]'), [
    app.name
  ]);
});

export default app;