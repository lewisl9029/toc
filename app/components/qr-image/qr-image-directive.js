export default function tocQrImage(qrEncode, notification) {
  return {
    restrict: 'E',
    link: function linkQrImage(scope, element, attrs) {
      //TODO: persist qr code dataURI
      try {
        let data = attrs.data;
        let dataURI = qrEncode(data, {type: 7, size: 9, level: 'H'});
        let qrImage = new Image();
        qrImage.src = dataURI;
        element[0].appendChild(qrImage);
      } catch (error) {
        notification.error(error, 'ID QRCode Encoding Error');
      }
    }
  };
}
