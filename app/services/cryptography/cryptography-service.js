export default function cryptography(sjcl) {
  let credentials = {};

  let ENCRYPTED_OBJECT = {
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

  let encrypt = function encrypt(object) {
    //TODO: progressively replace with webcrypto implementation
    let plaintext = JSON.stringify(object);

    let options = {
      salt: credentials.salt,
      mode: 'gcm'
    };

    let ciphertext = sjcl.encrypt(
      credentials.password,
      plaintext,
      options
    );

    return {
      ct: ciphertext
    };
  };

  let decrypt = function decrypt(encryptedObject) {
    let plaintext = sjcl.decrypt(
      credentials.password,
      encryptedObject.ct
    );

    return JSON.parse(plaintext);
  };

  let initialize = function initializeCryptography() {
    //TODO: initialize with user specific credentials on login
    credentials.password = 'test';
    credentials.salt = 'test1234';
  };

  return {
    ENCRYPTED_OBJECT: ENCRYPTED_OBJECT,
    encrypt: encrypt,
    decrypt: decrypt,
    initialize: initialize,
  };
}
