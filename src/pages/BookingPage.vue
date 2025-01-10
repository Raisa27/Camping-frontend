<template>
    <div class="booking-page">
      <div class="booking-container">
        <!-- Left side - Booking Details -->
        <div class="booking-details">
          <h1>{{ spotName }}</h1>
          <p class="location">{{ location }}</p>
  
          <div class="dates-container">
            <div class="date-input">
              <label>Check-in</label>
              <input 
                type="date" 
                v-model="booking.startDate"
                :min="minDate"
                required
              >
            </div>
            <div class="date-input">
              <label>Check-out</label>
              <input 
                type="date" 
                v-model="booking.endDate"
                :min="booking.startDate"
                required
              >
            </div>
          </div>
  
          <div class="guests">
            <label>Number of guests</label>
            <select v-model="booking.guests">
              <option v-for="n in maxCapacity" :key="n" :value="n">
                {{ n }} guest{{ n > 1 ? 's' : '' }}
              </option>
            </select>
          </div>
  
          <!-- Price Breakdown -->
          <div class="price-breakdown">
            <div class="price-row">
              <span>${{ pricePerNight }} x {{ totalNights }} nights</span>
              <span>${{ basePrice }}</span>
            </div>
            <div class="price-row">
              <span>Service fee</span>
              <span>${{ serviceFee }}</span>
            </div>
            <div class="price-row total">
              <span>Total cost</span>
              <span>${{ totalPrice }}</span>
            </div>
            <p class="fee-explanation">* ${{ serviceFeeBase }} + 15% service fee. This helps us run our platform and offer services like 24/7 support.</p>
          </div>
        </div>
  
        <!-- Right side - Message and Submit -->
        <div class="message-submit">
          <div class="message-section">
            <h3>Send a message to the host</h3>
            <p class="optional">Optional</p>
            <textarea 
              v-model="booking.message"
              placeholder="Tell the host about your trip, when you'll arrive, and why you're traveling."
              rows="5"
            ></textarea>
          </div>
  
          <button 
            @click="handleBooking" 
            class="reserve-button"
            :disabled="!isValidBooking"
          >
            Request Reservation
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookingPage',
    data() {
      return {
        campingSpotId: this.$route.params.id,
        spotName: this.$route.params.spotName,
        location: '',
        pricePerNight: this.$route.params.price,
        maxCapacity: 4, // You should get this from your camping spot details
        serviceFeeBase: 3.00,
        booking: {
          startDate: '',
          endDate: '',
          guests: 1,
          message: ''
        },
        error: null
      }
    },
    computed: {
      minDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
      },
      totalNights() {
        if (!this.booking.startDate || !this.booking.endDate) return 0;
        const start = new Date(this.booking.startDate);
        const end = new Date(this.booking.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      basePrice() {
        return this.totalNights * this.pricePerNight;
      },
      serviceFee() {
        return this.serviceFeeBase + (this.basePrice * 0.15);
      },
      totalPrice() {
        return this.basePrice + this.serviceFee;
      },
      isValidBooking() {
        return this.booking.startDate && 
               this.booking.endDate && 
               this.totalNights > 0 &&
               this.booking.guests > 0;
      }
    },
    methods: {
      async handleBooking() {
  try {
    const userId = this.$route.query.userId || localStorage.getItem('userId');
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const bookingData = {
      UserId: parseInt(userId),
      CampingSpotId: parseInt(this.campingSpotId),
      StartingDate: this.booking.startDate,
      EndDate: this.booking.endDate,
      TotalPrice: parseFloat(this.totalPrice),
      NumberOfGuests: parseInt(this.booking.guests),
      Message: this.booking.message || ''
    };

    console.log('Sending booking data:', bookingData); // Debug log

    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.error || 'Failed to create booking');
    }

    // Redirect to profile page with success message
    this.$router.push({
      path: '/profile',
      query: { 
        userId: userId,
        booking: 'success',
        role: localStorage.getItem('userRole')
      }
    });
  } catch (error) {
    this.error = error.message;
    console.error('Booking error:', error);
  }
}
    }
  }
  </script>
  
  <style scoped>
  .booking-page {
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .booking-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .booking-details h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .location {
    color: #666;
    margin-bottom: 2rem;
  }
  
  .dates-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .date-input, .guests {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .date-input input, .guests select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .price-breakdown {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #ddd;
  }
  
  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .price-row.total {
    font-weight: bold;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
    margin-top: 1rem;
  }
  
  .fee-explanation {
    font-size: 0.875rem;
    color: #666;
    margin-top: 1rem;
  }
  
  .message-section {
    margin-bottom: 2rem;
  }
  
  .message-section h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .optional {
    color: #666;
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
  }
  
  .reserve-button {
    width: 100%;
    padding: 1rem;
    background-color: #00a699;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .reserve-button:hover {
    background-color: #008489;
  }
  
  .reserve-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>