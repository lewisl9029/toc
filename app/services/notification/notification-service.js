export default function notification($q, $log, angularToastr) {
  let createToastrAsync = function createToastrPromise(toastrFunction) {
    return (message, title) => {
      $log.debug(title);
      $log.debug(message.message || message);
      return $q.when(toastrFunction(message.message || message, title));
    };
  };

  return {
    error: createToastrAsync(angularToastr.error),
    success: createToastrAsync(angularToastr.success),
    info: createToastrAsync(angularToastr.info),
    warning: createToastrAsync(angularToastr.warning),
  };
}
