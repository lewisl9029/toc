/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.JSXElement = JSXElement;
var metadata = {
  optional: true
};

exports.metadata = metadata;
var immutabilityVisitor = {
  enter: function enter(node, parent, scope, state) {
    var _this = this;

    var stop = function stop() {
      state.isImmutable = false;
      _this.stop();
    };

    if (this.isJSXClosingElement()) {
      this.skip();
      return;
    }

    if (this.isJSXIdentifier({ name: "ref" }) && this.parentPath.isJSXAttribute({ name: node })) {
      return stop();
    }

    if (this.isJSXIdentifier() || this.isIdentifier() || this.isJSXMemberExpression()) {
      return;
    }

    if (!this.isImmutable()) stop();
  }
};

function JSXElement(node, parent, scope, file) {
  if (node._hoisted) return;

  var state = { isImmutable: true };
  this.traverse(immutabilityVisitor, state);

  if (state.isImmutable) {
    this.hoist();
  } else {
    node._hoisted = true;
  }
}