import Vue from "vue"
import Vuex from "vuex"

// import modules
import auth from "./store/module/auth"
import player from "./store/module/player"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    player
  },
  state: {},
  mutations: {},
  actions: {}
})
