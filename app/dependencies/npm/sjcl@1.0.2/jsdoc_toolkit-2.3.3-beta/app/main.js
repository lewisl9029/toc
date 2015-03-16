/* */ 
(function(process) {
  function main() {
    IO.include("lib/JSDOC.js");
    IO.includeDir("plugins/");
    if (JSDOC.opt.c) {
      eval("JSDOC.conf = " + IO.readFile(JSDOC.opt.c));
      LOG.inform("Using configuration file at '" + JSDOC.opt.c + "'.");
      for (var c in JSDOC.conf) {
        if (c !== "D" && !defined(JSDOC.opt[c])) {
          JSDOC.opt[c] = JSDOC.conf[c];
        }
      }
      if (typeof JSDOC.conf["_"] != "undefined") {
        JSDOC.opt["_"] = JSDOC.opt["_"].concat(JSDOC.conf["_"]);
      }
      LOG.inform("With configuration: ");
      for (var o in JSDOC.opt) {
        LOG.inform("    " + o + ": " + JSDOC.opt[o]);
      }
    }
    if (JSDOC.opt.v)
      LOG.verbose = true;
    if (JSDOC.opt.o)
      LOG.out = IO.open(JSDOC.opt.o);
    if (JSDOC.opt.T) {
      LOG.inform("JsDoc Toolkit running in test mode at " + new Date() + ".");
      IO.include("frame/Testrun.js");
      IO.include("test.js");
    } else {
      if (!JSDOC.opt.t && System.getProperty("jsdoc.template.dir")) {
        JSDOC.opt.t = System.getProperty("jsdoc.template.dir");
      }
      if (JSDOC.opt.t && SYS.slash != JSDOC.opt.t.slice(-1)) {
        JSDOC.opt.t += SYS.slash;
      }
      LOG.inform("JsDoc Toolkit main() running at " + new Date() + ".");
      LOG.inform("With options: ");
      for (var o in JSDOC.opt) {
        LOG.inform("    " + o + ": " + JSDOC.opt[o]);
      }
      JSDOC.JsDoc();
      if (JSDOC.opt.Z) {
        LOG.warn("So you want to see the data structure, eh? This might hang if you have circular refs...");
        IO.include("frame/Dumper.js");
        var symbols = JSDOC.JsDoc.symbolSet.toArray();
        for (var i = 0,
            l = symbols.length; i < l; i++) {
          var symbol = symbols[i];
          print("// symbol: " + symbol.alias);
          print(symbol.serialize());
        }
      } else {
        if (typeof JSDOC.opt.t != "undefined") {
          try {
            load(JSDOC.opt.t + "publish.js");
            if (!publish) {
              LOG.warn("No publish() function is defined in that template so nothing to do.");
            } else {
              publish(JSDOC.JsDoc.symbolSet);
            }
          } catch (e) {
            LOG.warn("Sorry, that doesn't seem to be a valid template: " + JSDOC.opt.t + "publish.js : " + e);
          }
        } else {
          LOG.warn("No template given. Might as well read the usage notes.");
          JSDOC.usage();
        }
      }
    }
    if (!JSDOC.opt.q && LOG.warnings.length) {
      print(LOG.warnings.length + " warning" + (LOG.warnings.length != 1 ? "s" : "") + ".");
    }
    if (LOG.out) {
      LOG.out.flush();
      LOG.out.close();
    }
  }
})(require("process"));
