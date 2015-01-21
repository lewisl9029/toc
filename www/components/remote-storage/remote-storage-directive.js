import template from './remote-storage.html!';

let directive = function tocRemoteStorage(remoteStorage) {
  let remoteStorageContainerId = '';
  return {
    restrict: 'E',
    template: template,
    controller: function() {
      remoteStorage.remoteStorage.displayWidget(remoteStorageContainerId);
    },
    compile: function compile(element) {
      remoteStorageContainerId = element[0].querySelector('div').id;
      return {};
    }
  };
};

export default directive;
