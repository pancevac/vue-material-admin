<template>
  <v-container grid-list-xl fluid>
    <h3><router-link
        :to="{name: 'playlists'}"
        style="text-decoration: none; color: black"
      >Latest playlists</router-link></h3>

    <v-layout row wrap>
      <v-progress-circular
        v-if="playlistLoading"
        :size="50"
        color="primary"
        indeterminate
        style="margin: 50px auto"
      ></v-progress-circular>

      <v-flex xs12 lg4 sm6 v-for="(playlist, key) in playlists" :key="key">
        <router-link
          :to="{ name: 'playlist', params: { id: playlist.id }}"
          style="text-decoration: none"
        >
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 12 : 2}`"
              class="mx-auto"
              width="350"
            >
              <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
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

    <h3 style="padding-top: 20px">
      <router-link
        :to="{name: 'tracks'}"
        style="text-decoration: none; color: black"
      >Latest added tracks</router-link>
    </h3>

    <v-layout row wrap>

      <v-progress-circular
        v-if="trackLoading"
        :size="50"
        color="primary"
        indeterminate
        style="margin: 50px auto"
      ></v-progress-circular>

      <v-flex xs12 lg4 sm6 v-for="(track, key) in tracks" :key="key">
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="mx-auto"
            width="350"
          >
            <v-img :aspect-ratio="16/9" :src="track.image_url"></v-img>
            <v-card-title style="position: relative">
              <v-hover>
                <v-expand-transition>
                  <v-fab-transition>
                    <v-btn
                      @click="playTrack(track.id)"
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
                <span class="headline">{{ track.name }}</span>
                <div class="d-flex">
                  <div class="ml-2 grey--text text--darken-2">
                    <span v-if="track.artist">Artist: {{ track.artist }}</span>
                    <br>
                    <span v-if="track.album">Album: {{ track.album }}</span>
                  </div>
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-card-title>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      playlists: [],
      tracks: [],
      playlistLoading: false,
      trackLoading: false
    }
  },

  mounted() {
    this.getPlaylists()
    this.getTracks()
  },

  methods: {
    /**
     * Get public latest playlists
     */
    getPlaylists() {
      this.playlistLoading = true
      axios.get("/api/playlists").then(response => {
        this.playlistLoading = false
        this.playlists = response.data.playlists
      })
    },

    /**
     * Get public latest tracks
     */
    getTracks() {
      this.trackLoading = true
      axios.get("/api/tracks").then(response => {
        this.trackLoading = false
        this.tracks = response.data.tracks
      })
    },

    /**
     * Play choosen playlist
     */
    playPlaylist(id) {
      //
    },

    /**
     * Play choosen track
     */
    playTrack(id) {
      //
    }
  }
}
</script>
