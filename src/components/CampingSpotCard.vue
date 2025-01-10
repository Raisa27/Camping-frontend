<template>
  <div class="spot-card" @click="navigateToDetails">
    <!-- Display only the image and name -->
    <img :src="spot.imageUrl" :alt="spot.name" class="spot-image" />
    <h3>{{ spot.name }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    spot: {
      type: Object,
      required: true,
    }
  },
  methods: {
    navigateToDetails() {
      // Emit an event to navigate to details
      this.$emit("view-details", this.spot.id);
    },
  },
};
</script>

<style scoped>
.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
