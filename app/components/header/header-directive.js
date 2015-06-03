import template from './header.html!text';

export default function tocHeader() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'header',
    controller: function HeaderController($state, state, navigation) {
      this.isPrivateState = navigation.isPrivateState;
    }
  };
}
