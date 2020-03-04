import { mapGetters } from 'vuex';

const NpsMxn = {
  data() {
    return {
      nps_status: false,
    };
  },
  computed: {
    ...mapGetters({
      getNPSStatus: 'getNPSStatus',
    }),
  },
  watch: {
    getNPSStatus(status) {
      this.nps_status = status;
      console.log('this.nps_status', this.nps_status);
    },
  },
  methods: {
    dismiss() {
      console.log('cancelled');
      this.nps_status = true;
    },
  },

};
export default NpsMxn;
