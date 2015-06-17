/* */ 
"format cjs";
"use strict";

exports.__esModule = true;
exports.File = File;
exports.Program = Program;
exports.BlockStatement = BlockStatement;
exports.Noop = Noop;

function File(node, print) {
  print.plain(node.program);
}

function Program(node, print) {
  print.sequence(node.body);
}

function BlockStatement(node, print) {
  if (node.body.length === 0) {
    this.push("{}");
  } else {
    this.push("{");
    this.newline();
    print.sequence(node.body, { indent: true });
    if (!this.format.retainLines) this.removeLast("\n");
    this.rightBrace();
  }
}

function Noop() {}