<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />

        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      userRoles: {
        1: 'admin', // Admin role
        2: 'camper', // Camper role (user in original UI)
        3: 'host' // Host role
      }
    };
  },
  created() {
    console.log('LoginPage component has been created');
  },
  methods: {
    handleLogin() {
      this.errorMessage = '';

      // Ensure fields are not empty
      if (!this.email || !this.password) {
        this.errorMessage = 'All fields are required.';
        return;
      }

      // Fetch user data from the API
      fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(users => {
          // Find a matching user based on email and password
          const user = users.find(u => u.Email === this.email && u.Password === this.password);

          if (user) {
            const role = this.userRoles[user.UserTypeId];

            if (role) {
              alert(`Welcome ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
              this.$router.push({
                path: '/profile',
                query: {
                  email: this.email,
                  role: role,
                  userId: user.UserId 
                }
              });
            } else {
              this.errorMessage = 'Invalid role. Please contact support.';
            }
          } else {
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          this.errorMessage = 'An error occurred while logging in. Please try again later.';
        });
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f9;
  padding: 20px;
}

.login-container {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Styles remain the same */
.login-container h1 {
  margin: 0 0 20px;
  font-size: 1.8rem;
  color: #00a676;
  text-align: center;
}

.login-container form {
  display: flex;
  flex-direction: column;
}

.login-container label {
  margin-bottom: 5px;
  font-size: 1rem;
  color: #333;
}

.login-container input {
  padding: 10px;
  margin-bottom: 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.login-container button {
  padding: 10px;
  background-color: #00a676;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-container button:hover {
  background-color: #007d5a;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 15px;
}
</style>
