<template>
  <div class="list-table">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h3>{{ playlist.name }}</h3>
        </v-flex>
        <v-btn color="primary" dark :loading="loading" @click="startPlaylist">Listen</v-btn>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-btn icon>
                <v-icon>filter_list</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="table.headers"
                :search="search"
                :items="table.items"
                :rows-per-page-items="[10, 25, 50, { text: 'All', value: -1 }]"
                class="elevation-1"
                item-key="id"
                select-all
                v-model="table.selected"
                :loading="loading"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-checkbox primary hide-details v-model="props.selected"></v-checkbox>
                  </td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.artist }}</td>
                  <td>{{ props.item.album }}</td>
                  <td>{{ props.item.duration }}</td>
                  <td>
                    <v-btn fab dark color="indigo" small @click.stop="playTrack(props.item)">
                      <v-icon v-if="selectedTrack && selectedTrack.id == props.item.id">pause</v-icon>
                      <v-icon v-else>play_arrow</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
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
      selectedTrack: null,
      loading: false,
      playlist: {},
      search: "",
      table: {
        selected: [],
        headers: [
          {
            text: "Track",
            value: "track"
          },
          {
            text: "Artists",
            value: "artist"
          },
          {
            text: "Album",
            value: "album"
          },
          {
            text: "Duration",
            value: "duration"
          },
          {
            text: "Action",
            value: ""
          }
        ],
        items: []
      }
    }
  },

  mounted() {
    this.getPlaylist(this.$route.params.id)
  },

  computed: {
    currentTrack() {
      return this.$store.getters["player/getCurrentTrack"]
    }
  },

  watch: {
    currentTrack(track) {
      this.selectedTrack = track
    }
  },

  methods: {
    /**
     * Get specific playlist info, including tracks for table.
     */
    getPlaylist(id) {
      this.loading = true
      axios
        .get("/api/playlists/" + id)
        .then(response => {
          this.playlist = response.data
          this.table.items = response.data.tracks
          this.loading = false
          if (this.playlist.tracks.length !== 0) {
            this.$store.dispatch("player/loadPlaylist", this.playlist.tracks)
          }
        })
        .catch(e => {
          this.loading = false
        })
    },

    /**
     * Play track
     */
    playTrack(track) {
      this.selectedTrack = track
      this.$store.dispatch("player/setPlayThisTrack", track)
      this.$store.dispatch("player/setShow", true)
    },

    startPlaylist() {
      this.$store.dispatch("player/setPlayThisTrack", this.playlist.tracks[0])
      this.$store.dispatch("player/setShow", true)
    }
  }
}
</script>
