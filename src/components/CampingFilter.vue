<template>
  <div class="filter-component">
    <h3>Filter</h3>
    <div>
      <label>City or Village:</label>
      <input type="text" v-model="filters.location" @input="applyFilters" />
    </div>
    <div>
      <label>Coordinates:</label>
      <input type="text" v-model="filters.coordinates" @input="applyFilters" />
    </div>
    <div>
      <label>Price:</label>
      <select v-model="filters.price" @change="applyFilters">
        <option value="low">Low</option>
        <option value="high">High</option>
      </select>
    </div>
    <div>
      <label>Amenities (comma-separated):</label>
      <input type="text" v-model="filters.amenities" @input="applyFilters" />
    </div>
    <div>
      <label>Max Capacity:</label>
      <input type="number" v-model="filters.maxCapacity" @input="applyFilters" />
    </div>
    <div>
      <label>Rating:</label>
      <select v-model="filters.rating" @change="applyFilters">
        <option v-for="n in 5" :key="n" :value="n">{{ n }} stars</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampingFilter',
  data() {
    return {
      filters: {
        location: '',       // To filter by CityVillage
        coordinates: '',    // To filter by Coordinates
        price: '',
        amenities: '',      // Input for comma-separated amenities
        maxCapacity: '',
        rating: '',
      },
    };
  },
  methods: {
    applyFilters() {
      // Emit amenities as an array after splitting by commas
      const filtersWithAmenitiesArray = {
        ...this.filters,
        amenities: this.filters.amenities.split(',').map(a => a.trim().toLowerCase()),
      };
      this.$emit('filter', filtersWithAmenitiesArray);
    },
  },
};
</script>
