import template from './cloud-manage-form.html!text';

export default function tocCloudManageForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'cloudManageForm',
    controller: function CloudManageFormController() {

    }
  };
}
