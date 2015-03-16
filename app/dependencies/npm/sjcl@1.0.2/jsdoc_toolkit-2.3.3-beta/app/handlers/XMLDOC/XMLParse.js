/* */ 
(function(process) {
  LOG.inform("XMLDOC.Parser loaded");
  XMLDOC.Parser = {};
  XMLDOC.Parser.strictMode = true;
  XMLDOC.Parser.node = function(parent, name, type) {
    this.name = name;
    this.type = type || "ELEMENT";
    this.parent = parent;
    this.charData = "";
    this.attrs = {};
    this.nodes = [];
    this.cPtr = 0;
    XMLDOC.Parser.node.prototype.getAttributeNames = function() {
      var a = [];
      for (var o in this.attrs) {
        a.push(o);
      }
      return a;
    };
    XMLDOC.Parser.node.prototype.getAttribute = function(attr) {
      return this.attrs[attr];
    };
    XMLDOC.Parser.node.prototype.setAttribute = function(attr, val) {
      this.attrs[attr] = val;
    };
    XMLDOC.Parser.node.prototype.getChild = function(idx) {
      return this.nodes[idx];
    };
    XMLDOC.Parser.node.prototype.parentNode = function() {
      return this.parent;
    };
    XMLDOC.Parser.node.prototype.firstChild = function() {
      return this.nodes[0];
    };
    XMLDOC.Parser.node.prototype.lastChild = function() {
      return this.nodes[this.nodes.length - 1];
    };
    XMLDOC.Parser.node.prototype.nextSibling = function() {
      var p = this.parent;
      if (p && (p.nodes.indexOf(this) + 1 != p.nodes.length)) {
        return p.getChild(p.nodes.indexOf(this) + 1);
      }
      return null;
    };
    XMLDOC.Parser.node.prototype.prevSibling = function() {
      var p = this.parent;
      if (p && (p.nodes.indexOf(this) - 1 >= 0)) {
        return p.getChild(p.nodes.indexOf(this) - 1);
      }
      return null;
    };
  };
  XMLDOC.Parser.parse = function(src) {
    var A = [];
    A = src.split("\r\n");
    src = A.join("\n");
    A = src.split("\r");
    src = A.join("\n");
    src.replace(/<\?XML .*\?>/i, "");
    src.replace(/<!DOCTYPE .*\>/i, "");
    var doc = new XMLDOC.Parser.node(null, "ROOT", "DOCUMENT");
    XMLDOC.Parser.eat(doc, src);
    return doc;
  };
  XMLDOC.Parser.eat = function(parentNode, src) {
    var reTag = new RegExp("<(!|)(\\?|--|)((.|\\s)*?)\\2>", "g");
    var reCommentTag = /<!--((.|\s)*?)-->/;
    var rePITag = /<\?((.|\s)*?)\?>/;
    var reStartTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*)\4)*(\/)?>/;
    var reHTMLEmptyTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*)\4)*>/;
    var reEnclosingTag = /<(.*?)( +([\w_\-]*)=(\"|')(.*?)\4)*>((.|\s)*?)<\/\1>/;
    var reAttributes = new RegExp(" +([\\w_\\-]*)=(\"|')(.*?)\\2", "g");
    var tag;
    while ((tag = reTag.exec(src)) != null) {
      if (tag.index > 0) {
        var text = src.substring(0, tag.index).replace(/^[ \t\n]+((.|\n)*?)[ \t\n]+$/, "$1");
        if (text.length > 0 && (text != "\n")) {
          var txtnode = new XMLDOC.Parser.node(parentNode, "", "TEXT");
          txtnode.charData = text;
          parentNode.nodes.push(txtnode);
        }
        reTag.lastIndex -= src.substring(0, tag.index).length;
        src = src.substring(tag.index);
      }
      if (reCommentTag.test(tag[0])) {
        var comment = new XMLDOC.Parser.node(parentNode, "", "COMMENT");
        comment.charData = reCommentTag.exec(tag[0])[1];
        parentNode.nodes.push(comment);
        reTag.lastIndex -= tag[0].length;
        src = src.replace(reCommentTag, "");
      } else if (rePITag.test(tag[0])) {
        var pi = new XMLDOC.Parser.node(parentNode, "", "PI");
        pi.charData = rePITag.exec(tag[0])[1];
        parentNode.nodes.push(pi);
        reTag.lastIndex -= tag[0].length;
        src = src.replace(rePITag, "");
      } else if (reStartTag.test(tag[0])) {
        var e = reStartTag.exec(tag[0]);
        var elem = new XMLDOC.Parser.node(parentNode, e[1], "ELEMENT");
        var a;
        while ((a = reAttributes.exec(e[2])) != null) {
          elem.attrs[a[1]] = a[3];
        }
        if (e[6] == "/") {
          parentNode.nodes.push(elem);
          reTag.lastIndex -= e[0].length;
          src = src.replace(reStartTag, "");
        } else {
          var htmlParsed = false;
          var htmlStartTag = reHTMLEmptyTag.exec(src);
          var reHTMLEndTag = new RegExp("</" + htmlStartTag[1] + ">");
          var htmlEndTag = reHTMLEndTag.exec(src);
          if (XMLDOC.Parser.strictMode && htmlEndTag == null) {
            var err = new Error("Malformed XML passed to XMLDOC.Parser... Error contains malformed 'src'");
            err.src = src;
            throw err;
          } else if (htmlEndTag == null) {
            parentNode.nodes.push(elem);
            src = src.replace(reHTMLEmptyTag, "");
            htmlParsed = true;
          }
          if (!htmlParsed) {
            var enc = reEnclosingTag.exec(src);
            XMLDOC.Parser.eat(elem, enc[6]);
            parentNode.nodes.push(elem);
            src = src.replace(reEnclosingTag, "");
          }
        }
        reTag.lastIndex = 0;
      }
    }
    src = src.replace(/^[ \t\n]+((.|\n)*?)[ \t\n]+$/, "$1");
    if (src.length > 0 && (src != "\n")) {
      var txtNode = new XMLDOC.Parser.node(parentNode, "", "TEXT");
      txtNode.charData = src;
      parentNode.nodes.push(txtNode);
    }
  };
})(require("process"));
