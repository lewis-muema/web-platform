var SessionMxn = {
  methods: {
    setSession(value) {
      localStorage.setItem("_sessionSnack", value);
    },
    getSession() {
      return localStorage.getItem("_sessionSnack");
    },
    deleteSession() {
      localStorage.removeItem("_sessionSnack");
    }
  }
};
export default SessionMxn;
