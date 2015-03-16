/* */ 
(function(Buffer, process) {
  var Url = require("url");
  var spawn = require("child_process").spawn;
  var fs = require("fs");
  exports.XMLHttpRequest = function() {
    "use strict";
    var self = this;
    var http = require("http");
    var https = require("https");
    var request;
    var response;
    var settings = {};
    var disableHeaderCheck = false;
    var defaultHeaders = {
      "User-Agent": "node-XMLHttpRequest",
      "Accept": "*/*"
    };
    var headers = defaultHeaders;
    var forbiddenRequestHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "content-transfer-encoding", "cookie", "cookie2", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];
    var forbiddenRequestMethods = ["TRACE", "TRACK", "CONNECT"];
    var sendFlag = false;
    var errorFlag = false;
    var listeners = {};
    this.UNSENT = 0;
    this.OPENED = 1;
    this.HEADERS_RECEIVED = 2;
    this.LOADING = 3;
    this.DONE = 4;
    this.readyState = this.UNSENT;
    this.onreadystatechange = null;
    this.responseText = "";
    this.responseXML = "";
    this.status = null;
    this.statusText = null;
    var isAllowedHttpHeader = function(header) {
      return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
    };
    var isAllowedHttpMethod = function(method) {
      return (method && forbiddenRequestMethods.indexOf(method) === -1);
    };
    this.open = function(method, url, async, user, password) {
      this.abort();
      errorFlag = false;
      if (!isAllowedHttpMethod(method)) {
        throw "SecurityError: Request method not allowed";
      }
      settings = {
        "method": method,
        "url": url.toString(),
        "async": (typeof async !== "boolean" ? true : async),
        "user": user || null,
        "password": password || null
      };
      setState(this.OPENED);
    };
    this.setDisableHeaderCheck = function(state) {
      disableHeaderCheck = state;
    };
    this.setRequestHeader = function(header, value) {
      if (this.readyState !== this.OPENED) {
        throw "INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN";
      }
      if (!isAllowedHttpHeader(header)) {
        console.warn("Refused to set unsafe header \"" + header + "\"");
        return ;
      }
      if (sendFlag) {
        throw "INVALID_STATE_ERR: send flag is true";
      }
      headers[header] = value;
    };
    this.getResponseHeader = function(header) {
      if (typeof header === "string" && this.readyState > this.OPENED && response && response.headers && response.headers[header.toLowerCase()] && !errorFlag) {
        return response.headers[header.toLowerCase()];
      }
      return null;
    };
    this.getAllResponseHeaders = function() {
      if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
        return "";
      }
      var result = "";
      for (var i in response.headers) {
        if (i !== "set-cookie" && i !== "set-cookie2") {
          result += i + ": " + response.headers[i] + "\r\n";
        }
      }
      return result.substr(0, result.length - 2);
    };
    this.getRequestHeader = function(name) {
      if (typeof name === "string" && headers[name]) {
        return headers[name];
      }
      return "";
    };
    this.send = function(data) {
      if (this.readyState !== this.OPENED) {
        throw "INVALID_STATE_ERR: connection must be opened before send() is called";
      }
      if (sendFlag) {
        throw "INVALID_STATE_ERR: send has already been called";
      }
      var ssl = false,
          local = false;
      var url = Url.parse(settings.url);
      var host;
      switch (url.protocol) {
        case "https:":
          ssl = true;
        case "http:":
          host = url.hostname;
          break;
        case "file:":
          local = true;
          break;
        case undefined:
        case "":
          host = "localhost";
          break;
        default:
          throw "Protocol not supported.";
      }
      if (local) {
        if (settings.method !== "GET") {
          throw "XMLHttpRequest: Only GET method is supported";
        }
        if (settings.async) {
          fs.readFile(url.pathname, "utf8", function(error, data) {
            if (error) {
              self.handleError(error);
            } else {
              self.status = 200;
              self.responseText = data;
              setState(self.DONE);
            }
          });
        } else {
          try {
            this.responseText = fs.readFileSync(url.pathname, "utf8");
            this.status = 200;
            setState(self.DONE);
          } catch (e) {
            this.handleError(e);
          }
        }
        return ;
      }
      var port = url.port || (ssl ? 443 : 80);
      var uri = url.pathname + (url.search ? url.search : "");
      headers.Host = host;
      if (!((ssl && port === 443) || port === 80)) {
        headers.Host += ":" + url.port;
      }
      if (settings.user) {
        if (typeof settings.password === "undefined") {
          settings.password = "";
        }
        var authBuf = new Buffer(settings.user + ":" + settings.password);
        headers.Authorization = "Basic " + authBuf.toString("base64");
      }
      if (settings.method === "GET" || settings.method === "HEAD") {
        data = null;
      } else if (data) {
        headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "text/plain;charset=UTF-8";
        }
      } else if (settings.method === "POST") {
        headers["Content-Length"] = 0;
      }
      var options = {
        host: host,
        port: port,
        path: uri,
        method: settings.method,
        headers: headers,
        agent: false
      };
      errorFlag = false;
      if (settings.async) {
        var doRequest = ssl ? https.request : http.request;
        sendFlag = true;
        self.dispatchEvent("readystatechange");
        var responseHandler = function responseHandler(resp) {
          response = resp;
          if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
            settings.url = response.headers.location;
            var url = Url.parse(settings.url);
            host = url.hostname;
            var newOptions = {
              hostname: url.hostname,
              port: url.port,
              path: url.path,
              method: response.statusCode === 303 ? "GET" : settings.method,
              headers: headers
            };
            request = doRequest(newOptions, responseHandler).on("error", errorHandler);
            request.end();
            return ;
          }
          response.setEncoding("utf8");
          setState(self.HEADERS_RECEIVED);
          self.status = response.statusCode;
          response.on("data", function(chunk) {
            if (chunk) {
              self.responseText += chunk;
            }
            if (sendFlag) {
              setState(self.LOADING);
            }
          });
          response.on("end", function() {
            if (sendFlag) {
              setState(self.DONE);
              sendFlag = false;
            }
          });
          response.on("error", function(error) {
            self.handleError(error);
          });
        };
        var errorHandler = function errorHandler(error) {
          self.handleError(error);
        };
        request = doRequest(options, responseHandler).on("error", errorHandler);
        if (data) {
          request.write(data);
        }
        request.end();
        self.dispatchEvent("loadstart");
      } else {
        var contentFile = ".node-xmlhttprequest-content-" + process.pid;
        var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
        fs.writeFileSync(syncFile, "", "utf8");
        var execString = "var http = require('http'), https = require('https'), fs = require('fs');" + "var doRequest = http" + (ssl ? "s" : "") + ".request;" + "var options = " + JSON.stringify(options) + ";" + "var responseText = '';" + "var req = doRequest(options, function(response) {" + "response.setEncoding('utf8');" + "response.on('data', function(chunk) {" + "  responseText += chunk;" + "});" + "response.on('end', function() {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "response.on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "}).on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + (data ? "req.write('" + JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();";
        var syncProc = spawn(process.argv[0], ["-e", execString]);
        while (fs.existsSync(syncFile)) {}
        var resp = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
        syncProc.stdin.end();
        fs.unlinkSync(contentFile);
        if (resp.err) {
          self.handleError(resp.err);
        } else {
          response = resp.data;
          self.status = resp.data.statusCode;
          self.responseText = resp.data.text;
          setState(self.DONE);
        }
      }
    };
    this.handleError = function(error) {
      this.status = 503;
      this.statusText = error;
      this.responseText = error.stack;
      errorFlag = true;
      setState(this.DONE);
    };
    this.abort = function() {
      if (request) {
        request.abort();
        request = null;
      }
      headers = defaultHeaders;
      this.responseText = "";
      this.responseXML = "";
      errorFlag = true;
      if (this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || sendFlag) && this.readyState !== this.DONE) {
        sendFlag = false;
        setState(this.DONE);
      }
      this.readyState = this.UNSENT;
    };
    this.addEventListener = function(event, callback) {
      if (!(event in listeners)) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    };
    this.removeEventListener = function(event, callback) {
      if (event in listeners) {
        listeners[event] = listeners[event].filter(function(ev) {
          return ev !== callback;
        });
      }
    };
    this.dispatchEvent = function(event) {
      if (typeof self["on" + event] === "function") {
        self["on" + event]();
      }
      if (event in listeners) {
        for (var i = 0,
            len = listeners[event].length; i < len; i++) {
          listeners[event][i].call(self);
        }
      }
    };
    var setState = function(state) {
      if (state == self.LOADING || self.readyState !== state) {
        self.readyState = state;
        if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
          self.dispatchEvent("readystatechange");
        }
        if (self.readyState === self.DONE && !errorFlag) {
          self.dispatchEvent("load");
          self.dispatchEvent("loadend");
        }
      }
    };
  };
})(require("buffer").Buffer, require("process"));
