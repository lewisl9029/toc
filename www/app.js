import angular from 'angular';
import 'ionic';

import run from './app-run';
import config from './app-config';

import libraries from './libraries/libraries';
import views from './views/views';
import components from './components/components';

let app = angular.module('toc', [
  'ionic',
  views.name,
  components.name
]).run(run)
  .config(config);

export default app;