<template lang="html">
  <div class="ongoing--outer" v-if="!this.loading">
    <div class="ongoing--count" @click="toggle_ongoing()">
      You have <span>{{num_ongoing}}</span> ongoing orders
    </div>
    <transition name="fade">
      <div class="ongoing--column" v-if="show">
        <template v-for="(order, index) in this.get_orders">
          <div class="ongoing--card" @click="track(order.order_no)">
            <div class="ongoing--card-location">
              <div class="ongoing--card-padded">
                From : <span>{{order.from_name}}</span>
              </div>
              <div class="">
                To : <span>{{order.to_name}}</span>
              </div>
            </div>
            <div class="ongoing--card-status">
              <div class="">
                {{getStatus(order)}}
              </div>
              <div class="">

                {{moment(order.date_time).format('MMMM Do, hh:mm:ss')}}
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex'

export default {
  name: 'ongoing-component',
  data: function() {
    return {
      loading: true
    }
  },
  methods: {
    ...mapMutations({
      toggle : '$_orders/toggle_ongoing'
    }),
    toggle_ongoing: function() {
      this.toggle()
    },
    track: function(order) {
      this.$router.push({ path: `/orders/tracking/${order}` })
    },
    getStatus: function(order) {
      if (this.loading == false) {
        switch(order.delivery_status) {
            case 3:
            {
              return 'Delivered'
              break;
            }
            case 2:
            {
              return 'In Transit'
              break;
            }
            default:
            {
              switch (order.confirm_status) {
                case 1:
                {
                  return 'Confirmed'
                  break;
                }
                default:
                {
                  return 'Pending'
                  break;
                }
              }
            }
        }
      }
      else {
        return "";
      }
    },
  },
  computed : {
    ...mapGetters({
      get_orders: '$_orders/get_ongoing_orders',
      show : '$_orders/show_ongoing'
    }),
    num_ongoing: function () {
      return this.get_orders.length
    },
  },
  mounted() {
    this.loading = true
    var that = this
    this.$store.dispatch('$_orders/fetch_ongoing_orders')
    .then(response => {
      that.loading = false
    })
  }
}
</script>

<style lang="css">
.ongoing--outer
{
  position: absolute;
  margin-top: 10px;
  right: 10px;
  min-width: 250px;
  max-height: 55%;
  overflow-x: scroll;
}
.ongoing--count
{
  background-color: rgba(255,255,255,0.5);
  color: #1782c5;
  padding: 5px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #1782c5;
}
.ongoing--card
{
  font-size: 13px;
  margin-top: 15px;
  border: 1px solid #1782c5;
}
.ongoing--card-location
{
  padding: 10px;
  background-color: #fff;
}
.ongoing--card-status
{
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #1782c5;
  color: #fff;
}
.ongoing--card-padded
{
  padding-bottom: 5px;
}
</style>
