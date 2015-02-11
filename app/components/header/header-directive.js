import template from './header.html!text';

export default function tocHeader() {
  return {
    restrict: 'E',
    template: template
  };
}
