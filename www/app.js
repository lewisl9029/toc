import angular from 'angular';
import 'ionic';
import run from './app-run';
import config from './app-config';

let app = angular.module('toc', [
  'ionic'
]).run(run)
  .config(config);

export default app;