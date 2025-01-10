<template>
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search camping spots"
        v-model="searchQuery"
        @input="emitSearch"
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      emitSearch() {
        this.$emit('search', this.searchQuery);
      },
    },
  };
  </script>
  