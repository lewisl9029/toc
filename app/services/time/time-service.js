export let serviceName = 'time';
export default /*@ngInject*/ function time(
  moment
) {
  return {
    moment
  };
}
