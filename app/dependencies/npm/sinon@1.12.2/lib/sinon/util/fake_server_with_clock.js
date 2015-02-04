/* */ 
"format cjs";
"use strict";
(function() {
  function makeApi(sinon) {
    function Server() {}
    Server.prototype = sinon.fakeServer;
    sinon.fakeServerWithClock = new Server();
    sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
      if (xhr.async) {
        if (typeof setTimeout.clock == "object") {
          this.clock = setTimeout.clock;
        } else {
          this.clock = sinon.useFakeTimers();
          this.resetClock = true;
        }
        if (!this.longestTimeout) {
          var clockSetTimeout = this.clock.setTimeout;
          var clockSetInterval = this.clock.setInterval;
          var server = this;
          this.clock.setTimeout = function(fn, timeout) {
            server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);
            return clockSetTimeout.apply(this, arguments);
          };
          this.clock.setInterval = function(fn, timeout) {
            server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);
            return clockSetInterval.apply(this, arguments);
          };
        }
      }
      return sinon.fakeServer.addRequest.call(this, xhr);
    };
    sinon.fakeServerWithClock.respond = function respond() {
      var returnVal = sinon.fakeServer.respond.apply(this, arguments);
      if (this.clock) {
        this.clock.tick(this.longestTimeout || 0);
        this.longestTimeout = 0;
        if (this.resetClock) {
          this.clock.restore();
          this.resetClock = false;
        }
      }
      return returnVal;
    };
    sinon.fakeServerWithClock.restore = function restore() {
      if (this.clock) {
        this.clock.restore();
      }
      return sinon.fakeServer.restore.apply(this, arguments);
    };
  }
  var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
  var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
  function loadDependencies(require) {
    var sinon = require("./core");
    require("./fake_server");
    require("./fake_timers");
    makeApi(sinon);
  }
  if (isAMD) {
    define(loadDependencies);
  } else if (isNode) {
    loadDependencies(require);
  } else {
    makeApi(sinon);
  }
}());
