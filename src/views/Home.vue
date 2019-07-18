<template>
  <v-container grid-list-xl fluid>
    <h3>Latest playlists</h3>

    <v-layout row wrap>
      <v-flex xs12 lg3 sm6 v-for="(playlist, key) in playlists" :key="key">
        <router-link :to="{ name: 'playlist', params: { id: playlist.id }}">
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
                      <span>(34)</span>
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

    <h3 style="padding-top: 20px">Latest added tracks</h3>

    <v-layout row wrap>
      <v-flex xs12 lg3 sm6 v-for="(track, key) in tracks" :key="key">
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
                    <span>Total tracks</span>
                    <span>(34)</span>
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
      tracks: []
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
      axios.get("/api/playlists").then(response => {
        this.playlists = response.data.playlists
      })
    },

    /**
     * Get public latest tracks
     */
    getTracks() {
      axios.get("/api/tracks").then(response => {
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
