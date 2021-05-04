<template>
  <q-layout view="lHh Lpr lFf">

    <q-header
      bordered
      class="bg-white text-grey-10">
      <q-toolbar class="constrain">

<!--        <q-btn
          class="large-screen-only q-mr-sm"
          to="/camera"
          icon="eva-camera-outline"
          round
          text-color="black"
          size="18px"
          dense
          flat
        />-->

        <q-item :offset="fabPos" :disable="draggingFab">
          <q-fab
            icon="menu"
            direction="down"
            text-color="black"
            flat
            padding="xs"
            color="black"

          >
            <div>

              <q-btn
                to="/weather/forecast"
                icon="eva-sun"
                round
                :size="iconSize"
                dense
                flat
                color="black"
                :style="menuButtonColor"
              />
              <q-btn
                to="/price"
                icon="eva-bell-outline"
                round
                text-color="black"
                size="13px"
                dense
                flat
                :style="menuButtonColor"
              />
              <q-btn
                class="q-mr-sm"
                to="/settings"
                icon="settings"
                round
                text-color="black"
                size="15px"
                dense
                flat
                :style="menuButtonColor"
                v-show="this.$auth.check() && this.$auth.user().role === 1"
              />
              <q-btn
                to="/video"
                icon="eva-video-outline"
                round
                text-color="black"
                size="13px"
                dense
                flat
                :style="menuButtonColor"
              />
              <q-btn
                to="/stream"
                icon="eva-tv"
                round
                text-color="black"
                size="13px"
                dense
                flat
                :style="menuButtonColor"
              />
              <q-btn
                to="/audio"
                icon="eva-headphones-outline"
                round
                text-color="black"
                size="13px"
                dense
                flat
                :style="menuButtonColor"
              />
              <q-separator
                class="large-screen-only"
                vertical
                spaced
              />

            </div>
          </q-fab>
        </q-item>

       <q-separator
          class="large-screen-only"
          vertical
          spaced
        />
        <q-toolbar-title
          class="text-grand-hotel text-capitalise text-bold "
         @click="goHome"
          style="position: center"
        >
          DejaVu
        </q-toolbar-title>

        <q-item v-if="!this.$auth.check()">
          <q-item-section >
            <q-btn
              to="/login"
              icon="login"
              round
              text-color="black"
              :size="iconSize"
              dense
            />
          </q-item-section>
        </q-item >

        <q-item
          v-else
          icon="menu"
          direction="left"
          text-color="black"
          flat
          padding="xs"
        >
          <q-btn external-label label-position="left"
                 to="/camera"
                 icon="eva-camera-outline"
                 text-color="black"
                 :size="iconSize"
                 rounded
                 dense
                 color="amber-1"
                 label=""
                 padding="xs"
                 flat
          />
          <q-btn external-label label-position="left"
                 to="/account/home"
                 icon="person"
                 text-color="black"
                 :size="iconSize"
                 rounded
                 dense
                 color="amber-1"
                 label=""
                 padding="xs"
                 flat
          />
          <q-btn external-label label-position="left"
                 to="/logout"
                 icon="logout"
                 round
                 text-color="black"
                 :size="iconSize"
                 dense
                 color="amber-1"
                 label=""
                 padding="xs"
                 flat
          />
          <q-btn external-label label-position="left"
                 to="/settings"
                 icon="settings"
                 round
                 text-color="black"
                 :size="iconSize"
                 dense
                 color="amber-1"
                 label=""
                 padding="xs"
                 flat
                 v-show="this.$auth.check() && this.$auth.user().role === 1"
          />
        </q-item>
      </q-toolbar>

    </q-header>
    <q-footer
      class="bg-white "
      bordered
      >

      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="constrain">
            <q-banner
              class="bg-primary text-white"
              inline-actions
              dense
            >

              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  icon="eva-camera-outline"
                  text-color="grey-10"
                  font-size="22ps"
                />


              </template>

              <b> Install DejaVu? </b>


              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  class="q-px-sm"
                  dense
                  flat
                  label="YES"
                />
                <q-btn
                  @click="showAppInstallBanner = false"
                  class="q-px-sm"
                  dense
                  flat
                  label="LATER"
                />
                <q-btn
                  @click="neverShowAppInstall"
                  class="q-px-sm"
                  dense
                  flat
                  label="NEVER"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
        <q-tabs
          class="text-grey-10 small-screen-only"
          active-color="primary"
          indicator-color="transparent"
          >
          <q-route-tab
            to="/"
            icon="eva-home-outline"
          />

          <q-route-tab
            to="/camera"
            icon="eva-camera-outline"
          />
        </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>

  </q-layout>

</template>

<script >
import axios from "axios";

let deferredPrompt;

window.Pusher = require('pusher-js');

