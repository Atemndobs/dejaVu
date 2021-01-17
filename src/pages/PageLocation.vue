// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <!--      <img src="https://cdn.quasar.dev/img/mountains.jpg">-->

      <q-card-section>
        <div class="text-h6">
          GPS position:<strong >{{position}}</strong>
        </div>
        <div class="text-subtitle2">
          latitude: <strong >{{latitude}}</strong>
        </div>
        <div class="text-subtitle2">
          longitude: <strong > {{longitude  }}</strong>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'

const { Geolocation } = Plugins

export default {
  data () {
    return {
      position: 'determining...',
      latitude: 'loading...',
      longitude: 'loading...'
    }
  },
  methods: {
    getCurrentPosition() {
      Geolocation.getCurrentPosition().then(position => {

        this.position = 'Your current position'
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        console.log('Current', position);

        console.log(this.latitude)
        console.log(this.longitude)

      });
    }
  },
  mounted () {
    this.getCurrentPosition()

    // we start listening
    this.geoId = Geolocation.watchPosition({}, (position, err) => {
      console.log('New GPS position')
      this.position = 'Your current position'
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude
    })
  },
  beforeDestroy () {
    // we do cleanup
    Geolocation.clearWatch(this.geoId)
  }
}
</script>
