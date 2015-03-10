/* */ 
"format cjs";
"use strict";
if (typeof sinon == "undefined") {
  this.sinon = {};
}
(function(global) {
  var xdr = {XDomainRequest: global.XDomainRequest};
  xdr.GlobalXDomainRequest = global.XDomainRequest;
  xdr.supportsXDR = typeof xdr.GlobalXDomainRequest != "undefined";
  xdr.workingXDR = xdr.supportsXDR ? xdr.GlobalXDomainRequest : false;
  function makeApi(sinon) {
    sinon.xdr = xdr;
    function FakeXDomainRequest() {
      this.readyState = FakeXDomainRequest.UNSENT;
      this.requestBody = null;
      this.requestHeaders = {};
      this.status = 0;
      this.timeout = null;
      if (typeof FakeXDomainRequest.onCreate == "function") {
        FakeXDomainRequest.onCreate(this);
      }
    }
    function verifyState(xdr) {
      if (xdr.readyState !== FakeXDomainRequest.OPENED) {
        throw new Error("INVALID_STATE_ERR");
      }
      if (xdr.sendFlag) {
        throw new Error("INVALID_STATE_ERR");
      }
    }
    function verifyRequestSent(xdr) {
      if (xdr.readyState == FakeXDomainRequest.UNSENT) {
        throw new Error("Request not sent");
      }
      if (xdr.readyState == FakeXDomainRequest.DONE) {
        throw new Error("Request done");
      }
    }
    function verifyResponseBodyType(body) {
      if (typeof body != "string") {
        var error = new Error("Attempted to respond to fake XDomainRequest with " + body + ", which is not a string.");
        error.name = "InvalidBodyException";
        throw error;
      }
    }
    sinon.extend(FakeXDomainRequest.prototype, sinon.EventTarget, {
      open: function open(method, url) {
        this.method = method;
        this.url = url;
        this.responseText = null;
        this.sendFlag = false;
        this.readyStateChange(FakeXDomainRequest.OPENED);
      },
      readyStateChange: function readyStateChange(state) {
        this.readyState = state;
        var eventName = "";
        switch (this.readyState) {
          case FakeXDomainRequest.UNSENT:
            break;
          case FakeXDomainRequest.OPENED:
            break;
          case FakeXDomainRequest.LOADING:
            if (this.sendFlag) {
              eventName = "onprogress";
            }
            break;
          case FakeXDomainRequest.DONE:
            if (this.isTimeout) {
              eventName = "ontimeout";
            } else if (this.errorFlag || (this.status < 200 || this.status > 299)) {
              eventName = "onerror";
            } else {
              eventName = "onload";
            }
            break;
        }
        if (eventName) {
          if (typeof this[eventName] == "function") {
            try {
              this[eventName]();
            } catch (e) {
              sinon.logError("Fake XHR " + eventName + " handler", e);
            }
          }
        }
      },
      send: function send(data) {
        verifyState(this);
        if (!/^(get|head)$/i.test(this.method)) {
          this.requestBody = data;
        }
        this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
        this.errorFlag = false;
        this.sendFlag = true;
        this.readyStateChange(FakeXDomainRequest.OPENED);
        if (typeof this.onSend == "function") {
          this.onSend(this);
        }
      },
      abort: function abort() {
        this.aborted = true;
        this.responseText = null;
        this.errorFlag = true;
        if (this.readyState > sinon.FakeXDomainRequest.UNSENT && this.sendFlag) {
          this.readyStateChange(sinon.FakeXDomainRequest.DONE);
          this.sendFlag = false;
        }
      },
      setResponseBody: function setResponseBody(body) {
        verifyRequestSent(this);
        verifyResponseBodyType(body);
        var chunkSize = this.chunkSize || 10;
        var index = 0;
        this.responseText = "";
        do {
          this.readyStateChange(FakeXDomainRequest.LOADING);
          this.responseText += body.substring(index, index + chunkSize);
          index += chunkSize;
        } while (index < body.length);
        this.readyStateChange(FakeXDomainRequest.DONE);
      },
      respond: function respond(status, contentType, body) {
        this.status = typeof status == "number" ? status : 200;
        this.setResponseBody(body || "");
      },
      simulatetimeout: function simulatetimeout() {
        this.status = 0;
        this.isTimeout = true;
        this.responseText = undefined;
        this.readyStateChange(FakeXDomainRequest.DONE);
      }
    });
    sinon.extend(FakeXDomainRequest, {
      UNSENT: 0,
      OPENED: 1,
      LOADING: 3,
      DONE: 4
    });
    sinon.useFakeXDomainRequest = function useFakeXDomainRequest() {
      sinon.FakeXDomainRequest.restore = function restore(keepOnCreate) {
        if (xdr.supportsXDR) {
          global.XDomainRequest = xdr.GlobalXDomainRequest;
        }
        delete sinon.FakeXDomainRequest.restore;
        if (keepOnCreate !== true) {
          delete sinon.FakeXDomainRequest.onCreate;
        }
      };
      if (xdr.supportsXDR) {
        global.XDomainRequest = sinon.FakeXDomainRequest;
      }
      return sinon.FakeXDomainRequest;
    };
    sinon.FakeXDomainRequest = FakeXDomainRequest;
  }
  var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
  var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
  function loadDependencies(require, exports, module) {
    var sinon = require("./core");
    require("../extend");
    require("./event");
    require("../log_error");
    makeApi(sinon);
    module.exports = sinon;
  }
  if (isAMD) {
    define(loadDependencies);
  } else if (isNode) {
    loadDependencies(require, module.exports, module);
  } else {
    makeApi(sinon);
  }
})(this);
