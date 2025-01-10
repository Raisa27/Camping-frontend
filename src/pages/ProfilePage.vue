<template>
  <div class="profile-container">
    <div class="card welcome-banner">
      <h1>Welkom bij Campers!</h1>
      <p class="user-type">{{ userTypeDisplay }}</p>
    </div>

    <div class="card profile-content">
      <div class="personal-info">
        <h2>Persoonlijke info</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="email">E-mailadres</label>
            <input 
              type="email" 
              id="email" 
              v-model="userInfo.email"
              disabled
            />
          </div>

          <div v-if="userInfo.role === 'camper'" class="card booking-section">
  <h2>My Bookings</h2>
  <div v-if="isLoadingBookings" class="loading-message">
    <p>Loading bookings...</p>
  </div>
  <div v-else-if="bookingError" class="error-message">
    <p>{{ bookingError }}</p>
  </div>
  <div v-else>
    <div v-if="bookings.length > 0" class="bookings-list">
      <div v-for="booking in bookings" :key="booking.ReservationId" class="booking-card">
        <h3>{{ booking.spotName }}</h3>
        <div class="booking-details">
          <p><strong>Check-in:</strong> {{ formatDate(booking.StartingDate) }}</p>
          <p><strong>Check-out:</strong> {{ formatDate(booking.EndDate) }}</p>
          <p><strong>Total Price:</strong> €{{ booking.TotalPrice }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-booking-message">
      <p>No bookings found. Start your adventure by booking a camping spot!</p>
    </div>
  </div>

          </div>

          <div class="form-group">
            <label for="role">Account type</label>
            <input 
              type="text" 
              id="role" 
              v-model="userTypeDisplay"
              disabled
            />
          </div>

          <div class="form-group">
            <label for="mobiel">Mobiel</label>
            <div class="phone-input">
              <input 
                type="tel" 
                id="mobiel" 
                v-model="userInfo.mobiel"
                :disabled="!isEditing"
                placeholder="Voeg telefoonnummer toe"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="taal">Voorkeurstaal</label>
            <select 
              id="taal" 
              v-model="userInfo.taal"
              :disabled="!isEditing"
            >
              <option value="Nederlands">Nederlands</option>
              <option value="English">English</option>
              <option value="Deutsch">Deutsch</option>
            </select>
          </div>

          <div class="form-group">
            <label>Actief sinds</label>
            <input 
              type="text" 
              :value="formattedDate"
              disabled
            />
          </div>
        </form>
      </div>

      <div class="action-buttons">
        <button 
          v-if="!isEditing" 
          class="edit-button"
          @click="startEditing"
        >
          Bewerk profiel
        </button>
        <template v-else>
          <button 
            class="save-button"
            @click="saveChanges"
          >
            Opslaan
          </button>
          <button 
            class="cancel-button"
            @click="cancelEditing"
          >
            Annuleren
          </button>
        </template>
      </div>
    </div>

    <!-- Role-specific sections -->
    <div v-if="userInfo.role === 'host'" class="card host-section">
      <h2>Mijn Campings</h2>
      <p>Beheer je campings hier</p>
      <button class="campings-button" @click="goToCampingSpots">
        Bekijk Mijn Campings
      </button>
    </div>

    <div v-if="userInfo.role === 'admin'" class="card admin-section">
      <h2>Beheerdersfuncties</h2>
      <p>Beheer website-instellingen</p>
    </div>

    <div class="homepage-button-container">
      <router-link :to="{ name: 'Home' }" class="homepage-button">
        Terug naar Homepage
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      isEditing: false,
      isLoadingBookings: false,
      userInfo: {
        email: '',
        role: '',
        mobiel: '',
        taal: 'Nederlands',
        photoUrl: null,
        createdAt: new Date(),
        userId: null
      },
      originalUserInfo: null,
      bookings: [],
      bookingError: null
    };
  },
  computed: {
    userTypeDisplay() {
      const types = {
        user: 'Gebruiker',
        host: 'Verhuurder',
        admin: 'Beheerder'
      };
      return types[this.userInfo.role] || 'Gebruiker';
    },
    formattedDate() {
      return new Date(this.userInfo.createdAt).toLocaleString('nl-NL');
    }
  },
  created() {
    // Get user info from query params or localStorage
    const email = this.$route.query.email || localStorage.getItem('userEmail') || '';
    const role = this.$route.query.role || localStorage.getItem('userRole') || '';
    const userId = this.$route.query.userId || localStorage.getItem('userId');

    // Initialize user info
    this.userInfo = {
      email,
      role,
      userId,
      mobiel: '',
      taal: 'Nederlands',
      photoUrl: null,
      createdAt: new Date()
    };

    // Fetch data if we have a userId
    if (userId) {
      this.fetchUserInfo(userId);
      if (role === 'camper') {
        this.fetchBookings(userId);
      } else if (role === 'host') {
        this.fetchCampings(userId);
      }
    }

    // Show success message if redirected from successful booking
    if (this.$route.query.booking === 'success') {
      this.showSuccessMessage('Booking successful!');
    }
  },
  methods: {
    startEditing() {
      this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo));
      this.isEditing = true;
    },
    saveChanges() {
      this.isEditing = false;
      console.log('Saving user info:', this.userInfo);
    },
    cancelEditing() {
      this.userInfo = JSON.parse(JSON.stringify(this.originalUserInfo));
      this.isEditing = false;
    },
    updateProfile() {
      console.log('Profile update submitted');
    },
    async fetchUserInfo(userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user info');
        const userData = await response.json();
        this.userInfo = { ...this.userInfo, ...userData };
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    async fetchBookings(userId) {
  this.isLoadingBookings = true;
  this.bookingError = null;
  
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    
    const bookings = await response.json();
    console.log('Fetched bookings:', bookings); // Debug log
    
    this.bookings = bookings.map(booking => ({
      ...booking,
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
      totalPrice: parseFloat(booking.totalPrice).toFixed(2) // Ensure proper price formatting
    }));
  } catch (error) {
    this.bookingError = error.message;
    console.error('Error fetching bookings:', error);
    this.bookings = [];
  } finally {
    this.isLoadingBookings = false;
  }
},
    formatDate(dateString) {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    },
    goToCampingSpots() {
      console.log('Navigating to campings with hostId:', this.userInfo.userId);
      if (this.userInfo.userId) {
        this.$router.push({
          path: '/campings',
          query: { hostId: this.userInfo.userId }
        });
      } else {
        console.error('Host ID is missing in user info');
      }
    },
    fetchCampings(userId) {
      console.log('Fetching campings for userId:', userId);
      fetch(`http://localhost:3000/api/users/${userId}/campingspots`)
        .then(response => response.json())
        .then(data => {
          console.log('Campings fetched:', data);
          this.campings = data;
        })
        .catch(error => console.error('Error fetching campings:', error));
    },
    showSuccessMessage(message) {
      // You can implement this with a proper notification system
      alert(message);
    }
  }
};
</script>

