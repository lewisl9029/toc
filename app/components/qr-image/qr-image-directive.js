import template from './qr-image.html!text';

export default function tocQrImage(qrEncode) {
  return {
    restrict: 'E',
    template: template,
    link: function linkQrImage(scope, element, attrs) {
      //TODO: persist qr code dataURI
      let data = attrs.data;
      let dataURI = qrEncode(data, {type: 7, size: 9, level: 'H'});
      let qrImage = new Image();
      qrImage.src = dataURI;
      element[0].appendChild(qrImage);
    }
  };
}
