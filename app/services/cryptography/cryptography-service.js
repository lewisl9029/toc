export default function cryptography(sjcl) {
  let cryptographyService = {};

  cryptographyService.initialize = function initializeCryptography() {
  };

  cryptographyService.ENCRYPTED_OBJECT = {
    name: 'tocEncryptedObject',
    //TODO: use JSON Schema URI for versioning
    schema: {
      type: 'object',
      properties: {
        ct: {
          type: 'string'
        }
      },
      required: ['ct']
    }
  };

  cryptographyService.password = 'test';

  cryptographyService.encrypt = function encrypt(object) {
    //TODO: progressively replace with webcrypto implementation
    let plainText = JSON.stringify(object);

    let cipherText = sjcl.encrypt(cryptographyService.password, plainText);

    return {
      ct: cipherText
    };
  };

  cryptographyService.decrypt = function decrypt(encryptedObject) {
    let cipherText = encryptedObject.ct;

    let plainText = sjcl.decrypt(cryptographyService.password, cipherText);

    return JSON.parse(plainText);
  };

  return cryptographyService;
}
