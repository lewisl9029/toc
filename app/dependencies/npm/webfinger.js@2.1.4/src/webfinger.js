/* */ 
"format cjs";
(function(process) {
  if (typeof XMLHttpRequest === 'undefined') {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  }
  (function(undefined) {
    var LINK_URI_MAPS = {
      'http://webfist.org/spec/rel': 'webfist',
      'http://webfinger.net/rel/avatar': 'avatar',
      'remotestorage': 'remotestorage',
      'remoteStorage': 'remotestorage',
      'http://www.packetizer.com/rel/share': 'share',
      'http://webfinger.net/rel/profile-page': 'profile',
      'me': 'profile',
      'vcard': 'vcard',
      'blog': 'blog',
      'http://packetizer.com/rel/blog': 'blog',
      'http://schemas.google.com/g/2010#updates-from': 'updates',
      'https://camlistore.org/rel/server': 'camilstore'
    };
    var LINK_PROPERTIES = {
      'avatar': [],
      'remotestorage': [],
      'blog': [],
      'vcard': [],
      'updates': [],
      'share': [],
      'profile': [],
      'webfist': [],
      'camilstore': []
    };
    var URIS = ['webfinger', 'host-meta', 'host-meta.json'];
    function _err(obj) {
      obj.toString = function() {
        return this.message;
      };
      return obj;
    }
    function WebFinger(config) {
      if (typeof config !== 'object') {
        config = {};
      }
      this.config = {
        tls_only: (typeof config.tls_only !== 'undefined') ? config.tls_only : true,
        webfist_fallback: (typeof config.webfist_fallback !== 'undefined') ? config.webfist_fallback : false,
        uri_fallback: (typeof config.uri_fallback !== 'undefined') ? config.uri_fallback : false,
        request_timeout: (typeof config.request_timeout !== 'undefined') ? config.request_timeout : 10000
      };
    }
    WebFinger.prototype._fetchJRD = function(url, cb) {
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (self._isValidJSON(xhr.responseText)) {
              cb(null, xhr.responseText);
            } else {
              cb(_err({
                message: 'invalid json',
                url: url,
                status: xhr.status
              }));
            }
          } else if (xhr.status === 404) {
            cb(_err({
              message: 'endpoint unreachable',
              url: url,
              status: xhr.status
            }));
          } else {
            cb(_err({
              message: 'error during request',
              url: url,
              status: xhr.status
            }));
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Accept', 'application/jrd+json, application/json');
      xhr.send();
    };
    WebFinger.prototype._isValidJSON = function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };
    WebFinger.prototype._isLocalhost = function(host) {
      var local = /^localhost(\.localdomain)?(\:[0-9]+)?$/;
      return local.test(host);
    };
    WebFinger.prototype._processJRD = function(JRD, cb) {
      var self = this;
      var parsedJRD = JSON.parse(JRD);
      if ((typeof parsedJRD !== 'object') || (typeof parsedJRD.links !== 'object')) {
        if (typeof parsedJRD.error !== 'undefined') {
          cb(_err({message: parsedJRD.error}));
        } else {
          cb(_err({message: 'unknown response from server'}));
        }
        return false;
      }
      var links = parsedJRD.links;
      var result = {
        object: parsedJRD,
        json: JRD,
        idx: {}
      };
      result.idx.properties = {'name': undefined};
      result.idx.links = JSON.parse(JSON.stringify(LINK_PROPERTIES));
      links.map(function(link, i) {
        if (LINK_URI_MAPS.hasOwnProperty(link.rel)) {
          if (result.idx.links[LINK_URI_MAPS[link.rel]]) {
            var entry = {};
            Object.keys(link).map(function(item, n) {
              entry[item] = link[item];
            });
            result.idx.links[LINK_URI_MAPS[link.rel]].push(entry);
          }
        }
      });
      var props = JSON.parse(JRD).properties;
      for (var key in props) {
        if (props.hasOwnProperty(key)) {
          if (key === 'http://packetizer.com/ns/name') {
            result.idx.properties.name = props[key];
          }
        }
      }
      cb(null, result);
    };
    WebFinger.prototype.lookup = function(address, cb) {
      if (typeof address !== 'string') {
        throw new Error('first parameter must be a user address');
      } else if (typeof cb !== 'function') {
        throw new Error('second parameter must be a callback');
      }
      var self = this;
      var parts = address.replace(/ /g, '').split('@');
      var host = parts[1];
      var uri_index = 0;
      var protocol = 'https';
      if (parts.length !== 2) {
        cb(_err({message: 'invalid user address ' + address + ' ( expected format: user@host.com )'}));
        return false;
      } else if (self._isLocalhost(host)) {
        protocol = 'http';
      }
      function _buildURL() {
        return protocol + '://' + host + '/.well-known/' + URIS[uri_index] + '?resource=acct:' + address;
      }
      function _fallbackChecks(err) {
        if ((self.config.uri_fallback) && (host !== 'webfist.org') && (uri_index !== URIS.length - 1)) {
          uri_index = uri_index + 1;
          _call();
        } else if ((!self.config.tls_only) && (protocol === 'https')) {
          uri_index = 0;
          protocol = 'http';
          _call();
        } else if ((self.config.webfist_fallback) && (host !== 'webfist.org')) {
          uri_index = 0;
          protocol = 'http';
          host = 'webfist.org';
          self._fetchJRD(_buildURL(), function(err, data) {
            if (err) {
              cb(err);
              return false;
            }
            self._processJRD(data, function(err, result) {
              if ((typeof result.idx.links.webfist === 'object') && (typeof result.idx.links.webfist[0].href === 'string')) {
                self._fetchJRD(result.idx.links.webfist[0].href, function(err, JRD) {
                  if (err) {
                    cb(err);
                  } else {
                    self._processJRD(JRD, cb);
                  }
                });
              }
            });
          });
        } else {
          cb(err);
          return false;
        }
      }
      function _call() {
        self._fetchJRD(_buildURL(), function(err, JRD) {
          if (err) {
            _fallbackChecks(err);
          } else {
            self._processJRD(JRD, cb);
          }
        });
      }
      setTimeout(_call, 0);
    };
    if (typeof window === 'object') {
      window.WebFinger = WebFinger;
    } else if (typeof(define) === 'function' && define.amd) {
      define([], function() {
        return WebFinger;
      });
    } else {
      try {
        module.exports = WebFinger;
      } catch (e) {}
    }
  })();
})(require("process"));
