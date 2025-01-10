<template>
  <div class="filter-component">
    <h3>Filter</h3>
    <div class="filter-group">
      <label>City or Village:</label>
      <input 
        type="text" 
        v-model.trim="filters.location" 
        @input="applyFilters" 
        placeholder="Enter location..."
      />
    </div>
    
    <div class="filter-group">
      <label>Price Range:</label>
      <select v-model="filters.price" @change="applyFilters">
        <option value="">All Prices</option>
        <option value="low">Under €50</option>
        <option value="high">€50 and above</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label>Amenities:</label>
      <input 
        type="text" 
        v-model.trim="filters.amenitiesInput" 
        @input="handleAmenitiesInput"
        placeholder="Enter amenities (comma-separated)"
      />
    </div>
    
    <div class="filter-group">
      <label>Max Capacity:</label>
      <input 
        type="number" 
        v-model.number="filters.maxCapacity" 
        @input="applyFilters"
        min="1"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampingFilter',
  data() {
    return {
      filters: {
        location: '',
        coordinates: '',
        price: '',
        amenitiesInput: '',
        amenities: [],
        maxCapacity: null,
      },
    };
  },
  methods: {
    handleAmenitiesInput() {
      // Split amenities by comma and clean up the input
      this.filters.amenities = this.filters.amenitiesInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      this.applyFilters();
    },
    applyFilters() {
      this.$emit('filter', { ...this.filters });
    },
  },
};
</script>

<style scoped>
.filter-component {
  padding: 1rem;
}

.filter-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input:focus, select:focus {
  outline: none;
  border-color: #00B074;
}
</style>