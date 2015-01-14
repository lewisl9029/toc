import template from './header.html!';

let directive = function tocHeader() {
  return {
    restrict: 'E',
    template: template
  };
};

export default directive;
