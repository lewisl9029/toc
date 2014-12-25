import angular from 'angular';
import 'ionic';

import run from './app-run';
import config from './app-config';

import views from './views/views';

let app = angular.module('toc', [
  'ionic',
  views.name
]).run(run)
  .config(config);

export default app;