<template>
  <div class="camping-list">
    <div class="header-section">
      <h1>Mijn Campings</h1>
      <p class="camping-count" v-if="!loading && !error">
        Aantal campings: {{ campings.length }}
      </p>
      <!-- Add button for creating a new camping spot -->
      <button 
        v-if="isHost" 
        class="new-camping-button" 
        @click="navigateToCreateCampingSpot">
        Nieuwe Campingplek Toevoegen
      </button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else-if="campings.length" class="camping-items">
      <li v-for="camping in campings" :key="camping.CampingSpotId" class="camping-item">
        <h3>{{ camping.Name }}</h3>
        <div class="camping-details">
          <p><strong>Locatie:</strong> {{ camping.Description || 'Locatie niet beschikbaar' }}</p>
          <p><strong>Prijs per nacht:</strong> €{{ camping.PricePerNight }}</p>
          <p><strong>Max capaciteit:</strong> {{ camping.MaxCapacity }} personen</p>
        </div>
      </li>
    </ul>
    <p v-else>Geen campings gevonden voor deze verhuurder.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      campings: [],
      loading: true,
      error: null,
      isHost: false, // to check if user is a host
    };
  },
  created() {
  const hostId = this.$route.query.hostId;
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  
  console.log('Debug info:', {
    hostId,
    userRole,
    userId,
    routeQuery: this.$route.query
  });

  this.isHost = userRole === 'host';

  if (hostId) {
    this.fetchCampings(hostId);
  } else if (userId) {
    // Fallback to userId if no hostId in query
    this.fetchCampings(userId);
  } else {
    console.error('No hostId or userId available');
  }
},
  methods: {
    async fetchCampings(hostId) {
  try {
    // Clean the hostId and actually use it in the URL
    const cleanHostId = hostId.toString().replace(':', '');
    const response = await fetch(`http://localhost:3000/api/users/${cleanHostId}/campingspots`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    this.campings = Array.isArray(data) ? data : [];
    console.log('Received camping data:', data);
  } catch (error) {
    console.error('Error fetching camping spots:', error);
    this.error = 'Error loading campings: ' + error.message;
  } finally {
    this.loading = false;
  }
},
    navigateToCreateCampingSpot() {
      const hostId = this.$route.query.hostId || localStorage.getItem('userId');
      this.$router.push({ path: '/campings/new', query: { hostId } });
    },
  },
};
</script>
  
  <style scoped>
  .camping-list {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .header-section {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Add this */
  margin-bottom: 20px;
  flex-wrap: wrap; /* Add this */
  gap: 10px; /* Add this */
}
  
  .camping-count {
    margin-left: 20px;
    color: #666;
    font-size: 0.9em;
  }
  
  .camping-items {
    list-style: none;
    padding: 0;
  }
  
  .camping-item {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .camping-item h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.2em;
  }
  
  .camping-details {
    color: #555;
  }
  
  .camping-details p {
    margin: 8px 0;
  }
  .new-camping-button {
  background-color: #00B074;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.new-camping-button:hover {
  background-color: #009965;
}
  </style>