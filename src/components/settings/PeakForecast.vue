<template>
  <div class="q-pa-md">
    <q-btn
      :color="color"
      :label="label"
      class="q-mt-md"
      @click="getPeakForecast"
    >
      <q-tooltip content-class="bg-accent">This Is going to generate forecast for thr next 24hours (Hourly) </q-tooltip>
    </q-btn>
    <q-input outlined v-model="query" label="City" @keypress.enter="getPeakForecast"/>
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
      label:'DAILY PEAK FORECAST',
      loading2: false,
      percentage2: 0,
      query:'',
      loading3: false,
      percentage3: 0,
      city:''
    }
  },
  methods: {
    getPeakForecast () {
      let city = this.query===''?'Dusseldorf':this.query
      let apiUrl = process.env.API+'/weather/peak?city='+city

      axios.get(apiUrl)
        .then(response => {
          let {temp, time, city} = {...response.data.data.peak}
          this.$store.commit('forecasts/setForecast',  {...response.data.data.peak})
          if (city === 'Dusseldorf'){
            this.$store.commit('forecasts/setDusseldorf',  {...response.data.data.peak})
          }
          let message = `The warmest time of the day : ${time}  in ${city} with temperature :  ${temp} °C `

          this.showNotif(message, 'positive')
          this.color = 'green'
        }).catch(error => {
        let message = `Please enter a valid City not ${city}`
        this.showNotif(message, 'red')
        console.log(`Error:  ${error}`)
      })

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

}
</script>

<style scoped>

</style>
