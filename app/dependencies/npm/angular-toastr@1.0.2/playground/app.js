/* */ 
"format cjs";
angular.module('app', ['toastr', 'ngAnimate'])

  .config(function(toastrConfig) {
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.timeOut = 3000;
    toastrConfig.maxOpened = 1;
    //toastrConfig.extendedTimeOut = 0;
    toastrConfig.prepend = true;
    //toastrConfig.newestOnTop = false;
    //toastrConfig.target = '#herae';
  })

  .run(['$templateCache', function($templateCache) {
    $templateCache.put('templates/toastr/toastr.html',
      "<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n" +
      "  <div ng-switch on=\"allowHtml\">\n" +
      "    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\">{{title}}</div>\n" +
      "    <div ng-switch-default class=\"{{messageClass}}\">{{message}}</div>\n" +
      "    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n" +
      "    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n" +
      "  </div>\n" +
      "</div>"
    );
  }])

  .controller('MainCtrl', function($scope, $timeout, $interval, toastr) {
    var toast;

    $scope.fn = function() {
      console.log('Works!');
    };

    var x = 1;
    //$interval(function() {
    //  toastr.info('success', 'Toastr ' + x);
    //  x++;
    //}, 100, 20);

    $scope.open = function() {
      toastr.info('I am gonna bloow', {
        onShown: function() {
          console.log('onShown');
        },
        onHidden: function() {
          console.log('onHidden');
        }
      });
    };

    //toastr.info('What a nice apple button', '<i>Button</i> spree', {
    //  //allowHtml: true,
    //  //closeButton: true,
    //  //tapToDismiss: false,
    //  //timeOut: 0,
    //  closeHtml: '<button></button>',
    //  onHidden: function(clicked) {
    //    if (clicked) console.log('Apple hidden');
    //  }
    //});
    //$timeout(function() { // Simulate delay
    //  toast = toastr.error('<i>I am another toastr</i>', 'No style', {
    //    timeOut: 0,
    //    extendedTimeOut: 0,
    //    allowHtml: true
    //  }); // No title
    //}, 1000);
    //$timeout(function() { // Simulate delay
    //  toastr.warning('Warning warning, intruder alert, intruder alert', null, {
    //    timeOut: 0,
    //    closeButton: true,
    //    closeHtml: '<span>1</span>'
    //  });
    //}, 2000);
    //$timeout(function() { // Simulate delay
    //  toastr.info('We are closed today', 'Notice');
    //}, 3000);
    //$timeout(function() {
    //  toastr.success('Pinky pinky', 'title', {
    //    iconClass: 'toast-pink',
    //
    //    onShown: function() {
    //      console.log('Pinky shown')
    //    },
    //    onHidden: function() {
    //      console.log('Pinky hidden');
    //    }
    //  });
    //}, 4000);
    //$timeout(function() {
    //  toastr.clear(toast);
    //}, 5000);
    //$timeout(function() {
    //  toastr.success('New container');
    //}, 10000);
  });
