/* */ 
var config = require("./config");
var NOOP = function() {};
module.exports = function(_chai, util) {
  var AssertionError = _chai.AssertionError,
      flag = util.flag;
  _chai.Assertion = Assertion;
  function Assertion(obj, msg, stack) {
    flag(this, 'ssfi', stack || arguments.callee);
    flag(this, 'object', obj);
    flag(this, 'message', msg);
  }
  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });
  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });
  Assertion.addProperty = function(name, fn) {
    util.addProperty(this.prototype, name, fn);
  };
  Assertion.addMethod = function(name, fn) {
    util.addMethod(this.prototype, name, fn);
  };
  Assertion.addChainableMethod = function(name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };
  Assertion.addChainableNoop = function(name, fn) {
    util.addChainableMethod(this.prototype, name, NOOP, fn);
  };
  Assertion.overwriteProperty = function(name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };
  Assertion.overwriteMethod = function(name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };
  Assertion.overwriteChainableMethod = function(name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };
  Assertion.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (true !== showDiff)
      showDiff = false;
    if (true !== config.showDiff)
      showDiff = false;
    if (!ok) {
      var msg = util.getMessage(this, arguments),
          actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
        actual: actual,
        expected: expected,
        showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };
  Object.defineProperty(Assertion.prototype, '_obj', {
    get: function() {
      return flag(this, 'object');
    },
    set: function(val) {
      flag(this, 'object', val);
    }
  });
};
