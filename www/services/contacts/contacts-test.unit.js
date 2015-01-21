import contacts from './contacts-service';
import R from 'ramda';

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
    expect(contacts(R))
      .to.not.deep.equal(expectedContacts);
  });
});
