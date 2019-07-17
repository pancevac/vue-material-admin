import Auth from "../../plugins/auth/Auth"
import Vue from "vue"

Vue.use(Auth)

const auth = {

  namespaced: true,

  state: {
    user: null,
    access_token: Vue.auth.getToken(),
    is_auth: Vue.auth.isAuth(),
  },

  getters: {
    /**
     * Get auth user.
     */
    getUser: state => {
      return state.user
    },

    /**
     * Get access token
     */
    getAccessToken: state => {
      return state.access_token
    },

    /**
     * Check if user is authentificated.
     */
    isAuth: state => {
      return state.is_auth
    },
  },

  mutations: {
    
    /**
     * Set auth user.
     */
    setUser: (state, user) => {
      state.user = user
    },

    /**
     * Set access token on store and in local storage.
     */
    setAccessToken: (state, payload) => {
      state.access_token = payload.token // Set state
      Vue.auth.setToken(                 // Set localstorage
        payload.token, 
        payload.expires_in + Date.now()
      )
    },

    /**
     * Destroy access token from store and local storage.
     */
    destroyAccessToken: state => {
      Vue.auth.destroyToken(),
      state.access_token = null
    }

  },

  actions: {

    setUser: (context, user) => {
      context.commit('setUser', user)
    },

    setAccessToken: (context, payload) => {
      context.commit('setAccessToken', payload)
    },

    destroyAccessToken: context => {
      context.commit('destroyAccessToken')
    }
  }
}

export default auth