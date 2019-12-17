/* eslint class-methods-use-this: ["error", { "exceptMethods": ["hexToBase64","base64ToHex"] }] */
/* eslint-env es6 */
/* eslint no-undef: "error" */
import CryptoJS from 'crypto-js';

/*
Usage

1. Include as a mixin in your component and declare
  `import Mcrypt from path`

  `mixins: [ Mcrypt ],`

2. Decryption
  Call function `decrypt` from the `Mcrypt` class passing the encrypted string as a variable
  Declaration `Mcrypt.decrypt('ae71c0c78f8af50e38d6cfff31d28477');

3. Encryption
  Call function `encrypt` from the `Mcrypt` class passing the plaintext string as a vairable
  Declaration `Mcrypt.encrypt('This is text');

  TBD : Make keys more private
*/

class Mcrypt {
  constructor() {
    this.iv = CryptoJS.enc.Base64.parse('RjhDNEFCN0FBM0JDNTkxNA==');
    this.key = CryptoJS.enc.Utf8.parse('DAEB1667DCC64C84');
  }

  decrypt(ciphertext) {
    const encryptedHex = this.hexToBase64(ciphertext);
    const plaintext = CryptoJS.AES.decrypt(encryptedHex, this.key, {
      iv: this.iv,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return CryptoJS.enc.Utf8.stringify(plaintext);
  }

  hexToBase64(hexstring) {
    return btoa(
      hexstring
        .match(/\w{2}/g)
        .map(a => String.fromCharCode(parseInt(a, 16)))
        .join(''),
    );
  }

  base64ToHex(str) {
    const bin = atob(str.replace(/[ \r\n]+$/, ''));
    const hex = [];
    for (let i = 0; i < bin.length; i += 1) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = `0${tmp}`;
      hex[hex.length] = tmp;
    }
    return hex.join('');
  }

  encrypt(plaintext) {
    const text = JSON.stringify(plaintext);
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv: this.iv,
      padding: CryptoJS.pad.ZeroPadding,
    });

    return this.base64ToHex(encrypted.toString());
  }
}

export default new Mcrypt();
