import sinon from 'sinon';

import contacts from './contacts-service';
import contactsModel from './contacts-model';

import mockStorage from 'services/storage/storage-test.mock';

describe('contacts service', function() {
  it('should initialize to expected state', function() {
    let mockContactsStorage = {};
    let mockContactsList = ['contact1'];

    mockContactsStorage.getAllContacts = sinon.stub();

    mockContactsStorage.getAllContacts
      .withArgs()
      .onFirstCall()
      .returns(mockContactsList);

    mockStorage.createModel
      .withArgs(contactsModel)
      .onFirstCall()
      .returns(mockContactsStorage);

    let contactsService = contacts(mockStorage);

    contactsService.initialize();

    expect(contactsService.model)
      .to.equal(mockContactsList);

    expect(contactsService.storage)
      .to.equal(mockContactsStorage);

    expect(mockContactsStorage.getAllContacts.calledOnce)
      .to.be.true();

    expect(mockStorage.createModel.calledOnce)
      .to.be.true();
  });
});