<template xmlns="http://www.w3.org/1999/html">

  <div  class="q-gutter-x-lg">
    <!--    <q-media-player
          type="video"
          background-color="black"
          :muted="muted"
          radius="1rem"
          :autoplay="true"
          :show-big-play-button="true"
          :sources="video.sources"
          :poster="video.poster"
          :tracks="video.tracks"
          track-language="English"
          @ended="onEnded"
          ref="myPlayer"
        >
          <template v-if="overlay" v-slot:overlay>
            <div>
              <img
                src="../statics/avat_atem.png"
                style="width: 30vw; max-width: 50px; opacity: 0.25;"
              >
            </div>
          </template>
        </q-media-player>-->

    <div
      class="q-gutter-x-lg q-pa-lg"
      v-if="!loadingSongs && songs.length">
      <div>

        <q-media-player
          type="audio"
          background-color="black"
          :muted="muted"
          :autoplay="false"
          :show-big-play-button="true"
          :sources="this.audio.sources"
          @ended="onEnded"
          ref="myAudio"
          id="track"
          style="max-width: 600px"
          radius="0rem"
          dense
          padding="m"
        >

          <template v-if="overlay" v-slot:overlay>
            <div>
              <img
                src="../statics/avat_atem.png"
                style="width: 30vw; max-width: 50px; opacity: 0.25;"
              >
            </div>
          </template>
        </q-media-player>

        <div v-if="play">
          <q-spinner-audio size="md"/>
        </div>
       <q-space/>
      </div>
      <q-btn v-if="play" label="Pause" icon-right="eva-play-circle-outline" color="blue" @click="control"></q-btn>
      <q-btn v-else label="Play" icon-right="eva-pause-circle" color="teal" @click="control"></q-btn>
      <q-btn label="next" icon-right="eva-skip-forward-outline"color="purple" @click="nextSong()"></q-btn>
      <q-btn label="Analyse" :icon-right="ionPulse" color="purple" @click="upload"></q-btn>
    </div>
    <div
      class="q-gutter-x-lg q-pa-lg q-mt-lg-lg"
      v-else-if="loadingSongs && !songs.length">

      <h5 class="text-center text-grey">
        No Songs Uploaded Yet...
      </h5>
    </div>




    <div class="q-gutter-x-lg q-pa-lg">

      <div >
        <q-uploader
          url="https://api.next-song.app/v1/songs"
          label="Max total upload size (2GB)"
          max-files="100"
          multiple
          batch
          style="max-width: 600px"
          max-total-size="2147483648"
          @rejected="onRejected"
          bordered
          :factory="factoryFn"
          @click.prevent="upload"
        />
      </div>
    </div>
    <Soundcloud class="q-pa-lg"/>
  </div>


</template>


<script >
import {ionPulseSharp} from '@quasar/extras/ionicons-v5'
import { matMenu } from '@quasar/extras/material-icons'
import { mdiAbTesting } from '@quasar/extras/mdi-v5'
import { fasFont } from '@quasar/extras/fontawesome-v5'
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'
import axios from "axios";
import Soundcloud from "../components/music/Soundcloud";
Vue.use(Plugin)
export default {
  name: 'PageAudio',
  components: {Soundcloud},
  data() {
      return {
        songs:[],
        sources:[],
        loadingSongs: false,
        onEnded:true,
        overlay:true,
        muted:true,
        play:false,
        next:false,
        video: {
          label: 'Song from Song API',
          poster: '',
          sources: [
            {
              src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
              type: 'video/mp4'
            }
          ],
          tracks: [

          ]
        },
        audio: {
          sources: [
            {
              src: '',

              type: 'audio/mp3'
            }
          ]
        }
      }
    },
  created () {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
    this.fasFont = fasFont
    this.ionPulse = ionPulseSharp
    this.getAudio()
    // console.log('AUDIO SOURCES::')
    // this.audio.sources = this.sources
    // console.log(this.audio.sources)

  },

  methods : {
    getAudio(){
      this.loadingSongs = true;
      const apiUrl = "https://api.next-song.app/v1/songs"
      let sources = [
        {
          src: 'empty',

          type: 'audio/mp3'
        }
      ]
      axios.get(apiUrl)
        .then(response => {
         // console.log(' SONGS ::')
         // console.log(response.data)
          let songs = response.data.data
          this.songs = songs
          songs.map((song)  => {

            let source = {}
            let src = song.path
            let type = 'audio/mp3'
            source = {
              src: src,
              type: type
            }

            this.sources.push(source)
            this.loadingSongs = false;
          })
        //  console.log('THIS SOURCES ==>')
          console.log(this.sources)
        })
        .catch(error => {
          console.log(error)
        })
    },
    control(){
      if (this.play){
        this.$refs.myAudio.pause()
        this.play = false
      }else {
        this.$refs.myAudio.play()
        this.play = true
      }
    },
    nextSong() {
      console.log('CLICKED NEXT SONG')
      if (this.next){
       // this.$refs.myAudio.play()
        this.next = false
      }else {
       // this.$refs.myAudio.play()
        this.next = true
      }
    },
    onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    factoryFn (files) {
      // returning a Promise

      return new Promise((resolve) => {
        // console.log('FACTOR FN')
       // console.log(resolve)
        // simulating a delay of 2 seconds
        this.getAudio()
        files = ''
        setTimeout(() => {
          resolve({
            url: 'https://api.next-song.app/v1/songs'
          })
        }, 100)
      })
    },

    upload(){
      this.loadingSongs = true
      const apiUrl = "https://api.next-song.app/songs"

      axios.post(apiUrl)
        .then(response => {
          console.log(' AUDIO ::')
          console.log(response.data)
          this.options = response.data.message
          let src = ''
          let source
          source = {
            src: src,
            type:'audio/mp3'
          }

        })
        .catch(error => {
          console.log(error)
        })
    },
  },

    mounted() {
     // this.getAudio();

    },

};
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>
