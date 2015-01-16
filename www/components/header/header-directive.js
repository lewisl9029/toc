import template from './header.html!';

let directive = function tocHeader() {
  return {
    restrict: 'E',
    template: template
  };
};

//function.name polyfill (mostly for IE)
if (!directive.name) {
  directive.name = 'tocHeader';
}

export default directive;
