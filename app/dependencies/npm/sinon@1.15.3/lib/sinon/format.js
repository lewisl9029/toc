/* */ 
"format cjs";
"use strict";
(function(sinon, formatio) {
  function makeApi(sinon) {
    function valueFormatter(value) {
      return "" + value;
    }
    function getFormatioFormatter() {
      var formatter = formatio.configure({
        quoteStrings: false,
        limitChildrenCount: 250
      });
      function format() {
        return formatter.ascii.apply(formatter, arguments);
      }
      ;
      return format;
    }
    function getNodeFormatter(value) {
      function format(value) {
        return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
      }
      ;
      try {
        var util = require("util");
      } catch (e) {}
      return util ? format : valueFormatter;
    }
    var isNode = typeof module !== "undefined" && module.exports && typeof require == "function",
        formatter;
    if (isNode) {
      try {
        formatio = require("formatio");
      } catch (e) {}
    }
    if (formatio) {
      formatter = getFormatioFormatter();
    } else if (isNode) {
      formatter = getNodeFormatter();
    } else {
      formatter = valueFormatter;
    }
    sinon.format = formatter;
    return sinon.format;
  }
  function loadDependencies(require, exports, module) {
    var sinon = require("./util/core");
    module.exports = makeApi(sinon);
  }
  var isNode = typeof module !== "undefined" && module.exports && typeof require == "function";
  var isAMD = typeof define === "function" && typeof define.amd === "object" && define.amd;
  if (isAMD) {
    define(loadDependencies);
  } else if (isNode) {
    loadDependencies(require, module.exports, module);
  } else if (!sinon) {
    return;
  } else {
    makeApi(sinon);
  }
}((typeof sinon == "object" && sinon || null), (typeof formatio == "object" && formatio)));
