import template from './cloud-manage-form.html!text';

export let directiveName = 'tocCloudManageForm';
export default /*@ngInject*/ function tocCloudManageForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'cloudManageForm',
    controller: /*@ngInject*/ function CloudManageFormController() {

    }
  };
}
