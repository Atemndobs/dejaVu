<template xmlns="http://www.w3.org/1999/html">

  <div  class="q-gutter-x-lg">
    <q-spinner-ball/>
        <q-media-player
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
          ref="videoPlayer"
        >
          <template v-if="overlay" v-slot:overlay>
            <div>
              <img
                src="../../public/atem_logo.png"
                style="width: 30vw; max-width: 50px; opacity: 0.25;"
              >
            </div>
          </template>
        </q-media-player>

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
Vue.use(Plugin)
export default {
  name: 'PageVideo',
  data() {
      return {
        sources:[],
        videos:[],
        loadingSongs: false,
        onEnded:true,
        overlay:true,
        muted:true,
        play:false,
        next:false,
        video: {
          label: 'Tears of Steel',
          poster: '',
          sources:[],
/*          sources: [
            {
              // src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
              // src: 'http://localhost:8000/api/v1/stream',
              src: 'http://localhost:8000/storage/pex_vid_1.mp4',
              type: 'video/mp4'
            }
          ],*/
          tracks: [
     /*       {
              src: 'media/TearsOfSteel/TOS-en.vtt',
              kind: 'subtitles',
              srclang: 'en',
              label: 'English'
            },*/

          ]
        }
      }
    },
  created () {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
    this.fasFont = fasFont
    this.ionPulse = ionPulseSharp
  },

  methods : {
    getVideo(){
      this.loadingSongs = true;
      const apiUrl = "http://localhost:8000/api/v1/videos"
      let sources = [
        {
          src: 'empty',

          type: 'video/mp4'
        }
      ]
      axios.get(apiUrl)
        .then(response => {
         // console.log(' SONGS ::')
         // console.log(response.data)
          let videos = response.data
          this.videos = videos
        //  console.log(response.data)
          videos.map((video)  => {

            let source = {}
            let src = video.path
            let type = 'video/mp4'
            source = {
              src: src,
              type: type
            }

            this.video.sources.push(source)
            this.loadingSongs = false;

          })
        //  console.log('THIS SOURCES ==>')
          console.log(this.sources)
        })
        .catch(error => {
          console.log(error)
        })
    },
  },

    mounted() {
      this.getVideo();
    },

};
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>
