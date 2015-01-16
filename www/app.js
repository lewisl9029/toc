import angular from 'angular';
import 'ionic';
import 'app.css!';

import services from './services/services';
import libraries from './libraries/libraries';
import views from './views/views';
import components from './components/components';

import run from './app-run';
import config from './app-config';

let app = angular.module('toc', [
  'ionic',
  services.name,
  libraries.name,
  views.name,
  components.name
]).run(run)
  .config(config);

export default app;
