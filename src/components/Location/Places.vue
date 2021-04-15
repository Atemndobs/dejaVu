<template>
  <div>
    <input type="text" v-model="location">
    <ul>
      <li v-for="(result, i) in searchResults" :key="i">
        {{ result }} // list of all places
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Places",
  data: () => ({
    location: '',
    searchResults: [],
    service: null // will reveal this later 🕵️
  }),
  metaInfo () {
    return {
      script: [{
        src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyAEY8cTidLT9lqWSUAP4v1-ZUL0dH6g5_I&libraries=places`,
        async: true,
        defer: true,
        callback: () => this.MapsInit() // will declare it in methods
      }]
    }
  },
  methods: {
    MapsInit () {
      this.service = new window.google.maps.places.AutocompleteService()
    },
    displaySuggestions (predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.searchResults = []
        return
      }
      this.searchResults = predictions.map(prediction => prediction.description)
    }
  },

  // the magical part
  watch: {
    location (newValue) {
      if (newValue) {
        this.service.getPlacePredictions({
          input: this.location,
          types: ['(cities)']
        }, this.displaySuggestions)
      }
    }
  }
}
</script>

<style scoped>

</style>
