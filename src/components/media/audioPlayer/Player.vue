<template>
  <v-bottom-sheet inset>
    <template v-slot:activator>
      <v-btn color="red" dark>Show player</v-btn>
    </template>
    <v-card tile>
      <v-progress-linear :value="50" class="my-0" height="3"></v-progress-linear>

      <v-list>
        <v-list-tile>
          <player-info :track-info="currentTrack"></player-info>

          <v-spacer></v-spacer>

          <v-btn flat icon @click="toggleMute">
            <template v-if="!this.muted">
              <v-icon v-if="this.volume >= 0.5">volume_up</v-icon>
              <v-icon v-else-if="this.volume > 0">volume_down</v-icon>
              <v-icon v-else>volume_mute</v-icon>
            </template>
            <v-icon v-show="this.muted">volume_off</v-icon>
          </v-btn>

          <v-slider v-model="volume" @input="updateVolume(volume)" max="1" step="0.1"></v-slider>
          {{this.volume * 100 + '%'}}
          <v-list-tile-action>
            <v-btn icon @click="skip('prev')">
              <v-icon>fast_rewind</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-action :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
            <v-btn v-if="!playing" icon @click="play()">
              <v-icon>play_arrow</v-icon>
            </v-btn>
            <v-btn v-else icon @click="pause()">
              <v-icon>pause</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
            <v-btn icon @click="skip('next')">
              <v-icon>fast_forward</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import { Howl, Howler } from "howler"
import PlayerInfo from "./PlayerInfo"

export default {
  name: "audio-player",

  components: {
    PlayerInfo
  },

  props: {
    tracks: Array,
    playThisTrack: Object
  },

  data() {
    return {
      songs: [],
      index: 0,
      playing: false,
      selectedTrack: null,
      volume: 0.5,
      muted: false
    }
  },

  created() {
    // Map howl object to tracks array...
    this.songs = this.tracks.map(track => ({
      ...track,
      howl: new Howl({
        src: [track.media_path]
      })
    }))

    Howler.volume(this.volume)
  },

  watch: {
    playThisTrack(track) {
      let selectedTrack = this.songs.filter(song => {
        return song.id == track.id
      })
      this.selectTrack(selectedTrack[0])
      this.play()
    }
  },

  computed: {
    currentTrack() {
      return this.songs[this.index]
    }
  },

  methods: {
    /**
     * Method for selecting track for playing
     */
    selectTrack(track) {
      this.selectedTrack = track
    },

    play(index) {
      let selectedTrackIndex = this.songs.findIndex(track => track === this.selectedTrack)

      if (typeof index === "number") {
        index = index
      } else if (this.selectedTrack) {
        if (this.selectedTrack != this.currentTrack) {
          this.stop()
        }
        index = selectedTrackIndex
      } else {
        index = this.index
      }

      let track = this.songs[index].howl

      if (track.playing()) {
        return
      } else {
        track.play()
      }

      this.selectedTrack = this.songs[index]
      this.playing = true
      this.index = index
    },

    pause() {
      this.currentTrack.howl.pause()
      this.playing = false
    },

    stop() {
      this.currentTrack.howl.stop()
      this.playing = false
    },

    skip(direction) {
      let index = this.index

      if (direction === "next") {
        index = this.index + 1
        if (index >= this.songs.length) {
          index = 0
        }
      } else {
        index = this.index - 1
        if (index < 0) {
          index = this.songs.length - 1
        }
      }

      this.skipTo(index)
    },

    skipTo(index) {
      if (this.currentTrack) {
        this.currentTrack.howl.stop()
      }

      this.play(index)
    },

    updateVolume(volume) {
      Howler.volume(volume)
    },

    toggleMute() {
      Howler.mute(!this.muted)
      this.muted = !this.muted
    }
  }
}
</script>
