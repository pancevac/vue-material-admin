<template>
  <div class="list-table">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xs12 lg4>
          <v-card width="350">
            <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
            <v-btn small>Edit</v-btn>
            <v-btn small color="primary">Listen</v-btn>
          </v-card>
        </v-flex>
        <v-flex xs12 lg4 ma-3>
          <v-layout row wrap>
            <v-flex d-flex>
              <h2>
                <b>{{ playlist.name }}</b>
              </h2>
            </v-flex>
            <v-flex d-flex>
              <ul class="header-info-list">
                <li v-if="playlist.tracks_count !== 1">{{ playlist.tracks_count }} tracks</li>
                <li v-else>{{ playlist.tracks_count }} track</li>
                <li>{{ formatDurationTime() }}</li>
                <li>Updated: 1 week ago</li>
              </ul>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 lg12>
          <v-dialog v-model="dialogDelete" max-width="290">
            <v-card>
              <v-card-title class="headline">Delete track: {{ track.name }}?</v-card-title>

              <v-card-text>You will not be able to revert this action!</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="dialogDelete = false">Cancel</v-btn>

                <v-btn color="red darken-1" flat="flat" @click.stop="deleteTrack(track.id)">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>

        <v-dialog v-model="dialogUpload" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Add Track</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add new track</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <upload-btn ref="uploadButton" @file-update="prepareTrack"></upload-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                flat
                @click="dialogUpload = false, $refs.uploadButton.clear()"
              >Close</v-btn>
              <v-btn
                color="blue darken-1"
                flat
                :loading="trackUploadLoading"
                @click="uploadTrack"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit track</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Name*" required v-model="track.name"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field label="Artist" v-model="track.artist"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field label="Album" v-model="track.album"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-autocomplete
                      :items="playlists"
                      item-value="id"
                      item-text="name"
                      label="Playlists"
                      v-model="track.playlists"
                      multiple
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialogEdit = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="updateTrack(track.id)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAddToPlaylist" scrollable max-width="300px">
          <v-card>
            <v-card-title>Select playlist</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;">
              <v-radio-group v-model="dialogm1" column>
                <v-radio
                  v-for="(playlist, key) in playlists"
                  :key="key"
                  :label="playlist.name"
                  :value="playlist.id"
                ></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click="dialogAddToPlaylist = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-flex sm12>
          <h3>{{ playlist.name }}</h3>
        </v-flex>
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
                :loading="dataLoading"
                v-model="table.selected"
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
                    <v-btn
                      fab
                      dark
                      color="indigo"
                      small
                      @click.stop="showAddToPlaylistDialog(props.item.id)"
                    >
                      <v-icon dark>add</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="primary"
                      small
                      @click.stop="getTrack(props.item.id)"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="pink"
                      small
                      @click.stop="showTrackDeleteConfirmation(props.item.id)"
                    >
                      <v-icon>delete</v-icon>
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
import { Items as Users } from "@/api/user"
import UploadButton from "vuetify-upload-button"
export default {
  components: {
    "upload-btn": UploadButton
  },

  data() {
    return {
      dataLoading: false,
      dialogUpload: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogAddToPlaylist: false,
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
      },

      newTrack: null,
      formData: FormData,
      trackUploadLoading: false,

      track: {},
      playlists: [],
      playlist: {}
    }
  },

  mounted() {
    this.getPlaylist(this.$route.params.id)
    this.getPlaylists()
  },

  methods: {
    /**
     * Get specific playlist info, including tracks for table.
     */
    getPlaylist(id) {
      this.dataLoading = true
      axios.get("/api/playlists/" + id).then(response => {
        this.dataLoading = false
        this.playlist = response.data
        this.table.items = response.data.tracks
      })
    },

    /**
     * Get playlists for autocomplete component
     */
    getPlaylists() {
      axios.get("/api/playlists").then(response => {
        this.playlists = response.data.playlists
      })
    },

    /**
     * Get specific track info
     */
    getTrack(id) {
      this.dialogEdit = true
      axios.get("/api/tracks/" + id).then(response => {
        this.track = response.data
      })
    },

    /**
     * Show track deleting confirmation modal.
     */
    showTrackDeleteConfirmation(id) {
      this.dialogDelete = true
      axios.get("/api/tracks/" + id).then(response => {
        this.track = response.data
      })
    },

    /**
     * Update track info
     */
    updateTrack(id) {
      this.dialogEdit = false
      axios.put("/api/tracks/" + id + "/update", this.track).then(response => {
        this.getPlaylist(this.$route.params.id) // refresh table
        this.track = {} // empty dialog form
      })
    },

    /**
     * Delete given track
     */
    deleteTrack(id) {
      this.dialogDelete = false
      axios.delete("api/tracks/" + id).then(response => {
        this.getPlaylist() // refresh table
        this.track = {} // mepty dialog form
      })
    },

    showAddToPlaylistDialog(id) {
      this.dialogAddToPlaylist = true
    },

    /**
     * Prepare track for uploading
     */
    prepareTrack(file) {
      // handle file here. File will be an object.
      // If multiple prop is true, it will return an object array of files.
      this.formData = new FormData()
      this.formData.append("track", file)
      this.formData.append("playlist_id", this.playlist.id)
    },

    /**
     * Upload track
     */
    uploadTrack() {
      this.trackUploadLoading = true
      axios.post("/api/tracks", this.formData).then(response => {
        this.trackUploadLoading = false
        this.dialogUpload = false
        this.$refs.uploadButton.clear()
        this.getPlaylist(this.$route.params.id)
      })
    },

    formatDurationTime() {
      let duration = this.playlist.total_duration.split(":")
      return duration[0] + ' hrs ' + duration[1] + ' mins ' 
    }
  }
}
</script>
