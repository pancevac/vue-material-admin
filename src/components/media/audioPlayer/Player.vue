<template>
  <v-bottom-sheet inset persistent hide-overlay v-model="show">
    <v-card tile>
      <v-hover>
        <v-progress-linear
          slot-scope="{ hover }"
          v-if="hover"
          v-model="trackProgress"
          @click="updateSeek($event)"
          class="my-0"
          height="13"
        ></v-progress-linear>
        <v-progress-linear
          v-else
          v-model="trackProgress"
          @click="updateSeek($event)"
          class="my-0"
          height="3"
        ></v-progress-linear>
      </v-hover>

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

          <div style="margin-left:15px">{{this.volume * 100 + '%'}}</div>

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

          <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
            <v-btn flat icon @click="toggleLoop">
              <v-icon color="light-blue" v-if="this.loop">repeat_one</v-icon>
              <v-icon color="blue-grey" v-else>repeat_one</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
            <v-btn flat icon @click="toggleShuffle">
              <v-icon color="light-blue" v-if="this.shuffle">shuffle</v-icon>
              <v-icon color="blue-grey" v-else>shuffle</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp}">
            <v-btn flat icon @click="showPlaylist">
              <v-icon>fa-list</v-icon>
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

  data() {
    return {
      songs: [],
      index: 0,
      playing: false,
      selectedTrack: null,
      volume: 0.5,
      muted: false,
      loop: false,
      shuffle: false,
      seek: 0
    }
  },

  watch: {

    currentTrack(track) {
      this.$store.dispatch("player/setCurrentTrack", track)
    },

    playThisTrack(track) {
      let selectedTrack = this.songs.filter(song => {
        return song.id == track.id
      })
      this.selectTrack(selectedTrack[0])
      this.play()
    },

    playing(playing) {
      this.seek = this.currentTrack.howl.seek()
      let updateSeek
      if (playing) {
        updateSeek = setInterval(() => {
          this.seek = this.currentTrack.howl.seek()
        }, 250)
      } else {
        clearInterval(updateSeek)
      }
    },

    getPlaylist(playlist) {
      // Map howl object to tracks array...
      this.songs = playlist.map(track => ({
        ...track,
        howl: new Howl({
          src: [track.media_path],
          onend: () => {
            if (this.loop) {
              this.play(this.index)
            } else {
              this.skip("next")
            }
          }
        })
      }))

      Howler.volume(this.volume)
    }
  },

  computed: {
    currentTrack() {
      return this.songs[this.index]
    },

    progress() {
      if (this.currentTrack.howl.duration() === 0) return 0
      return this.seek / this.currentTrack.howl.duration()
    },

    trackProgress() {
      return this.progress * 100
    },

    /**
     * @see https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
     */
    show: {
      get() {
        return this.$store.getters["player/isShown"]
      },
      set(value) {
        return this.$store.dispatch("player/setShow", value)
      }
    },

    getPlaylist() {
      return this.$store.getters["player/getPlaylist"]
    },

    playThisTrack() {
      return this.$store.getters["player/playThisTrack"]
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
      let index = this.index,
        lastIndex = this.songs.length - 1

      if (this.shuffle) {
        index = Math.round(Math.random() * lastIndex)
        while (index === this.index) {
          index = Math.round(Math.random() * lastIndex)
        }
      } else if (direction === "next") {
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
    },

    toggleLoop() {
      this.loop = !this.loop
    },

    toggleShuffle() {
      this.shuffle = !this.shuffle
    },

    updateSeek(event) {
      let el = document.querySelector(".v-progress-linear__bar"),
        mousePos = event.offsetX,
        elWidth = el.clientWidth,
        percents = (mousePos / elWidth) * 100
      this.setSeek(percents)
    },

    setSeek(percents) {
      let track = this.currentTrack.howl

      if (track.playing()) {
        track.seek((track.duration() / 100) * percents)
      }
    },

    showPlaylist() {
      //
    }
  }
}
</script>
