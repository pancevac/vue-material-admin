import { AuthLayout, DefaultLayout } from "@/components/layouts"

export const publicRoute = [
  { path: "*", component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/NotFound.vue") },
  {
    path: "/auth",
    component: AuthLayout,
    meta: { title: "Login", guest: true },
    redirect: "/auth/login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "login",
        meta: { title: "Login", guest: true },
        component: () => import(/* webpackChunkName: "login" */ "@/views/auth/Login.vue")
      }
    ]
  },

  {
    path: "/404",
    name: "404",
    meta: { title: "Not Found" },
    component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/NotFound.vue")
  },

  {
    path: "/500",
    name: "500",
    meta: { title: "Server Error" },
    component: () => import(/* webpackChunkName: "errors-500" */ "@/views/error/Error.vue")
  }
]

export const protectedRoute = [

  // App
  {
    path: "/",
    component: DefaultLayout,
    meta: { title: "Home", group: "apps", icon: "" },
    redirect: "/home",
    children: [
      {
        path: "/403",
        name: "Forbidden",
        meta: { title: "Access Denied", hiddenInMenu: true },
        component: () => import(/* webpackChunkName: "error-403" */ "@/views/error/Deny.vue")
      },

      {
        path: "/home",
        name: "home",
        meta: { title: "Home", group: "apps" },
        component: () => import(/* webpackChunkName: "error-403" */ "@/views/Home.vue")
      },

      {
        path: "/playlists",
        name: "playlists",
        meta: { title: "Latest Playlists", group: "apps" },
        component: () => import(/* webpackChunkName: "error-403" */ "@/views/list/Playlists.vue")
      },

      {
        path: "/playlists/:id",
        name: "playlist",
        meta: { title: "Playlist", group: "apps" },
        component: () => import(/* webpackChunkName: "error-403" */ "@/views/list/Playlist.vue")
      },

      {
        path: "/tracks",
        name: "tracks",
        meta: { title: "Latest tracks", group: "apps" },
        component: () => import(/* webpackChunkName: "error-403" */ "@/views/list/Tracks.vue")
      }
    ]
  },

  // My music
  {
    path: "/my-music",
    component: DefaultLayout,
    redirect: "/my-music/playlists",
    meta: { title: "My Music", icon: "view_compact", group: "profile", auth: true },
    children: [
      {
        path: "/my-music/my-profile",
        name: "my-profile",
        meta: { title: "My Profile", group: "profile", icon: "profile", auth: true },
        component: () => import(/* webpackChunkName: "dashboard" */ "@/views/form/User.vue")
      },
      {
        path: "/my-music/playlists",
        name: "my_playlists",
        meta: { title: "Playlists", group: "profile", auth: true },
        component: () => import(/* webpackChunkName: "table" */ "@/views/list/MyPlaylists.vue"),
      },
      {
        path: "/my-music/playlists/:id",
        name: "my_playlist",
        meta: { title: 'Playlist', group: "profile", auth: true },
        component: () => import("@/views/list/MyPlaylist.vue")
      }
    ]
  },

]
