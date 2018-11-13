<template lang="html">
  <div class="" id="order_details_container">
      something inside order details
        {{order_id}}
  </div>
</template>

<script>
export default {
    name:'order-details',
    data() {
        return {
          order_id:''
        }
    },
    mounted(){
        this.order_id  = this.$route.params.id;
    }
}
</script>

<style lang="css">
</style>
