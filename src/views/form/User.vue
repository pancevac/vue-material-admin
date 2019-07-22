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
              <v-btn color="primary" @click.stop="updateUser" :loading="loading.userSave">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex lg6>
          <v-card class="mb-4">
            <v-toolbar color="primary" dark flat dense cad>
              <v-toolbar-title class="subheading">Profile image</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex lg12 sm12>
                    <v-img :aspect-ratio="16/9" :src="user.media_path"></v-img>
                  </v-flex>
                  <v-flex lg12 sm12>
                    <upload-btn ref="uploadImage" @file-update="prepareImage"></upload-btn>
                  </v-flex>

                  <v-spacer></v-spacer>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="pb-3">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="uploadImage" :loading="loading.imageUpload">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import UploadButton from "vuetify-upload-button"

export default {
  components: {
    "upload-btn": UploadButton
  },

  data() {
    return {
      show: false,
      formData: null,
      user: {
        name: "",
        email: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      },
      loading: {
        imageUpload: false,
        userSave: false
      }
    }
  },

  mounted() {
    this.getUser()
  },

  methods: {
    getUser() {
      let user = this.$store.getters["auth/getUser"]
      if (user) {
        axios.get(user.profile).then(response => {
          this.user = response.data
        })
      }
    },

    updateUser() {
      this.loading.userSave = true
      axios.put(`/api/profile/${this.user.id}/update`, this.user).then(response => {
        this.ok("User have been successfully updated.")
        this.getUser()
        this.loading.userSave = false
      }).catch(e => {
        this.loading.userSave = false
      })
    },

    prepareImage(file) {
      this.formData = new FormData()
      this.formData.append("image", file)
    },

    uploadImage() {

      if (!this.formData) {
        return
      }
      this.loading.imageUpload = true
      axios.post(`/api/profile/${this.user.id}/upload/image`, this.formData).then(response => {
        this.loading.imageUpload = false
        this.$refs.uploadImage.clear()
        this.ok('Successfully updated image.')
        this.getUser()
      }).catch(e => {
        this.loading.imageUpload = false
      })
    },

    /**
     * Wrapp snackbar in shorted method.
     */
    ok(text) {
      this.$snack.success({
        text: text,
        button: "Close"
      })
    }
  }
}
</script>
