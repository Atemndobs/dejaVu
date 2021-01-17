<template>
  <div class="q-pa-xl-lg">
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

    <q-media-player
      type="audio"
      background-color="black"
      :muted="muted"
      :autoplay="false"
      :show-big-play-button="true"
      :sources="audio.sources"
      @ended="onEnded"
      ref="myAudio"
      id="track"
      style="max-width: 600px"
      radius="1rem"
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
    <q-btn v-if="play" label="Pause" icon-right="eva-play-circle-outline" color="blue" @click="control">
    </q-btn>
    <q-btn v-else label="Play" icon-right="eva-pause-circle" color="teal" @click="control">
    </q-btn>
    <q-btn label="Analyse" :icon-right="ionPulse" color="purple" @click="checkBpm"></q-btn>

    <div >
      <div class="q-gutter-x-lg row items-start">

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
          @click.prevent="upload"
          :factory="factoryFn"
        />
      </div>
    </div>
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
import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
import axios from "axios";
Vue.use(Plugin)
export default {
  name: 'PageAudio',
    data() {
      return {
        onEnded:true,
        overlay:true,
        muted:true,
        play:false,
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
              src: 'https://api.next-song.app/storage/NHhzfv5U7Ykzt0EgBIzogQ0GsKYALfPF1ABomF9W.mp3',

              type: 'audio/mp3'
            }
          ]
        }
      }
    },

    methods:{
      getAudio(){
        const apiUrl = "https://api.next-song.app/v1/songs"
        let  header = {
          headers: {
            "Access-Control-Allow-Origin": "*"
            /*            "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"*/
          }
        }

        axios.get(apiUrl)
          .then(response => {
            console.log(' SONGS ::')
            console.log(response.data)
            this.audio.sources.src = response.data.data[0].path

            console.log(this.audio.sources.src)

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
      checkBpm(){

      },
      onRejected (rejectedEntries) {
        // Notify plugin needs to be installed
        // https://quasar.dev/quasar-plugins/notify#Installation
        this.$q.notify({
          type: 'negative',
          message: `${rejectedEntries.length} file(s) did not pass validation constraints`
        })
      },

      upload(){
        const apiUrl = "https://api.next-song.app/songs"

        console.log(this.formFields)

        axios.post(apiUrl)
          .then(response => {
            console.log(' AUDIO ::')
            console.log(response.data)
            this.options = response.data.message
            // Handle Code here

          })
          .catch(error => {
            console.log(error)
          })
      },

      factoryFn (files) {
        // returning a Promise
        console.log(files)
        return new Promise((resolve) => {
          console.log(resolve)
          // simulating a delay of 2 seconds
          setTimeout(() => {
            resolve({
              url: 'https://api.next-song.app/v1/songs'
            })
          }, 100)
        })
      }
    },
  created () {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
    this.fasFont = fasFont
    this.ionPulse = ionPulseSharp
  },
    mounted() {
      this.getAudio();
    },

};
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>