<style scoped>
/* Your styles remain the same */
.campings-button {
  background-color: #00B074;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.campings-button:hover {
  background-color: #009965;
}
</style>

  
<style>
/* General Styles */
* {
  font-family: Tahoma, sans-serif;
}

/* Buttons */
.campings-button,
.edit-button,
.save-button,
.homepage-button {
  background-color: #00B074;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.campings-button:hover,
.edit-button:hover,
.save-button:hover,
.homepage-button:hover {
  background-color: #009965;
}

/* Profile Container */
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Card Styling */
.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

/* Welcome Banner */
.welcome-banner {
  text-align: center;
  background-color: white;
}

.welcome-banner h1 {
  color: #00B074;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.user-type {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

/* Profile Content */
.profile-content {
  margin-top: 2rem;
}

h2 {
  color: #00B074;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

/* Inputs and Select Fields */
input,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #00B074;
  box-shadow: 0 0 0 3px rgba(0, 176, 116, 0.1);
}

input:disabled,
select:disabled {
  background-color: #f8f8f8;
  color: #666;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #f1f1f1;
  color: #333;
}

.cancel-button:hover {
  background-color: #e5e5e5;
}

/* Additional Sections */
.host-section,
.admin-section {
  margin-top: 2rem;
}

.host-section p,
.admin-section p {
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    margin: 1rem auto;
  }

  .card {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}

/* Homepage Button */
.homepage-button-container {
  margin-top: 20px;
  text-align: center;
}

</style>
