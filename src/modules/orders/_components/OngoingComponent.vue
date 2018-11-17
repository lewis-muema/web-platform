<template lang="html">
  <div class="ongoing--outer" v-if="!this.loading">
    <div class="ongoing--count" @click="toggle_ongoing()">
      <span>{{num_ongoing}} ongoing orders</span>
      <font-awesome-icon icon="caret-up" :class="classObject" width="15px" />
    </div>
    <transition name="fade">
      <div class="ongoing--column" v-if="show">
        <template v-for="(order, index) in this.get_orders">
          <div class="ongoing--card" @click="track(order.order_no)" :class="{ active: active_card(order.order_no) }">
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
                {{date_format(order.date_time)}}
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
library.add(faCaretUp)


export default {
  name: 'ongoing-component',
  data: function() {
    return {
      loading: true,
    }
  },
  methods: {
    ...mapMutations({
      toggle : '$_orders/toggle_ongoing',
      change_page : '$_orders/set_page',
      hide_vendors: '$_orders/hide_vendors'
    }),
    toggle_ongoing: function() {
      this.toggle()
    },
    track: function(order) {
      this.hide_vendors()
      this.$router.push({ path: `/orders/tracking/${order}` })
      this.change_page(1)
    },
    active_card: function(order_no) {
      if (this.$route.params.order_no == order_no) {
        return true
      }
      else {
        return false
      }
    },
    date_format: function( date ) {
     if (this.moment(date).isBefore()) {
       date = this.moment().add(15, 'm');
     }
      var from_now = this.moment( date ).fromNow();

      return this.moment( date ).calendar( null, {
          sameDay:  '[Today] hh:mm a',
          nextDay:  '[Tomorrow] hh:mm a',
          nextWeek: 'dddd',
          sameElse: function () {
              return "[" + from_now + "]";
          }
      });
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
    classObject: function() {
      return {
        'sendy-blue': true,
        'rotate-transform': true,
        'rotate': this.show == 0
      }
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
  display: flex;
  justify-content: space-between;
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
  border: 1px solid #1782C5;
  cursor: pointer;
  transition: all .5s ease-in-out;
}
.ongoing--card:hover,.ongoing--card.active
{
  border-color: #f57f20;
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
  transition: all .5s ease-in-out;
}
.ongoing--card:hover .ongoing--card-status, .ongoing--card.active .ongoing--card-status
{
  background-color: #f57f20;
}
.ongoing--card-padded
{
  padding-bottom: 5px;
}
.rotate-transform
{
  transition: all 1s ease-in-out;
}
.rotate
{
  transform: rotate(180deg);
}
</style>
