import template from './header.html!text';

let directive = function tocHeader() {
  return {
    restrict: 'E',
    template: template
  };
};

export default directive;
