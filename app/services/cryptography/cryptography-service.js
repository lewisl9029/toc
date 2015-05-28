export default function cryptography($q, forge) {
  //TODO: add user setting to disable encryption
  let cachedCredentials;

  // for encryption + authentication with a single key
  const AES_ENCRYPTION_MODE = 'AES-GCM';

  const AES_KEY_STRENGTH = 128;

  // From Forge docs:
  // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
  const PBKDF2_KEY_LENGTH = AES_KEY_STRENGTH / 8;

  // Could probably afford to use more
  const PBKDF2_ITERATIONS = 10000;

  const HMAC_DIGEST_ALGORITHM = 'sha256';

  const ENCRYPTED_OBJECT = {
    name: 'tocEncryptedObject',
    //TODO: use JSON Schema URI for versioning
    schema: {
      type: 'object',
      properties: {
        ct: {
          type: 'string'
        },
        tag: {
          type: 'string'
        },
        iv: {
          type: 'string'
        }
      },
      required: ['ct', 'tag', 'iv']
    }
  };

  const UNENCRYPTED_OBJECT = {
    name: 'tocUnencryptedObject',
    schema: {
      type: 'object',
      properties: {
        pt: {
          type: 'string'
        }
      },
      required: ['pt']
    }
  };

  // replaces forwardslash in base64 string for use in paths for indexeddb
  let escapeBase64 = function escapeBase64(base64) {
    return base64.replace(/\//g, '.');
  };

  let unescapeBase64 = function unescapeBase64(base64) {
    return base64.replace(/\./g, '/');
  };

  let checkCredentials =
    function checkCredentials(credentials) {
      if (credentials && credentials.salt && credentials.key) {
        return;
      }
      //FIXME: Throw error object instead?
      throw new Error('cryptography: mising credentials');
    };

  let getHmac = function getHmac(object, credentials = cachedCredentials) {
    checkCredentials(credentials);

    let plaintext = JSON.stringify(object);

    let hmac = forge.hmac.create();

    hmac.start(HMAC_DIGEST_ALGORITHM, credentials.key);
    hmac.update(plaintext);

    return hmac.digest().getBytes();
  };

  let encryptBase =
    function encryptBase(object, ivBytes, credentials = cachedCredentials) {
      checkCredentials(credentials);

      let plaintext = JSON.stringify(object);

      let cipher = forge.cipher.createCipher(
        AES_ENCRYPTION_MODE,
        credentials.key
      );

      cipher.start({iv: ivBytes});
      cipher.update(forge.util.createBuffer(plaintext));
      cipher.finish();

      let iv = forge.util.encode64(ivBytes);
      let ct = forge.util.encode64(cipher.output.getBytes());
      let tag = forge.util.encode64(cipher.mode.tag.getBytes());

      return { iv, ct, tag };
    };

  // Hand-rolled deterministic encryption scheme.
  // TODO: replace with something standard like SIV-AES
  let encryptDeterministic =
    function encryptDeterministic(object, credentials = cachedCredentials) {
      let ivBytes = getHmac(object);

      return encryptBase(object, ivBytes, credentials);
    };

  let encrypt = function encrypt(object, credentials = cachedCredentials) {
    let ivBytes = forge.random.getBytesSync(16);

    return encryptBase(object, ivBytes, credentials);
  };

  let decrypt =
    function decrypt(encryptedObject, credentials = cachedCredentials) {
      checkCredentials(credentials);

      let ciphertext = forge.util.decode64(encryptedObject.ct);
      let iv = forge.util.decode64(encryptedObject.iv);
      let tag = forge.util.decode64(encryptedObject.tag);

      let decipher = forge.cipher.createDecipher(
        AES_ENCRYPTION_MODE,
        credentials.key
      );

      decipher.start({
        iv: forge.util.createBuffer(iv),
        tag: forge.util.createBuffer(tag)
      });

      decipher.update(forge.util.createBuffer(ciphertext));

      let result = decipher.finish();

      if (!result) {
        throw new Error('cryptography: decryption failed');
      }

      return JSON.parse(decipher.output.getBytes());
    };

  let deriveCredentials = function deriveCredentials(userCredentials) {
    let salt = forge.util.hexToBytes(userCredentials.id);
    let key = forge.pkcs5.pbkdf2(
      userCredentials.password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH
    );

    return { salt, key };
  };

  let initialize = function initializeCryptography(userCredentials) {
    cachedCredentials = deriveCredentials(userCredentials);
    return cachedCredentials;
  };

  let restore = function restoreCryptography(savedCredentials) {
    cachedCredentials = savedCredentials;
    return savedCredentials;
  };

  let destroy = function destroyCryptography() {
    cachedCredentials = undefined;
  };

  return {
    ENCRYPTED_OBJECT,
    UNENCRYPTED_OBJECT,
    escapeBase64,
    unescapeBase64,
    getHmac,
    encryptDeterministic,
    encrypt,
    decrypt,
    deriveCredentials,
    initialize,
    restore,
    destroy
  };
}
