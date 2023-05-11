<template>
  <div>
    <span>{{ count }}</span>
    <button @click="increment">
      {{ $('count.increment') }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
