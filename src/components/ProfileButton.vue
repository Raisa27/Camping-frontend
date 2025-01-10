<template>
    <button @click="goToProfile">Profile</button>
  </template>
  
  <script>
  export default {
    methods: {
      goToProfile() {
        this.$router.push('/profile');
      },
    },
  };
  </script>
  