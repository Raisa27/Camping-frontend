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
            v-model.number="form.price"
            type="number"
            id="price"
            placeholder="Enter price per night"
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
  
        <button type="submit" class="btn btn-primary">
          Create Camping Spot
        </button>
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
    data() {
      return {
        form: {
          name: '',
          location: '',
          description: '',
          price: null,
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
        // Clear previous messages
        this.successMessage = '';
        this.errorMessage = '';
  
        try {
          // Create form data for file upload
          const formData = new FormData();
          formData.append('name', this.form.name);
          formData.append('location', this.form.location);
          formData.append('description', this.form.description);
          formData.append('price', this.form.price);
          if (this.imageFile) {
            formData.append('image', this.imageFile);
          }
  
          // Replace with your API URL
          const response = await fetch('https://your-api-url.com/camping-spots', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Failed to create camping spot');
          }
  
        //   const result = await response.json();
          this.successMessage = 'Camping spot created successfully!';
          this.resetForm();
        } catch (error) {
          this.errorMessage = error.message || 'An error occurred while creating the camping spot.';
        }
      },
      resetForm() {
        this.form = {
          name: '',
          location: '',
          description: '',
          price: null,
        };
        this.imageFile = null;
        document.getElementById('image').value = ''; // Reset file input
      },
    },
  };
  </script>
  
  <style scoped>
  .new-camping-spot {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    display: block;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-top: 5px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 1em;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .alert {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
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
  