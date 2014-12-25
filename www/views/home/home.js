import angular from 'angular';
import config from './home-config';
import controller from './home-controller';
import service from './home-service';

let home = angular.module('home', [])
  .config(config)
  .controller(controller)
  .factory(service);

export default home;