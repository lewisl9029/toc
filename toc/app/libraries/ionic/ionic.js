import angular from 'angular';

// custom fork of ionic v1.1.0 with workaround for right side menu toggle
// when exposeAsideWhen is enabled
// TODO: ionic v1.2.x should hava a better fix, migrate when available
import './ionic-angular-library';

export default angular.module('toc.libraries.ionic', ['ionic']);
