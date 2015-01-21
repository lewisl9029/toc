import contacts from './contacts-service';
import R from 'ramda';
import storageMock from 'services/storage/storage-mock';

describe('contacts service', function() {
  it('should run test', function() {
    var expectedContacts = [{
      id: 1,
      name: 'contact 1'
    }, {
      id: 2,
      name: 'contact 2'
    }, {
      id: 3,
      name: 'contact 3'
    }];
    expect(contacts(undefined, R, storageMock))
      .to.deep.equal(expectedContacts);
  });
});
