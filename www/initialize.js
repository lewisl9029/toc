import angular from 'angular';
import app from './app';

let initialize = () => {
  angular.element(document)
    .ready(function() {
      angular.bootstrap(document.querySelector('[data-toc-app]'), [
        app.name
      ]);
    });
};

export default initialize;
