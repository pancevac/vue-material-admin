<template>
  <v-container grid-list-xl fluid>
    <h3>My playlists</h3>

    <v-layout row wrap>
      <v-progress-circular
        v-if="loading"
        :size="50"
        color="primary"
        indeterminate
        style="margin: 50px auto"
      ></v-progress-circular>

      <v-flex xs12 lg4 sm6 v-for="(playlist, key) in playlists" :key="key">
        <router-link
          :to="{ name: 'my_playlist', params: { id: playlist.id }}"
          style="text-decoration: none"
        >
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 12 : 2}`"
              class="mx-auto"
              width="350"
            >
              <v-img :aspect-ratio="16/9" :src="playlist.media_path"></v-img>
              <v-card-title style="position: relative">
                <v-hover>
                  <v-expand-transition>
                    <v-fab-transition>
                      <v-btn
                        @click="playPlaylist(playlist.id)"
                        v-if="hover"
                        color="white"
                        class="white--text"
                        fab
                        absolute
                        small
                        right
                        top
                      >
                        <v-icon color="black">play_arrow</v-icon>
                      </v-btn>
                    </v-fab-transition>
                  </v-expand-transition>
                </v-hover>

                <div>
                  <span class="headline">{{ playlist.name }}</span>
                  <div class="d-flex">
                    <div class="ml-2 grey--text text--darken-2">
                      <span>Total tracks</span>
                      <span>({{ playlist.tracks_count }})</span>
                    </div>
                  </div>
                </div>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </v-hover>
        </router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      playlists: [],
      loading: false
    }
  },

  mounted() {
    this.getPlaylists()
  },

  methods: {
    getPlaylists() {
      this.loading = true
      axios.get("/api/playlists?user=sinisa.buncic7@gmail.com").then(response => {
        this.loading = false
        this.playlists = response.data.playlists
      })
    }
  }
}
</script>

<style>
</style>
