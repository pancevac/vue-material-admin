<template>
  <v-list-tile-content>
    <v-list-tile-title>{{ trackInfo.name }}</v-list-tile-title>
    <v-list-tile-sub-title>{{ trackInfo.artist }}</v-list-tile-sub-title>
  </v-list-tile-content>
</template>

<script>
export default {
  props: {
    trackInfo: Object
  }
}
</script>
