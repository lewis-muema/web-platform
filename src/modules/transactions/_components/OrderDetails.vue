<template lang="html">
  <div class="" id="order_details_container">
      something inside order details
      {{order}}
  </div>
</template>

<script>
export default {
    name:'order-details',
    props:{
        order: {
            type:object,
            default: {}
        }
    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="css">
</style>
