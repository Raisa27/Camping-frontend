<template>
  <div class="details-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading camping spot details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/" class="back-button">Back to Home</router-link>
    </div>

    <!-- Content -->
    <div v-if="!loading && !error" class="card">
      <img 
        v-if="spotDetails.imageUrl" 
        :src="spotDetails.imageUrl" 
        :alt="spotDetails.name" 
        class="spot-image" 
      />
      
      <div class="spot-info">
        <h1>{{ spotDetails.name }}</h1>
        <p class="description">{{ spotDetails.description }}</p>
        
        <div class="info-grid">
          <p><strong>Location:</strong> {{ spotDetails.location }}</p>
          <p><strong>Capacity:</strong> {{ spotDetails.capacity }} people</p>
          <p><strong>Price:</strong> ${{ spotDetails.price }} per night</p>
        </div>
        <div class="button-group">
          <button @click="goToBooking" class="booking-button">Book Now</button>
          <router-link to="/" class="back-button">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import your images
import BrugesImg from '@/assets/img/Bruges.jpeg';
import ArdenneImg from '@/assets/img/Ardenne.png';
import GhentImg from '@/assets/img/Ghent.jpg';
import RaisaImg from '@/assets/img/Raisa.jpg';

export default {
  name: 'CampingSpotDetails',
  data() {
    return {
      spotDetails: {
        name: '',
        description: '',
        location: '',
        capacity: 0,
        price: 0,
        imageUrl: ''
      },
      loading: true,
      error: null
    }
  },
  created() {
    // Fetch data when component is created
    this.fetchSpotDetails();
  },
  methods: {
    getImageUrlForSpot(spotName) {
      const imageMappings = {
        'Bruges Riverside Retreat': BrugesImg,
        'Ardennes Forest Escape': ArdenneImg,
        'Ghent Urban Oasis': GhentImg,
        'Raisa camping spot': RaisaImg,
      };
      return imageMappings[spotName] || BrugesImg;
    },
    goToBooking() {
      this.$router.push({
        name: 'BookingPage',
        params: { 
          id: this.$route.params.id,
          spotName: this.spotDetails.name,
          price: this.spotDetails.price
        }
      });
    },
    async fetchSpotDetails() {
      console.log('Fetching details for ID:', this.$route.params.id);
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`http://localhost:3000/api/campingspots/${this.$route.params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch camping spot details (${response.status})`);
        }

        const data = await response.json();
        
        this.spotDetails = {
          name: data.Name,
          description: data.Description,
          location: data.CityVillage,
          capacity: data.MaxCapacity,
          price: data.PricePerNight,
          imageUrl: this.getImageUrlForSpot(data.Name)
        };
      } catch (error) {
        console.error('Error fetching camping spot details:', error);
        this.error = 'Failed to load camping spot details. Please try again later.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.details-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.spot-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.spot-info {
  padding: 2rem;
}

.description {
  margin: 1rem 0;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

.back-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
}

.back-button:hover {
  background-color: #45a049;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc3545;
}
</style>