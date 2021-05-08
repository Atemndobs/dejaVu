<template>
  <div class="q-pa-md">
    <q-btn color="black" class="full-width" :label="danger" />

    <q-btn
      :color="color"
      :label="label"
      class="q-mt-md"
      @click="getForecast"
    >
      <q-tooltip content-class="bg-accent">This Is going to generate forecast for thr next 24hours (Hourly) </q-tooltip>
    </q-btn>
    <q-banner class="bg-grey-3">
      <template v-slot:avatar>
        <q-icon name="eva-umbrella-outline" color="primary" />
      </template>
      {{forecastBanner}}
      <template v-slot:action>
        <q-btn flat color="primary" :label="temp" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Forecast",
  data () {
    return {
      model: null,
      color:'teal',
      options: [],
      loading1: false,
      percentage1: 0,
      danger:'DAILY FORECAST',
      label:'GET FORECAST',
      loading2: false,
      percentage2: 0,
      query:'',
      loading3: false,
      percentage3: 0,
      forecastBanner:'Display Daily Forecast',
      temp:0
    }
  },
  methods: {
    getForecast () {
      let city = this.query===''?'Dusseldorf':this.query
      let apiUrl = process.env.API+'/weather/forecast/'+city

      axios.get(apiUrl)
        .then(response => {
          let temp = response.data.current.temp
          let message = `The temperature in ${city} now is ${temp} °C`
          this.showNotif(message, 'green')

          this.forecastBanner = `The temperature in ${city} now is ${temp} °C`
          this.temp =  temp+'°C'
          this.color = 'green'
        }).catch(error => {
        let message = `Please enter a valid City not ${city}`
        this.showNotif(message, 'red')
        console.log(`Error:  ${error}`)
      })

      console.log(JSON.stringify(this.$store.state.forecasts.dusseldorf))
      this.query = ''
    },
    showNotif (message , color) {
      this.$q.notify({
        message: message,
        color: color,
        progress: true,
        position: 'top',
        count:1,
        avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
        actions: [
          { label: 'Dismis',
            color: 'white',
            handler: () => { /!* ... *!/ }
          }
        ]
      })
    },
  },
  mounted() {
    console.log(JSON.stringify(this.$store.state.forecasts.dusseldorf))
  }
}
</script>

<style scoped>

</style>