import Echo from 'laravel-echo'
export default {
  name: 'MainLayout',
  data() {
    return {
      loggedInUser:'atem',
      showAppInstallBanner: false,
      fabPos: [ 18, 18 ],
      draggingFab: false,
      query:'',
      iconSize:'13px',
      menuButtonColor:'background: antiquewhite'
    }
  },
  mounted() {
    let neverShowAppInstall = this.$q.localStorage.getItem('neverShowAppInstall')
    if (!neverShowAppInstall) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {

        }, 3000)
        this.showAppInstallBanner = true
      });
    }

    this.pushEcho()
  // this.getForecast()
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.neverShowAppInstall()
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    },
    neverShowAppInstall(){
      this.showAppInstallBanner = false

      this.$q.localStorage.set('neverShowAppInstall', true)
    },
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    },

    getForecast () {
      let city = this.query===''?'Dusseldorf':this.query
      //     let apiUrl = `${this.url_base}weather?q=${city}&units=metric&APPID=${this.api_key}`
      let apiUrl = process.env.API+'/weather/forecast/'+city


      axios.get(apiUrl)
        .then(response => {
          let temp = response.data.current.temp

          console.log(response)
          if ( temp >= 13){
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

    liveForecast(data){
      JSON.stringify(data)

      let city = data.forecast.timezone
      let temp = data.forecast.actual.temp
      let message = `The forecast for  ${city} is ${temp} °C`
      this.showNotif(message, 'positive')
    },
    liveWeather(data){
      JSON.stringify(data)
      let city = data.weather.name
      let temp = data.weather.main.temp
      let message = `The current Temperature in ${city} is ${temp}°C`
      this.showNotif(message, 'teal')
    },
    livePeakForecast(data){
      JSON.stringify(data)
      let {temp, time, city} = {...data.peak}
      this.$store.commit('forecasts/setForecast',  {...data.peak})

      if (city === 'Dusseldorf'){
        this.$store.commit('forecasts/setDusseldorf', {peak:temp})
      }
      let message = `The warmest time for : ${time}  in ${city} with temperature :  ${temp} °C `

      const strDate = (new Date()).toString()
      if (time === strDate.substr(0, 24)){
        message = `Today's peak temperature of ${temp}°C in ${city} has been reached`
      }

      this.showNotif(message, 'teal')
    },
    liveDailyForecast(data){
      JSON.stringify(data)
      let {temp, time, city} = {...data}
      this.$store.commit('forecasts/setForecast',  {...data})

      if (city === 'Dusseldorf'){
        this.$store.commit('forecasts/setDusseldorf', {peak:temp})
      }
      let message = `The warmest time for : ${time}  in ${city} with temperature :  ${temp} °C `

      const strDate = (new Date()).toString()
      if (time === strDate.substr(0, 24)){
        message = `Today's peak temperature of ${temp}°C in ${city} has been reached`
      }

      this.showNotif(message, 'teal')
    },
    livePriceTracker(data){
      JSON.stringify(data)
      const {article, details} = {...data}
      let message = `The current Price of ${article} is ${details.price},
          specs:  ${details.spec}, color: ${details.color}, condition: ${details.condition}`
      this.showNotif(message, 'teal')
    },

    pushEcho(){
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'local',
        cluster: 'local',
        forceTLS: false,
        // wsHost:'127.0.0.1',
        wsHost:window.location.hostname,
        wsPort:6001,
        disableStats:true
      });

      let self = this

      const weatherChannel = window.Echo.channel('weather-channel');
      weatherChannel.listen('.App\\Events\\WeatherFetchEvent',
        function (data) {
        self.liveWeather(data)
        }
      );

      const forecastChannel = window.Echo.channel('forecast-channel');
      forecastChannel.listen('.App\\Events\\ForecastUpdatedEvent',
        function (data) {
        self.liveForecast(data)
        }
      );

      const dailyForecastChannel = window.Echo.channel('dailyForecast-channel');
      dailyForecastChannel.listen('.App\\Events\\DailyForecastEvent',
        function (data) {
        self.liveDailyForecast(data)
        }
      );

      const peakChannel = window.Echo.channel('peak-channel');
      peakChannel.listen('.App\\Events\\PeakTemperatureEvent',
        function (data) {
        self.livePeakForecast(data)
        }
      );

      const priceChannel = window.Echo.channel('price-channel');
      priceChannel.listen('.App\\Events\\PriceCheckEvent',
        function (data) {
        self.livePriceTracker(data)
        }
      );

    },
    pusherData() {
      const pusher = new Pusher(process.env.PUSHER.KEY, {
        cluster: 'eu'
      });
      let self = this


      const weatherChannel = pusher.subscribe('weather-channel');
      weatherChannel.bind('App\\Events\\WeatherFetchEvent',
        function (data){
          self.liveWeather(data)
        }
      )

      const forecastChannel = pusher.subscribe('forecast-channel');
      forecastChannel.bind('App\\Events\\ForecastUpdatedEvent',
        function (data){
          self.liveForecast(data)
        }
      )

      const peakChannel = pusher.subscribe('peak-channel');
      peakChannel.bind('App\\Events\\PeakTemperatureEvent',
        function (data){
          self.livePeakForecast(data)
        }
      )

      const priceChannel = pusher.subscribe('price-channel');
      priceChannel.bind('App\\Events\\PriceCheckEvent',
        function (data){
          self.livePriceTracker(data)
        }
      )

    },

    goHome(){
      if (this.$route.fullPath === '/'){
        return
      }
      this.$router.push('/')
    }
  },
  computed: {
    toggleDark: {
      get() {
        return this.$q.dark.isActive
      },
      set(val) {
        this.$q.dark.set(val)
      }
    }
  }
};
</script>

<style lang="sass">
  .q-toolbar
    @media (min-width: $breakpoint-sm-min)
      height: 77px
  .q-toolbar__title
    font-size: 30px
    @media (max-width: $breakpoint-xs-max)
      text-align: center

  .q-footer
    .q-tab__icon
      font-size: 30px
</style>
