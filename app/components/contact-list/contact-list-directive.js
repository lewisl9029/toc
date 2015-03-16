import template from './contact-list.html!text';

export default function tocContactList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'contactList',
    controller: function ContactListController() {
      this.contacts = {
        1234: {
          userInfo: {
            id: 1234,
            displayName: 'Contact 1',
            email: 'contact1@gmail.com'
          },
          status: {
            activeId: 1234,
            availability: 'online'
          }
        },
        1235: {
          userInfo: {
            id: 1235,
            displayName: 'Contact 2',
            email: 'contact2@gmail.com'
          },
          status: {
            activeId: 1235,
            availability: 'offline'
          }
        },
        1236: {
          userInfo: {
            id: 1236,
            displayName: 'Contact 3',
            email: 'contact3@gmail.com'
          },
          status: {
            activeId: 1236,
            availability: 'away'
          }
        }
      };
    }
  };
}
