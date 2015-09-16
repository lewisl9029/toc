export let serviceName = 'cryptography';
export default /*@ngInject*/ function cryptography(
  $q,
  $window,
  forge
) {
  //TODO: add user setting to disable encryption
  let cachedCredentials;

  const AES_ENCRYPTION_MODE = 'AES-GCM';

  const AES_KEY_STRENGTH = 128;

  // From Forge docs:
  // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
  const PBKDF2_KEY_LENGTH = AES_KEY_STRENGTH / 8;
  const PBKDF2_SALT_LENGTH = PBKDF2_KEY_LENGTH;
  const AES_IV_LENGTH = PBKDF2_KEY_LENGTH;

  // TODO: research what the up-to-date recommendation for PBKDF2 iterations is
  // Could probably afford to use more if needed
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

  let getRandomBytes = function getRandom(size) {
    let deferredRandomBytes = $q.defer();

    forge.random.getBytes(size, (error, bytes) => {
      if (error) {
        return deferredRandomBytes.reject(error);
      }

      deferredRandomBytes.resolve(bytes);
    });

    return deferredRandomBytes.promise;
  };

  let getRandomBase64 = function getRandomBase64(size) {
    return getRandomBytes(size)
      .then((randomBytes) => forge.util.encode64(randomBytes));
  };

  let encodeBase64Sync = function encodeBase64(bytes) {
    let base64 = forge.util.encode64(bytes);
    return base64;
  };

  let decodeBase64Sync = function decodeBase64(base64) {
    let bytes = forge.util.decode64(base64);
    return bytes;
  };

  let encodeBase64 = function encodeBase64(bytes) {
    let base64 = encodeBase64Sync(bytes);
    return $q.when(base64);
  };

  let decodeBase64 = function decodeBase64(base64) {
    let bytes = decodeBase64Sync(base64);
    return $q.when(bytes);
  };

  let checkCredentials =
    function checkCredentials(credentials) {
      if (credentials && credentials.key) {
        return;
      }
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

  let getMd5 = function getMd5(plaintext) {
    let md5 = forge.md.md5.create();
    md5.update(plaintext);

    return md5.digest().toHex();
  };

  let getSha256 = function getSha256(plaintext) {
    let sha256 = forge.md.sha256.create();
    sha256.update(plaintext);

    return sha256.digest().toHex();
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
    let ivBytes = forge.random.getBytesSync(AES_IV_LENGTH);

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

  let createSalt = function createSalt() {
    return getRandomBase64(PBKDF2_SALT_LENGTH);
  };

  let createChallenge = function createChallenge(salt) {
    return $q.when(encrypt(salt));
  };

  let derive = function derive(rawCredentials) {
    let salt = forge.util.decode64(rawCredentials.salt);
    let key = forge.pkcs5.pbkdf2(
      rawCredentials.password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH
    );

    return $q.when({ key });
  };

  let isInitialized = function isInitialized() {
    return cachedCredentials !== undefined;
  };

  let cache = function cache(derivedCredentials) {
    checkCredentials(derivedCredentials);

    cachedCredentials = derivedCredentials;
    return $q.when(derivedCredentials);
  };

  let initialize = function initializeCryptography(credentials) {
    let cachingCredentials = credentials.key ?
      cache({ key: decodeBase64Sync(credentials.key) }) :
      derive(credentials)
        .then(cache);

    return cachingCredentials
      .then((derivedCredentials) => {
        return {
          key: encodeBase64Sync(derivedCredentials.key)
        }
      });
  };

  let destroy = function destroyCryptography() {
    cachedCredentials = undefined;
    return $q.when();
  };

  let cryptographyService = {
    ENCRYPTED_OBJECT,
    UNENCRYPTED_OBJECT,
    escapeBase64,
    unescapeBase64,
    encodeBase64,
    decodeBase64,
    getRandomBase64,
    getHmac,
    getMd5,
    getSha256,
    encryptDeterministic,
    encrypt,
    decrypt,
    createSalt,
    createChallenge,
    derive,
    isInitialized,
    initialize,
    destroy
  };

  $window.tocCrypto = cryptographyService;

  return cryptographyService;
}
