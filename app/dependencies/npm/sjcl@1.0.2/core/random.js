/* */ 
sjcl.prng = function(defaultParanoia) {
  this._pools = [new sjcl.hash.sha256()];
  this._poolEntropy = [0];
  this._reseedCount = 0;
  this._robins = {};
  this._eventId = 0;
  this._collectorIds = {};
  this._collectorIdNext = 0;
  this._strength = 0;
  this._poolStrength = 0;
  this._nextReseed = 0;
  this._key = [0, 0, 0, 0, 0, 0, 0, 0];
  this._counter = [0, 0, 0, 0];
  this._cipher = undefined;
  this._defaultParanoia = defaultParanoia;
  this._collectorsStarted = false;
  this._callbacks = {
    progress: {},
    seeded: {}
  };
  this._callbackI = 0;
  this._NOT_READY = 0;
  this._READY = 1;
  this._REQUIRES_RESEED = 2;
  this._MAX_WORDS_PER_BURST = 65536;
  this._PARANOIA_LEVELS = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
  this._MILLISECONDS_PER_RESEED = 30000;
  this._BITS_PER_RESEED = 80;
};
sjcl.prng.prototype = {
  randomWords: function(nwords, paranoia) {
    var out = [],
        i,
        readiness = this.isReady(paranoia),
        g;
    if (readiness === this._NOT_READY) {
      throw new sjcl.exception.notReady("generator isn't seeded");
    } else if (readiness & this._REQUIRES_RESEED) {
      this._reseedFromPools(!(readiness & this._READY));
    }
    for (i = 0; i < nwords; i += 4) {
      if ((i + 1) % this._MAX_WORDS_PER_BURST === 0) {
        this._gate();
      }
      g = this._gen4words();
      out.push(g[0], g[1], g[2], g[3]);
    }
    this._gate();
    return out.slice(0, nwords);
  },
  setDefaultParanoia: function(paranoia, allowZeroParanoia) {
    if (paranoia === 0 && allowZeroParanoia !== "Setting paranoia=0 will ruin your security; use it only for testing") {
      throw "Setting paranoia=0 will ruin your security; use it only for testing";
    }
    this._defaultParanoia = paranoia;
  },
  addEntropy: function(data, estimatedEntropy, source) {
    source = source || "user";
    var id,
        i,
        tmp,
        t = (new Date()).valueOf(),
        robin = this._robins[source],
        oldReady = this.isReady(),
        err = 0,
        objName;
    id = this._collectorIds[source];
    if (id === undefined) {
      id = this._collectorIds[source] = this._collectorIdNext++;
    }
    if (robin === undefined) {
      robin = this._robins[source] = 0;
    }
    this._robins[source] = (this._robins[source] + 1) % this._pools.length;
    switch (typeof(data)) {
      case "number":
        if (estimatedEntropy === undefined) {
          estimatedEntropy = 1;
        }
        this._pools[robin].update([id, this._eventId++, 1, estimatedEntropy, t, 1, data | 0]);
        break;
      case "object":
        objName = Object.prototype.toString.call(data);
        if (objName === "[object Uint32Array]") {
          tmp = [];
          for (i = 0; i < data.length; i++) {
            tmp.push(data[i]);
          }
          data = tmp;
        } else {
          if (objName !== "[object Array]") {
            err = 1;
          }
          for (i = 0; i < data.length && !err; i++) {
            if (typeof(data[i]) !== "number") {
              err = 1;
            }
          }
        }
        if (!err) {
          if (estimatedEntropy === undefined) {
            estimatedEntropy = 0;
            for (i = 0; i < data.length; i++) {
              tmp = data[i];
              while (tmp > 0) {
                estimatedEntropy++;
                tmp = tmp >>> 1;
              }
            }
          }
          this._pools[robin].update([id, this._eventId++, 2, estimatedEntropy, t, data.length].concat(data));
        }
        break;
      case "string":
        if (estimatedEntropy === undefined) {
          estimatedEntropy = data.length;
        }
        this._pools[robin].update([id, this._eventId++, 3, estimatedEntropy, t, data.length]);
        this._pools[robin].update(data);
        break;
      default:
        err = 1;
    }
    if (err) {
      throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
    }
    this._poolEntropy[robin] += estimatedEntropy;
    this._poolStrength += estimatedEntropy;
    if (oldReady === this._NOT_READY) {
      if (this.isReady() !== this._NOT_READY) {
        this._fireEvent("seeded", Math.max(this._strength, this._poolStrength));
      }
      this._fireEvent("progress", this.getProgress());
    }
  },
  isReady: function(paranoia) {
    var entropyRequired = this._PARANOIA_LEVELS[(paranoia !== undefined) ? paranoia : this._defaultParanoia];
    if (this._strength && this._strength >= entropyRequired) {
      return (this._poolEntropy[0] > this._BITS_PER_RESEED && (new Date()).valueOf() > this._nextReseed) ? this._REQUIRES_RESEED | this._READY : this._READY;
    } else {
      return (this._poolStrength >= entropyRequired) ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY;
    }
  },
  getProgress: function(paranoia) {
    var entropyRequired = this._PARANOIA_LEVELS[paranoia ? paranoia : this._defaultParanoia];
    if (this._strength >= entropyRequired) {
      return 1.0;
    } else {
      return (this._poolStrength > entropyRequired) ? 1.0 : this._poolStrength / entropyRequired;
    }
  },
  startCollectors: function() {
    if (this._collectorsStarted) {
      return ;
    }
    this._eventListener = {
      loadTimeCollector: this._bind(this._loadTimeCollector),
      mouseCollector: this._bind(this._mouseCollector),
      keyboardCollector: this._bind(this._keyboardCollector),
      accelerometerCollector: this._bind(this._accelerometerCollector),
      touchCollector: this._bind(this._touchCollector)
    };
    if (window.addEventListener) {
      window.addEventListener("load", this._eventListener.loadTimeCollector, false);
      window.addEventListener("mousemove", this._eventListener.mouseCollector, false);
      window.addEventListener("keypress", this._eventListener.keyboardCollector, false);
      window.addEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
      window.addEventListener("touchmove", this._eventListener.touchCollector, false);
    } else if (document.attachEvent) {
      document.attachEvent("onload", this._eventListener.loadTimeCollector);
      document.attachEvent("onmousemove", this._eventListener.mouseCollector);
      document.attachEvent("keypress", this._eventListener.keyboardCollector);
    } else {
      throw new sjcl.exception.bug("can't attach event");
    }
    this._collectorsStarted = true;
  },
  stopCollectors: function() {
    if (!this._collectorsStarted) {
      return ;
    }
    if (window.removeEventListener) {
      window.removeEventListener("load", this._eventListener.loadTimeCollector, false);
      window.removeEventListener("mousemove", this._eventListener.mouseCollector, false);
      window.removeEventListener("keypress", this._eventListener.keyboardCollector, false);
      window.removeEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
      window.removeEventListener("touchmove", this._eventListener.touchCollector, false);
    } else if (document.detachEvent) {
      document.detachEvent("onload", this._eventListener.loadTimeCollector);
      document.detachEvent("onmousemove", this._eventListener.mouseCollector);
      document.detachEvent("keypress", this._eventListener.keyboardCollector);
    }
    this._collectorsStarted = false;
  },
  addEventListener: function(name, callback) {
    this._callbacks[name][this._callbackI++] = callback;
  },
  removeEventListener: function(name, cb) {
    var i,
        j,
        cbs = this._callbacks[name],
        jsTemp = [];
    for (j in cbs) {
      if (cbs.hasOwnProperty(j) && cbs[j] === cb) {
        jsTemp.push(j);
      }
    }
    for (i = 0; i < jsTemp.length; i++) {
      j = jsTemp[i];
      delete cbs[j];
    }
  },
  _bind: function(func) {
    var that = this;
    return function() {
      func.apply(that, arguments);
    };
  },
  _gen4words: function() {
    for (var i = 0; i < 4; i++) {
      this._counter[i] = this._counter[i] + 1 | 0;
      if (this._counter[i]) {
        break;
      }
    }
    return this._cipher.encrypt(this._counter);
  },
  _gate: function() {
    this._key = this._gen4words().concat(this._gen4words());
    this._cipher = new sjcl.cipher.aes(this._key);
  },
  _reseed: function(seedWords) {
    this._key = sjcl.hash.sha256.hash(this._key.concat(seedWords));
    this._cipher = new sjcl.cipher.aes(this._key);
    for (var i = 0; i < 4; i++) {
      this._counter[i] = this._counter[i] + 1 | 0;
      if (this._counter[i]) {
        break;
      }
    }
  },
  _reseedFromPools: function(full) {
    var reseedData = [],
        strength = 0,
        i;
    this._nextReseed = reseedData[0] = (new Date()).valueOf() + this._MILLISECONDS_PER_RESEED;
    for (i = 0; i < 16; i++) {
      reseedData.push(Math.random() * 0x100000000 | 0);
    }
    for (i = 0; i < this._pools.length; i++) {
      reseedData = reseedData.concat(this._pools[i].finalize());
      strength += this._poolEntropy[i];
      this._poolEntropy[i] = 0;
      if (!full && (this._reseedCount & (1 << i))) {
        break;
      }
    }
    if (this._reseedCount >= 1 << this._pools.length) {
      this._pools.push(new sjcl.hash.sha256());
      this._poolEntropy.push(0);
    }
    this._poolStrength -= strength;
    if (strength > this._strength) {
      this._strength = strength;
    }
    this._reseedCount++;
    this._reseed(reseedData);
  },
  _keyboardCollector: function() {
    this._addCurrentTimeToEntropy(1);
  },
  _mouseCollector: function(ev) {
    var x,
        y;
    try {
      x = ev.x || ev.clientX || ev.offsetX || 0;
      y = ev.y || ev.clientY || ev.offsetY || 0;
    } catch (err) {
      x = 0;
      y = 0;
    }
    if (x != 0 && y != 0) {
      sjcl.random.addEntropy([x, y], 2, "mouse");
    }
    this._addCurrentTimeToEntropy(0);
  },
  _touchCollector: function(ev) {
    var touch = ev.touches[0] || ev.changedTouches[0];
    var x = touch.pageX || touch.clientX,
        y = touch.pageY || touch.clientY;
    sjcl.random.addEntropy([x, y], 1, "touch");
    this._addCurrentTimeToEntropy(0);
  },
  _loadTimeCollector: function() {
    this._addCurrentTimeToEntropy(2);
  },
  _addCurrentTimeToEntropy: function(estimatedEntropy) {
    if (typeof window !== 'undefined' && window.performance && typeof window.performance.now === "function") {
      sjcl.random.addEntropy(window.performance.now(), estimatedEntropy, "loadtime");
    } else {
      sjcl.random.addEntropy((new Date()).valueOf(), estimatedEntropy, "loadtime");
    }
  },
  _accelerometerCollector: function(ev) {
    var ac = ev.accelerationIncludingGravity.x || ev.accelerationIncludingGravity.y || ev.accelerationIncludingGravity.z;
    if (window.orientation) {
      var or = window.orientation;
      if (typeof or === "number") {
        sjcl.random.addEntropy(or, 1, "accelerometer");
      }
    }
    if (ac) {
      sjcl.random.addEntropy(ac, 2, "accelerometer");
    }
    this._addCurrentTimeToEntropy(0);
  },
  _fireEvent: function(name, arg) {
    var j,
        cbs = sjcl.random._callbacks[name],
        cbsTemp = [];
    for (j in cbs) {
      if (cbs.hasOwnProperty(j)) {
        cbsTemp.push(cbs[j]);
      }
    }
    for (j = 0; j < cbsTemp.length; j++) {
      cbsTemp[j](arg);
    }
  }
};
sjcl.random = new sjcl.prng(6);
(function() {
  function getCryptoModule() {
    try {
      return require("crypto");
    } catch (e) {
      return null;
    }
  }
  try {
    var buf,
        crypt,
        ab;
    if (typeof module !== 'undefined' && module.exports && (crypt = getCryptoModule()) && crypt.randomBytes) {
      buf = crypt.randomBytes(1024 / 8);
      buf = new Uint32Array(new Uint8Array(buf).buffer);
      sjcl.random.addEntropy(buf, 1024, "crypto.randomBytes");
    } else if (typeof window !== 'undefined' && typeof Uint32Array !== 'undefined') {
      ab = new Uint32Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(ab);
      } else if (window.msCrypto && window.msCrypto.getRandomValues) {
        window.msCrypto.getRandomValues(ab);
      } else {
        return ;
      }
      sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
    } else {}
  } catch (e) {
    if (typeof window !== 'undefined' && window.console) {
      console.log("There was an error collecting entropy from the browser:");
      console.log(e);
    }
  }
}());
