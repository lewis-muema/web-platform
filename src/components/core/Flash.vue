<template />

<script>
export default {
  props: ['details'],

  data() {
    return {
      codes: {
        0: 'success',
        1: 'success',
        2: 'warning',
        3: 'error',
      },
    };
  },

  beforeMount() {
    window.events.$on('flash', details => {
      this.flash(details);
    });
  },

  methods: {
    flash(details) {
      const data = { ...details };
      data.type = this.codes[details.type];
      this.$notify(data);
    },
  },
};
</script>
