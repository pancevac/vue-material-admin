import Vue from "vue"
import Vuex from "vuex"

// import modules
import auth from "./store/module/auth"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth
  },
  state: {},
  mutations: {},
  actions: {}
})
