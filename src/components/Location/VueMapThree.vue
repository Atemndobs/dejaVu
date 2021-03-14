<template>
  <vue-google-maps
    style="width: 100%; height: 300px"
    :map-config="mapConfig"
    :api-key="apiKey"
  ></vue-google-maps>
</template>

<script>
import VueGoogleMaps from "@point-hub/vue-google-maps";
export default {
  name: "VueMapThree",
  components: {
    VueGoogleMaps
  },

  data() {
    return {
     // apiKey: process.env.VUE_APP_GMAP_API_KEY,
      apiKey: 'AIzaSyAMmXVxuzlGe0c0g7HsX24kLAORxwbF88A',
      mapConfig: {
        zoom: 16,
        center: {
          lat: 51.017243,
          lng: 8.503972
        }
      }
    };
  }

}
</script>

<style scoped>

</style>
