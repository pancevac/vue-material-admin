import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import router from "./router/"
import store from "./store"
import config from "./config"
import "./registerServiceWorker"
import "roboto-fontface/css/roboto/roboto-fontface.css"
import "font-awesome/css/font-awesome.css"

// axios.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.auth.getToken();

window.axios = require("axios")
window.axios.defaults.baseURL = config.baseUrl

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
