const Menu = [
  { header: "App" },
  {
    title: "Home",
    group: "apps",
    icon: "home",
    name: "home"
  },
  {
    title: "Latest tracks",
    group: "apps",
    icon: "audiotrack",
    name: "tracks"
  },

  { header: "My Music", protected: true },
  {
    title: "My Profile",
    group: "profile",
    icon: "dashboard",
    name: "my-profile"
  },
  {
    title: "My playlists",
    group: "profile",
    icon: "fa-list",
    name: 'my_playlists',
  },
  {
    title: "My unattached tracks",
    group: "profile",
    icon: "audiotrack"
  },
]
// reorder menu
Menu.forEach(item => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase()
      let textB = y.title.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
  }
})

export default Menu
