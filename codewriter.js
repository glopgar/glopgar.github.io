var writeCode = (function() {

  /**
   * Obtiene el byte correspondiente a 4 pixeles
   * @param pixels array
   * @returns string
   */
  function getPixelsByte(pixels) {
    var high = 0; // nibble alto
    var low = 0;  // nibble bajo
    var pixel;
    for (var i = 0; i < pixels.length; i++) { // para cada pixel de los 4
      pixel = '' + pixels[i];
      if (pixel[0] === '1') {   // si el primer bit del color es 1, lo sumo al nibble alto.
        high += 1 << ( 3 - i ); // tambien hay que desplazar el bit hacia la izquierda en funcion de la pos del pixel
      }
      if (pixel[1] === '1') {   // si el primer bit del codigo de color es 1, lo sumo al nibble bajo
        low += 1 << ( 3 - i );  // tambien hay que desplazar el bit hacia la izquierda en funcion de la pos del pixel
      }
    }
    return (low.toString(16) + high.toString(16)).toUpperCase();  // conversion a HEX cambiando de orden los nibbles
  }

  function getAddress(x, y) {
    console.log(x, y);
    var baseAddress = parseInt('C000', 16);
    var rowOffset = parseInt('50', 16);
    var lineOffset = parseInt('800', 16);
    baseAddress += x;
    var row = Math.floor( y / 8 );
    var line = y % 8;
    baseAddress += ( row * rowOffset );
    baseAddress += ( line * lineOffset );
    var hex = baseAddress.toString(16).toUpperCase();
    console.log(row, line);
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