import Vue from "vue"
import Router from "vue-router"
import { publicRoute, protectedRoute } from "./config"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import store from "../store";
const routes = publicRoute.concat(protectedRoute)

Vue.use(Router)
const router = new Router({
  mode: "hash",
  linkActiveClass: "active",
  routes: routes
})
// router gards
router.beforeEach((to, from, next) => {
  NProgress.start()
  
  // Login route, check if user is already auth
  if (to.matched.some(record => record.meta.guest)) {
    store.getters['auth/isAuth'] ? 
      next('/') :
      next()
  }

  // pages that requires auth user
  if (to.matched.some(record => record.meta.auth)) {
    store.getters['auth/isAuth'] ? 
    next() :
    next({name: 'login'})
  }

  //auth route is authenticated
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
