export default function cryptography(sjcl) {
  //TODO: progressively replace with webcrypto implementation
  let credentials;

  // for encryption + authentication with a single key
  const AES_ENCRYPTION_MODE = 'gcm';

  // default key strength used by sjcl.encrypt
  const AES_KEY_STRENGTH = 128;

  const ENCRYPTED_OBJECT = {
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

  let checkCredentials =
    function checkCredentials(credentials) {
      if (credentials.id && credentials.password) {
        return;
      }

      throw 'cryptography: mising credentials';
    };

  let getHmac = function getHmac(object, credentials = credentials) {
    checkCredentials(credentials);

    let plaintext = JSON.stringify(object);

    let options = {
      salt: credentials.id
    };

    let derivedKey = sjcl.misc.cachedPbkdf2(
      credentials.password,
      options
    ).key;

    let hmac = (new sjcl.misc.hmac(derivedKey)).mac(plaintext);

    // iv cannot be longer than 4 bytes for sjcl?
    // see source for sjcl.encrypt
    return hmac.slice(0, AES_KEY_STRENGTH/32);
  };

  let encryptBase =
    function encryptBase(object, options, credentials = credentials) {
      let plaintext = JSON.stringify(object);

      let ciphertext = sjcl.encrypt(
        credentials.password,
        plaintext,
        options
      );

      return {
        ct: ciphertext
      };
    };

  // using the synthetic initialization vector (SIV) variant of AES
  // will need an audit of the implementation
  let encryptDeterministic =
    function encryptDeterministic(object, credentials = credentials) {
      checkCredentials(credentials);

      let options = {
        salt: credentials.id,
        mode: AES_ENCRYPTION_MODE,
        iv: getHmac(object)
      };

      return encryptBase(object, options);
    };

  let encrypt = function encrypt(object, credentials = credentials) {
    checkCredentials(credentials);

    let options = {
      salt: credentials.id,
      mode: AES_ENCRYPTION_MODE
    };

    return encryptBase(object, options);
  };

  let decrypt = function decrypt(encryptedObject, credentials = credentials) {
    checkCredentials(credentials);

    let ciphertext = encryptedObject.ct || encryptedObject;

    let plaintext = sjcl.decrypt(
      credentials.password,
      ciphertext
    );

    return JSON.parse(plaintext);
  };

  let initialize = function initializeCryptography(userCredentials) {
    // mutable local state because it's not suited for storage in state trees
    credentials = userCredentials;
  };

  return {
    ENCRYPTED_OBJECT,
    getHmac,
    encryptDeterministic,
    encrypt,
    decrypt,
    initialize
  };
}
