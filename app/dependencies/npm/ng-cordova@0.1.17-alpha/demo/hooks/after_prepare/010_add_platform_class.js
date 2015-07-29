/* */ 
(function(process) {
  var fs = require("fs");
  var path = require("path");
  var rootdir = process.argv[2];
  function addPlatformBodyTag(indexPath, platform) {
    try {
      var platformClass = 'platform-' + platform;
      var cordovaClass = 'platform-cordova platform-webview';
      var html = fs.readFileSync(indexPath, 'utf8');
      var bodyTag = findBodyTag(html);
      if (!bodyTag)
        return;
      if (bodyTag.indexOf(platformClass) > -1)
        return;
      var newBodyTag = bodyTag;
      var classAttr = findClassAttr(bodyTag);
      if (classAttr) {
        var endingQuote = classAttr.substring(classAttr.length - 1);
        var newClassAttr = classAttr.substring(0, classAttr.length - 1);
        newClassAttr += ' ' + platformClass + ' ' + cordovaClass + endingQuote;
        newBodyTag = bodyTag.replace(classAttr, newClassAttr);
      } else {
        newBodyTag = bodyTag.replace('>', ' class="' + platformClass + ' ' + cordovaClass + '">');
      }
      html = html.replace(bodyTag, newBodyTag);
      fs.writeFileSync(indexPath, html, 'utf8');
      process.stdout.write('add to body class: ' + platformClass + '\n');
    } catch (e) {
      process.stdout.write(e);
    }
  }
  function findBodyTag(html) {
    try {
      return html.match(/<body(?=[\s>])(.*?)>/gi)[0];
    } catch (e) {}
  }
  function findClassAttr(bodyTag) {
    try {
      return bodyTag.match(/ class=["|'](.*?)["|']/gi)[0];
    } catch (e) {}
  }
  if (rootdir) {
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
    for (var x = 0; x < platforms.length; x++) {
      try {
        var platform = platforms[x].trim().toLowerCase();
        var indexPath;
        if (platform == 'android') {
          indexPath = path.join('platforms', platform, 'assets', 'www', 'index.html');
        } else {
          indexPath = path.join('platforms', platform, 'www', 'index.html');
        }
        if (fs.existsSync(indexPath)) {
          addPlatformBodyTag(indexPath, platform);
        }
      } catch (e) {
        process.stdout.write(e);
      }
    }
  }
})(require("process"));
