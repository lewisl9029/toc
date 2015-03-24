export default function notification($q, angularToastr) {
  let createToastrAsync = function createToastrPromise(toastrFunction) {
    return (message, title) =>
      $q.when(toastrFunction(message.message || message, title));
  };

  return {
    error: createToastrAsync(angularToastr.error),
    success: createToastrAsync(angularToastr.success),
    info: createToastrAsync(angularToastr.info),
    warning: createToastrAsync(angularToastr.warning),
  };
}
