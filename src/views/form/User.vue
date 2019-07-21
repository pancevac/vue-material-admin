<template>
  <div id="page-forms">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg6>
          <v-card class="mb-4">
            <v-toolbar color="primary" dark flat dense cad>
              <v-toolbar-title class="subheading">Edit Profile</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex lg12 sm12>
                    <v-text-field label="Name" name="name" v-model="user.name"></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12>
                    <v-text-field label="Email" name="email" v-model="user.email"></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12>
                    <v-text-field
                      v-model="user.password"
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      :rules="[rules.required, rules.min]"
                      :type="show ? 'text' : 'password'"
                      name="password"
                      label="Normal with hint text"
                      hint="At least 8 characters"
                      counter
                      @click:append="show = !show"
                    ></v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="pb-3">
              <v-spacer></v-spacer>
              <v-btn color="primary">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      user: {
        name: "",
        email: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      }
    }
  },
  mounted() {
    this.getUser()
  },
  computed: {},
  methods: {
    getUser() {
      //
    }
  }
}
</script>
