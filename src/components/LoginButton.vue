<template>
    <button @click="goToLogin">Login</button>
  </template>
  
  <script>
  export default {
    methods: {
      goToLogin() {
        this.$router.push('/login');
      },
    },
  };
  </script>
  