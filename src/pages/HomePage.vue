<template>
  <div class="homepage">
    <header class="header">
      <div class="header-content">
        <div class="user-controls">
          <router-link :to="{ name: 'Login' }" class="login-button">Login</router-link>
          <ProfileButton />
        </div>
      </div>
    </header>

    <div class="main-content">
      <!-- Filter Sidebar -->
      <aside class="filter">
        <div class="card">
          <CampingFilter @filter="handleFilters" />
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="camping-spots">
        <div class="card">
          <!-- Enhanced Search Bar -->
          <div class="search-container">
            <SearchBar @search="handleSearch" class="main-search" />
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading camping spots...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error">
            {{ error }}
          </div>

          <!-- Camping Spots Grid -->
          <div v-else class="spots-list">
            <CampingSpotCard
             v-for="spot in filteredSpots"
             :key="spot.id"
             :spot="spot"
             class="spot-card"
             @view-details="goToDetails"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// Top-level imports
import CampingFilter from '@/components/CampingFilter.vue';
import SearchBar from '@/components/SearchBar.vue';
import ProfileButton from '@/components/ProfileButton.vue';
import CampingSpotCard from '@/components/CampingSpotCard.vue';

// Import image files at the top
import BrugesImg from '@/assets/img/Bruges.jpeg';
import ArdenneImg from '@/assets/img/Ardenne.png';
import GhentImg from '@/assets/img/Ghent.jpg';
import RaisaImg from '@/assets/img/Raisa.jpg';

export default {
  name: "HomePage",
  components: {
    CampingFilter,
    SearchBar,
    ProfileButton,
    CampingSpotCard,
  },
  data() {
    return {
      campingSpots: [],
      filteredSpots: [],
      error: null,
      loading: false
    };
  },
  created() {
    this.fetchCampingSpots();
  },
  methods: {
    goToDetails(spotId) {
  this.$router.push({
    name: 'CampingSpotDetails',
    params: { id: spotId },
  });
}
,
async fetchCampingSpots() {
  this.loading = true;
  try {
    const response = await fetch('http://localhost:3000/api/campingspots');
    if (!response.ok) {
      throw new Error('Failed to fetch camping spots');
    }
    const data = await response.json();
    this.campingSpots = data.map(spot => ({
      id: spot.CampingSpotId,
      name: spot.Name,
      location: spot.CityVillage,
      coordinates: spot.Coordinates,
      description: spot.Description,
      capacity: spot.MaxCapacity,
      price: spot.PricePerNight,
      amenities: spot.AmenitiesName, // Use the amenities name instead of ID
      imageUrl: this.getImageUrlForSpot(spot.Name)
    }));
    this.filteredSpots = [...this.campingSpots];
  } catch (error) {
    console.error('Error fetching camping spots:', error);
    this.error = 'Failed to load camping spots';
  } finally {
    this.loading = false;
  }
},

    getImageUrlForSpot(spotName) {
      const imageMappings = {
        'Bruges Riverside Retreat': BrugesImg,
        'Ardennes Forest Escape': ArdenneImg,
        'Ghent Urban Oasis': GhentImg,
        'Raisa camping spot': RaisaImg,
      };
      return imageMappings[spotName] || BrugesImg; // Return default/fallback image
    },

    handleSearch(searchQuery) {
      if (!searchQuery) {
        this.filteredSpots = [...this.campingSpots];
        return;
      }
      this.filteredSpots = this.campingSpots.filter(spot =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },

    handleFilters(filters) {
  this.filteredSpots = this.campingSpots.filter(spot => {
    // Location filter
    const locationMatch = !filters.location || 
      spot.location.toLowerCase().includes(filters.location.toLowerCase());

    // Coordinates filter
    const coordinatesMatch = !filters.coordinates || 
      spot.coordinates.toLowerCase().includes(filters.coordinates.toLowerCase());

    // Price filter
    const priceMatch = !filters.price || 
      (filters.price === 'low' ? spot.price < 50 : spot.price >= 50);

    // Amenities filter
    const amenitiesMatch = !filters.amenities.length || 
      filters.amenities.some(amenity => 
        spot.amenities?.toLowerCase().includes(amenity.toLowerCase())
      );

    // Capacity filter
    const capacityMatch = !filters.maxCapacity || 
      spot.capacity <= parseInt(filters.maxCapacity);

    return locationMatch && 
           coordinatesMatch && 
           priceMatch && 
           amenitiesMatch && 
           capacityMatch;
  });
},
  }
};
</script>

<style scoped>
/* Apply Tahoma font to everything */
* {
  font-family: Tahoma, sans-serif;
}

.homepage {
  min-height: 100vh;
  background-color: #f8f7ff;
  padding: 20px;
}

.header {
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.user-controls {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.login-button {
  background-color: #00B074;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #009965;
}

/* Enhanced search container styles */
.search-container {
  margin-bottom: 2rem;
  padding: 1rem 0;
}

/* Style to be applied to the SearchBar component */
:deep(.main-search input) {
  width: 100%;
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid #00B074;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s ease;
}

:deep(.main-search input:focus) {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 176, 116, 0.2);
}

:deep(.main-search button) {
  background-color: #00B074;
  color: white;
  padding: 12px 24px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.main-search button:hover) {
  background-color: #009965;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .main-content {
    grid-template-columns: 300px 1fr;
  }
}

.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Form elements styling */
input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 1rem;
  font-family: Tahoma, sans-serif;
}

input:focus, select:focus {
  outline: none;
  border-color: #00B074;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00B074;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #dc2626;
  text-align: center;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 4px;
}

.spots-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.spot-card {
  transition: transform 0.2s;
}

.spot-card:hover {
  transform: translateY(-2px);
}

h1, h2, h3 {
  color: #00B074;
  margin-bottom: 1.5rem;
}

button {
  background-color: #00B074;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #009965;
}
</style>