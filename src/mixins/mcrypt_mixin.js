import CryptoJS from "crypto-js";

/*
Usage

1. Include as a mixin in your component and declare
  `import Mcrypt from path`

  `mixins: [ Mcrypt ],`

2.Call function `decrypt` from the `Mcrypt` class passing the
  Declaration `Mcrypt.decrypt('ae71c0c78f8af50e38d6cfff31d28477');

  TBD : Make keys more private
        Encryption function
*/

class Mcrypt {
  constructor() {
    this.iv = CryptoJS.enc.Base64.parse("RjhDNEFCN0FBM0JDNTkxNA==");
    this.key = CryptoJS.enc.Utf8.parse("DAEB1667DCC64C84");
  }

  decrypt(ciphertext) {
    var encrypted_hex = this.hexToBase64(ciphertext);
    var plaintext = CryptoJS.AES.decrypt(encrypted_hex, this.key, {
      iv: this.iv,
      padding: CryptoJS.pad.ZeroPadding
    });
    console.log(CryptoJS.enc.Utf8.stringify(plaintext));
    return CryptoJS.enc.Utf8.stringify(plaintext);
  }

  hexToBase64(hexstring) {
    return btoa(
      hexstring
        .match(/\w{2}/g)
        .map(function(a) {
          return String.fromCharCode(parseInt(a, 16));
        })
        .join("")
    );
  }
}

export default new Mcrypt();
