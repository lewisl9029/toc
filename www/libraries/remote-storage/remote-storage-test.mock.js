import sinon from 'sinon';

let mockRemoteStorage = {};

mockRemoteStorage.RemoteStorage = {};
mockRemoteStorage.remoteStorage = {};
mockRemoteStorage.remoteStorage.access = {};

mockRemoteStorage.RemoteStorage.defineModule = sinon.stub();
mockRemoteStorage.remoteStorage.access.claim = sinon.stub();

export default mockRemoteStorage;
