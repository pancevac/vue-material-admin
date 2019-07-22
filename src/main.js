import Vue from "vue"
import "./plugins/vuetify"
import App from "./App.vue"
import router from "./router/"
import store from "./store"
import config from "./config"
import "./registerServiceWorker"
import "roboto-fontface/css/roboto/roboto-fontface.css"
import "font-awesome/css/font-awesome.css"
import VueSnackbar from 'vue-snack' 
import 'vue-snack/dist/vue-snack.min.css'

window.axios = require("axios")
window.axios.defaults.baseURL = config.baseUrl

if (store.getters['auth/isAuth']) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters['auth/getAccessToken'];
}

Vue.config.productionTip = false
Vue.use(VueSnackbar, {
  position: 'bottom-right',
  time: 6000,
  close: true 
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
