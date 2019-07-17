<template>
  <v-card class="elevation-1 pa-3 login-card">
    <v-card-text>
      <div class="layout column align-center">
        <img src="/static/m.png" alt="Ritmos Material Admin" width="120" height="120" />
        <h1 class="flex my-4 primary--text">Ritmos Admin Template</h1>
      </div>
      <v-form>
        <v-text-field
          append-icon="person"
          name="login"
          label="Login"
          type="text"
          v-model="model.username"
          :error="errors.message ? true : false"
        ></v-text-field>
        <v-text-field
          append-icon="lock"
          name="password"
          label="Password"
          id="password"
          type="password"
          v-model="model.password"
          :error-messages="errors.message"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <div class="login-btn">
      <v-btn icon>
        <v-icon color="blue">fa fa-facebook-square fa-lg</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="red">fa fa-google fa-lg</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="light-blue">fa fa-twitter fa-lg</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    errors: {
      message: null,
    },
    model: {
      username: "",
      password: ""
    }
  }),
  
  created() {
    
    // If auth user tries to access login page, redirect to home
    if (this.$store.getters['auth/isAuth']) {
      this.$router.push("/")
    }
  },

  methods: {
    login() {
      this.loading = true
      
      // handle login
      axios.post("/api/login", this.model)
        .then(response => {
          this.$store.dispatch("auth/setAccessToken", {
            token: response.data.access_token,
            expires_in: response.data.expires_in
          })
          this.$router.push("/dashboard")
        })
        .catch(e => {
          this.loading = false
          this.errors.message = e.response.data.message
        })
    }
  }
}
</script>
<style scoped lang="css"></style>
