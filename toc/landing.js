'use strict';

(function initialize(window) {
  var smoothScrollSupported =
    window.document.documentElement.style.scrollBehavior;

  if (!smoothScrollSupported) {
    //polyfill here
    var scrollLinks =
      window.document.getElementsByClassName('toc-anchor-scroll-link');

    var viewport = window.document.getElementsByClassName('toc-body')[0];

    window.Array.prototype.forEach.call(scrollLinks, function (scrollLink) {
      var scrollTargetId = scrollLink.getAttribute('href').substr(1);
      var scrollTarget = window.document.getElementById(scrollTargetId);

      scrollLink.addEventListener('click', function (event) {
        event.preventDefault();
        var scrollPosition = scrollTarget.getBoundingClientRect().top +
          document.body.scrollTop;
        window.naturalScroll.scrollTop(viewport, scrollPosition);
      });
    });
  }
})(window);
