<template></template>

<script>
  export default {
    props: ['details'],

    data(){
      return {}
    },

    methods: {
      flash(details){
        this.$notify(details);
      },
    },

    created(){
      window.events.$on('flash', details => {
          this.flash(details)
      });
    }
  }
</script>
