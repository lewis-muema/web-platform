export const cookie_mixin = {
  methods: {
    setCookie: function(value) {
      console.log("setting cookie", value);
      return new Promise((resolve, reject) => {
        let json_string_value = JSON.stringify(value);
        let expires = "";
        let days = 4;
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();

        document.cookie =
          "_sessionSnack" +
          "=" +
          (json_string_value || "") +
          expires +
          "; path=/";

        //do a while to check if the cookie has been set
        //resolve when set
        this.getCookie();
        console.log("session_cookie", this.session_cookie);

        while (this.session_cookie == null) {
          console.log("cookie is still", this.session_cookie);
          setTimeout(this.getCookie, 1000);
        }
        resolve(true);
      });
    },
    getCookie: function() {
      var nameEQ = "_sessionSnack" + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
        }
        this.session_cookie = c.substring(nameEQ.length, c.length);
        return c.substring(nameEQ.length, c.length);
      }
      this.session_cookie = null;
      return null;
    }
  }
}
