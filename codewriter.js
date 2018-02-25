var writeCode = (function() {

  function getPixelsByte(pixels) {
    var high = 0;
    var low = 0;
    var pixel;
    var tempbyte;
    for (var i = 0; i < pixels.length; i++) {
      pixel = '' + pixels[i];
      if (pixel[0] === '1') {
        tempbyte = 1 << ( 3 - i );
        high += tempbyte;
      }
      if (pixel[1] === '1') {
        tempbyte = 1 << ( 3 - i );
        low += tempbyte;
      }
    }
    return (high.toString(16) + low.toString(16)).toUpperCase();
  }

  function getAddress(x, y) {
    var baseAddress = parseInt('C000', 16);
    var rowOffset = parseInt('50', 16);
    var lineOffset = parseInt('800', 16);
    baseAddress += x;
    var row = Math.floor( y / 8 );
    var line = y % 8;
    baseAddress += ( row * rowOffset );
    baseAddress += ( line * lineOffset );
    var hex = baseAddress.toString(16).toUpperCase();
    return hex[2] + hex[3] + ' ' + hex[0] + hex[1];
  }

  return function writeCode(ox, oy, cols, rows, sprite) {
    var lastByte = null;
    var byte;
    var code = '';
    for (var y = 0; y < rows; y++) {
      var bx = Math.floor(ox / 4);
      for (var x = 0; x < cols; x += 4) {
        byte = getPixelsByte(sprite[y].slice(x, x + 4));
        if (byte !== lastByte) {
          code += '3E ' + byte + ' ';
        }
        code += '32 ' + getAddress(bx, y + oy) + ' ';
        lastByte = byte;
        bx++;
      }
    }
    code += '18 FE';
    return code;
  }

})();