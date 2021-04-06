<template>
  <div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' : ''">
    <main>
      <div class="search-box">
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          v-model="query"
          @keypress.enter="fetchWeather()"
        />
      </div>

      <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
        <div class="location-box">
          <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
          <div class="date">{{ dateBuilder() }}</div>
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(weather.main.temp) }}°c</div>
          <div class="weather">{{ weather.weather[0].main }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import axios from "axios";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "PageForecast",
  data () {
    return {
      api_key: 'd75bc4e671fb7b4d190dd8a7c789183c',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: 'Dusseldorf',
      searchCity:'',
      weather: {},
      polling: null,

    }
  },

  methods: {
    async fetchWeather () {
      let city = this.query===''?'Dusseldorf':this.query
      let apiUrl = process.env.API+'/weather/fetch/'+city

      let peak = JSON.stringify(this.$store.state.forecasts.dusseldorf.peak)

      console.log(peak)

      await axios.get(apiUrl)
        .then(response => {
          this.setResults(response.data)
          let temp = response.data.main.temp
          if ( temp >= peak){
            let message = `The temperature in ${city} now is ${temp} °C`
            this.showNotif(message, 'positive')
          }
        }).catch(error => {
        let message = `Please enter a valid City not ${city}`
        this.showNotif(message, 'red')
        console.log(`Wrong City :  ${city}`)
        console.log(`Error:  ${error}`)
      })

      this.query = ''
    },

    async getPeakForecast () {
      let city = this.query===''?'Dusseldorf':this.query
      let apiUrl = process.env.API+'/weather/peak'
      await axios.get(apiUrl)
        .then(response => {
          let temp = response.data.data.peak_temperature

          this.$store.commit('forecasts/setDusseldorf', {peak:temp})
        }).catch(error => {
        let message = `Please enter a valid City not ${city}`
        this.showNotif(message, 'red')
        console.log(`Wrong City :  ${city}`)
        console.log(`Error:  ${error}`)
      })

      this.query = ''
    },
    setResults (results) {
      this.weather = results;
    },
    dateBuilder () {
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    },

    pollData () {
      this.polling = setInterval(() => {
        //this.$store.dispatch('RETRIEVE_DATA_FROM_BACKEND')
        this.fetchWeather()
      }, 900000)
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
    }
  },

  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters({
      peak :'forecasts/dusseldorf'
    }),

    ...mapActions(['forecasts/getPeak']),

    forecast() { return this.$store.state.forecasts }
  },

  mounted() {
   this.fetchWeather()
  },
  created () {
    this.pollData()
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'montserrat', sans-serif;
}
#app {
  background-image: url('../../statics/images/cold-bg.jpg');
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}
#app.warm {
  background-image: url('../../statics/images/warm-bg.jpg');
}
main {
  min-height: 100vh;
  padding: 25px;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75));
}
.search-box {
  width: 100%;
  margin-bottom: 30px;
}
.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;

  color: #313131;
  font-size: 20px;
  appearance: none;
  border:none;
  outline: none;
  background: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}
.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px 0px 16px 0px;
}
.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}
.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}
.weather-box {
  text-align: center;
}
.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 102px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color:rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
.weather-box .weather {
  color: #FFF;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
</style>
