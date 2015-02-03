import storage from './storage-service';
import STORAGE_CONSTANTS from './storage-constants';

import mockRemoteStorage from
  'libraries/remote-storage/remote-storage-test.mock';

describe('storage service', function() {
  it('should return storage module after model creation', function() {
    let mockStorageModel = {};
    mockStorageModel.name = 'test';
    mockStorageModel.accessLevel = STORAGE_CONSTANTS.ACCESS_LEVELS.READ;
    mockStorageModel.builder = function mockModelBuilder() {
      return undefined;
    };

    mockRemoteStorage.RemoteStorage.defineModule
      .withArgs(mockStorageModel.name, mockStorageModel.builder);

    mockRemoteStorage.remoteStorage.access.claim
      .withArgs(mockStorageModel.name, mockStorageModel.accessLevel);

    mockRemoteStorage.remoteStorage[mockStorageModel.name] =
      'testModel';

    let storageService = storage({}, {}, mockRemoteStorage);

    let newStorageModel = storageService.createModel(mockStorageModel);

    expect(newStorageModel)
      .to.equal(mockRemoteStorage.remoteStorage[mockStorageModel.name]);

    expect(mockRemoteStorage.RemoteStorage.defineModule.calledOnce)
      .to.be.true();

    expect(mockRemoteStorage.remoteStorage.access.claim.calledOnce)
      .to.be.true();
  });
});
