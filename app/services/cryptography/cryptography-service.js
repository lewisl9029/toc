export default function cryptography(sjcl) {
  let cryptographyService = {};

  cryptographyService.initialize = function initializeCryptography() {
    cryptographyService.password = 'test';
    cryptographyService.salt = 'test1234';
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

  cryptographyService.encrypt = function encrypt(object) {
    //TODO: progressively replace with webcrypto implementation, AES-GCM
    let plaintext = JSON.stringify(object);

    let options = {
      salt: cryptographyService.salt,
      mode: 'gcm'
    };

    let ciphertext = sjcl.encrypt(
      cryptographyService.password,
      plaintext,
      options
    );

    return {
      ct: ciphertext
    };
  };

  cryptographyService.decrypt = function decrypt(encryptedObject) {
    let plaintext = sjcl.decrypt(
      cryptographyService.password,
      encryptedObject.ct
    );

    return JSON.parse(plaintext);
  };

  return cryptographyService;
}
