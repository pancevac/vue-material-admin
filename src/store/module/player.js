const player = {

  namespaced: true,

  state: {
    show: false,
    playlist: [],
    playing: false,
    playThisTrack: null,
    currentTrack: null,
  },

  getters: {
    /**
     * Should player popup.
     */
    isShown: state => {
      return state.show
    },

    /**
     * Get tracks loaded into player
     */
    getPlaylist: state => {
      return state.playlist
    },

    /**
     * Is player playing tracks.
     */
    isPlaying: state => {
      return state.isPlaying
    },

    /**
     * Get track that needs to be played.
     */
    playThisTrack: state => {
      return state.playThisTrack
    },

    /**
     * Show current track
     */
    getCurrentTrack: state => {
      return state.currentTrack
    }
  },

  mutations: {
    
    /**
     * Toggle player show property.
     */
    setShow: (state, status) => {
      state.show = status
    },

    /**
     * Load playlist into player.
     */
    loadPlaylist: (state, playlist) => {
      state.playlist = playlist
    },

    /**
     * Set is player playing.
     */
    startPlaying: (state, isPlaying) => {
      state.playing = isPlaying
    },

    /**
     * Set track that needs to be played.
     */
    setPlayThisTrack: (state, track) => {
      state.playThisTrack = track
    },

    /**
     * Set current track
     */
    setCurrentTrack: (state, track) => {
      state.currentTrack = track
    }

  },

  actions: {

    setShow: (context, status) => {
      context.commit("setShow", status)
    },

    loadPlaylist: (context, playlist) => {
      context.commit("loadPlaylist", playlist)
    },

    startPlaying: (context, isPlaying) => {
      context.commit("startPlaying", isPlaying)
    },

    setPlayThisTrack: (context, track) => {
      context.commit("setPlayThisTrack", track)
    },

    setCurrentTrack: (context, track) => {
      context.commit("setCurrentTrack", track)
    }
  }
}

export default player