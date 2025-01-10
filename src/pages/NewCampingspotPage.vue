<template>
  <div class="new-camping-spot">
    <h1>Create a New Camping Spot</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Camping Spot Name</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="Enter camping spot name"
          required
        />
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input
          v-model="form.location"
          type="text"
          id="location"
          placeholder="Enter location"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          placeholder="Enter a description"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="price">Price per Night</label>
        <input
          v-model.number="form.pricePerNight"
          type="number"
          id="price"
          placeholder="Enter price per night"
          required
        />
      </div>

      <div class="form-group">
        <label for="maxCapacity">Maximum Capacity</label>
        <input
          v-model.number="form.maxCapacity"
          type="number"
          id="maxCapacity"
          placeholder="Enter maximum number of guests"
          required
        />
      </div>

      <div class="form-group">
        <label for="image">Upload Image</label>
        <input
          @change="handleFileUpload"
          type="file"
          id="image"
          accept="image/*"
        />
      </div>

      <div class="button-group">
        <button type="button" class="btn btn-secondary" @click="goBack">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Create Camping Spot
        </button>
      </div>
    </form>

    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewCampingspotPage',
  data() {
    return {
      form: {
        name: '',
        location: '',
        description: '',
        pricePerNight: null,
        maxCapacity: null,
      },
      imageFile: null,
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    handleFileUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async submitForm() {
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const hostId = this.$route.query.hostId || localStorage.getItem('userId');
        
        const formData = new FormData();
        formData.append('Name', this.form.name);
        formData.append('Location', this.form.location);
        formData.append('Description', this.form.description);
        formData.append('PricePerNight', this.form.pricePerNight);
        formData.append('MaxCapacity', this.form.maxCapacity);
        formData.append('HostId', hostId);
        
        if (this.imageFile) {
          formData.append('Image', this.imageFile);
        }

        const response = await fetch('http://localhost:3000/api/campingspots', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create camping spot');
        }

        this.successMessage = 'Camping spot created successfully!';
        // Wait a moment to show the success message
        setTimeout(() => {
          this.$router.push({
            path: '/campings',
            query: { hostId }
          });
        }, 1500);
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred while creating the camping spot.';
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
};
</script>

<style scoped>
.new-camping-spot {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-primary {
  background-color: #00B074;
  color: white;
}

.btn-primary:hover {
  background-color: #009965;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.alert {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}
</style>