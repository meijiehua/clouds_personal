// var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// var HEX_TO_BINARY_MAP = {
//     '0': '0000',
//     '1': '0001',
//     '2': '0010',
//     '3': '0011',
//     '4': '0100',
//     '5': '0101',
//     '6': '0110',
//     '7': '0111',
//     '8': '1000',
//     '9': '1001',
//     'a': '1010',
//     'b': '1011',
//     'c': '1100',
//     'd': '1101',
//     'e': '1110',
//     'f': '1111'
// }

// function base64encode(str){
//     var out, i, len;
//     var c1, c2, c3;
//     len = str.length;
//     i = 0;
//     out = "";
//     while (i < len) {
//         c1 = str.charCodeAt(i++) & 0xff;
//         if (i == len) {
//             out += base64EncodeChars.charAt(c1 >> 2);
//             out += base64EncodeChars.charAt((c1 & 0x3) << 4);
//             out += "==";
//             break;
//         }
//         c2 = str.charCodeAt(i++);
//         if (i == len) {
//             out += base64EncodeChars.charAt(c1 >> 2);
//             out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
//             out += base64EncodeChars.charAt((c2 & 0xF) << 2);
//             out += "=";
//             break;
//         }
//         c3 = str.charCodeAt(i++);
//         out += base64EncodeChars.charAt(c1 >> 2);
//         out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
//         out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
//         out += base64EncodeChars.charAt(c3 & 0x3F);
//     }
//     return out;
// }

// function md5HexToBinary(hex) {
//     var md5String = '';
//     for (var i = 0; i < 16; i++) {
//         var twoChar = hex.substr(i*2, 2);
//         console.log(twoChar);
//         var unicode = parseInt(twoChar, 16);
//         unicode = unicode.toString(2).substr(1);
//         unicode = parseInt(unicode, 2);
//         console.log(unicode);
//         md5String += String.fromCharCode(unicode);
//         console.log(md5String);
//     }
//     return md5String;
// }



if (!window.atob) {
  var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var table = tableStr.split("");

  window.atob = function (base64) {
    if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
    base64 = base64.replace(/=/g, "");
    var n = base64.length & 3;
    if (n === 1) throw new Error("String contains an invalid character");
    for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
      var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
      var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
      if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
      bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
      bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
      bin[bin.length] = ((c << 6) | d) & 255;
    };
    return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
  };

  window.btoa = function (bin) {
    for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
      var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
      if ((a | b | c) > 255) throw new Error("String contains an invalid character");
      base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                              (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                              (isNaN(b + c) ? "=" : table[c & 63]);
    }
    return base64.join("");
  };

}

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}
