export let directiveName = 'tocQrImage';
export default /*@ngInject*/ function tocQrImage(
  qrImage,
  state,
  $compile
) {
  return {
    restrict: 'E',
    link: function linkQrImage(scope, element, attrs) {
      //TODO: persist qr code dataURI
      let data = attrs.data;
      let svgString = qrImage.imageSync(data, {type: 'svg', ec_level: 'M'});
      let qrImageElement = $compile(svgString)(scope)[0];
      element[0].appendChild(qrImageElement);
    }
  };
}
