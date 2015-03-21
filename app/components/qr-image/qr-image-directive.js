import template from './qr-image.html!text';

export default function tocQrImage(qrEncode) {
  return {
    restrict: 'E',
    template: template,
    link: function linkQrImage(scope, element) {
      let qrImage = new Image();
      let dataURI = qrEncode('test', {type: 5, size: 8, level: 'H'});
      qrImage.src = dataURI;
      element[0].appendChild(qrImage);
    }
  };
}
