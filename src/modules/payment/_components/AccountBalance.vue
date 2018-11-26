<template lang="html">
  <div class="">
    <div class="paytitle">
      Top up your sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon">
        <!-- <font-awesome-icon icon="wallet" /> -->
      </div>
      <div class="payinfo--balance">
        Balance <span class="payinfo--balance-el">{{running_balance}}</span>Kes
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "account-balance",
  mounted() {
    this.requestRB();
  },
  methods: {
    ...mapActions(["$_payment/requestRunningBalance"]),
    requestRB() {
      //this will request from the api and update the store
      let session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default == "biz") {
        cop_id = session.biz.cop_id;
      }
      let running_balance_payload = {
        values: {
          cop_id: cop_id,
          user_phone: session[session.default]["user_phone"]
        }
      };

      let payload = {
        values: running_balance_payload,
        vm: this,
        app: "PRIVATE_API",
        endpoint: "running_balance"
      };

      this.$store.dispatch("$_payment/requestRunningBalance", payload).then(
        response => {
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status == 200) {
            console.log("commit running balance to the global store");
          }
          console.log(response);
          //commit  to the global store here
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  computed: {
    //this just gets what is on the store
    running_balance() {
      //format the amount
      let value = this.$store.getters.getRunningBalance;
      if (value !== null || value !== "") {
        let val = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        val = val.split(".");
        return val[0];
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="css">
.payinfo {
  display: flex;
}
.paytitle {
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 16px;
}
.payinfo {
  display: flex;
  justify-content: space-between;
  flex: 1;
  color: rgb(85, 85, 85);
  font-size: 14px;
}
.payinfo--icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.payinfo--icon img {
  width: 25px;
}
.payinfo--balance {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
}
.payinfo--balance-el {
  padding: 0px 5px;
}
</style>
