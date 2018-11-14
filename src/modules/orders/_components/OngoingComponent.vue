<template lang="html">
  <div class="ongoing--outer">
    <div class="ongoing--count" @click="toggle_ongoing()">
      You have <span>x </span> ongoing orders
    </div>
    <transition name="fade">
      <div class="ongoing--column" v-if="show">
        <template>
          <div class="ongoing--card">
            <div class="ongoing--card-location">
              <div class="ongoing--card-padded">
                From : <span></span>
              </div>
              <div class="">
                To : <span></span>
              </div>
            </div>
            <div class="ongoing--card-status">
              <div class="">
                status here
              </div>
              <div class="">
                time here
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
  methods: {
    ...mapMutations({
      toggle : '$_orders/toggle_ongoing'
    }),
    toggle_ongoing: function() {
      this.toggle()
    }
  },
  computed : {
    ...mapGetters({
      show : '$_orders/show_ongoing'
    }),
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
}
.ongoing--count
{
  background-color: rgba(255,255,255,0.5);
  color: #1782c5;
  padding: 5px;
  cursor: pointer;
  border: 1px solid #1782c5;
}
.ongoing--card
{
  font-size: 13px;
  margin-top: 10px;
  border: 1px solid #1782c5;
}
.ongoing--card-location
{
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
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
