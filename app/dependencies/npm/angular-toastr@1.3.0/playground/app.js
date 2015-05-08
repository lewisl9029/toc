/* */ 
"format cjs";
angular.module('app', ['toastr', 'ngAnimate'])

  .config(function(toastrConfig) {
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.timeOut = 3500;
    toastrConfig.maxOpened = 1;
    toastrConfig.autoDismiss = true;
    toastrConfig.extendedTimeOut = 0;
    //toastrConfig.preventDuplicates = true;
    toastrConfig.prepend = true;
    //toastrConfig.templates.toast = 'foo';
    toastrConfig.progressBar = true;
    //toastrConfig.newestOnTop = false;
    //toastrConfig.target = '#herae';
  })

  .run(function($templateCache) {
    $templateCache.put('foo', '<div>Foo</div>');
  })

  .controller('MainCtrl', function($scope, $timeout, $interval, toastr) {
    var toast;

    $scope.fn = function() {
      console.log('Works!');
    };

    var x = 1;
    //$interval(function() {
    //  toastr.info('success', 'Toastr ' + x);
    //  x++;
    //}, 10, 20);

    $scope.open = function() {
      var toast = toastr.info('I am gonna bloow ' + x++, null, {
        onShown: function () {
          console.log(toast.isOpened);
        },
        onHidden: function () {
          console.log(toast.isOpened);
        }
      });

      setTimeout(function() {
        console.log('Opened: ', toast.isOpened);
      }, 10000);
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
