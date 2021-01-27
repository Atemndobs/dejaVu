<template>
  <div class="q-pa-md row items-start q-gutter-md" style="max-width: 600px">
<!--    <template>

      <div class="q-pa-md" style="max-width: 300px">
        <form @submit.prevent.stop="onSubmit(track, artist)" @reset.prevent.stop="onReset" class="q-gutter-md">
          <q-input
            ref="name"
            filled
            v-model="artist"
            label="Artist name *"
            hint="Soundcloud-user-name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'example mahaliamusic']"
          />

          <q-input
            ref="title"
            filled
            v-model="track"
            label="Song Title *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'example sober']"
          />

          <q-toggle v-model="accept" label="I accept the license and terms" />

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </form>
      </div>
    </template>-->

    <q-card class="my-card" flat bordered>
      <div class="text-overline text-orange-9 q-pa-lg"
      @click="showSearch = true"
      >{{ modalTitle }}
        <q-input v-if="showSearch" v-model="track" label="search song" stack-label dense @keydown.enter="onSubmit(track,'')"/>
        <template>

          <div class="q-pa-md q-gutter-md"
               v-for="(songLink, index) in foundSongs"
          >
            <q-btn color="teal" size="sm" :label="songLink" @click="alternative(songLink) ">
<!--              <q-badge color="blue" floating transparent>
                5
              </q-badge>-->
            </q-btn>
          </div>
        </template>
      </div>

      <q-img
        :src="song.thumbnail"
        style="width: 100vw; max-width: 350px; opacity: 100;"
      />
      <div
        class="q-gutter-x-lg q-pa-lg"
      >
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

          </q-media-player>

          <div v-if="play">
            <q-spinner-audio size="md"/>
          </div>
          <q-space/>
        </div>

        <q-btn v-if="play" label="Pause" icon-right="eva-play-circle-outline" color="blue" @click="control"></q-btn>
        <q-btn v-else label="Play" icon-right="eva-pause-circle" color="teal" @click="control"></q-btn>

      </div>
      <q-card-section>
        <div class="text-overline text-teal">{{this.song}}</div>
<!--        <div class="text-overline text-black  q-mt-sm q-mb-xs">Author : {{this.song.author.name}}</div>-->
        <div class="text-overline text-black  q-mt-sm q-mb-xs">Genre : {{this.song.genre}}</div>
        <div class="text-overline text-black  q-mt-sm q-mb-xs">Play Count : {{this.song.playCount}}</div>
        <div class="text-overline text-black  q-mt-sm q-mb-xs">Likes : {{this.song.likes}}</div>
        <div class="text-caption text-grey">
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" label="Details" />
        <q-space />

        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />

      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Description : {{this.song.description}}</div>
<!--            <div class="text-overline text-black  q-mt-sm q-mb-xs">Author : {{this.song.author.name}}</div>-->
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Title : {{this.song.title}}</div>
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Genre : {{this.song.genre}}</div>
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Play Count : {{this.song.playCount}}</div>
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Likes : {{this.song.likes}}</div>
            <div class="text-overline text-black  q-mt-sm q-mb-xs">Comments Count : {{this.song.commentsCount}}</div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>
<script>
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
  name: "Soundcloud",
  data () {
    return {
      alt:false,
      modalTitle:'SOUNDCLOUD SONGS',
      foundSongs:[],
      clientId : 'TaTmd2ARXgnp20a7BQJwuZ8xGFbrYgz5',
      showSearch:false,
      staticLink:'https://soundcloud.com/mahaliamusic/sober-acoustic',
      track: null,
      artist: null,
      accept: false,
      expanded: false,
      text:'Add text here',
      song:{},
      songs:[],
      sources:[],
      loadingSongs: false,
      onEnded:true,
      overlay:true,
      muted:true,
      play:false,
      audio: {
        sources: [
          {
            src: 'https://api.next-song.app/storage/music/zQHKlEb3tYlkzG4B9TKWAWjIj4ixKBw3gE4Mo0te.mp3',

            type: 'audio/mp3'
          }
        ]
      }
    }
  },

  methods : {
    onSubmit (title, artist) {

      let data = {
        'track': title,
        'artist': artist
      }
      console.log(data)
      axios.post('https://api.next-song.app/v1/soundclouds', data)
        .then(response => {
          this.track = null
          this.showSearch = false
          console.log(response.data.results)
          if (response.data.results.length > 1){
            this.foundSongs = response.data.results
            this.alt = true
            this.modalTitle = 'Did you mean'
          }
          const songLink = response.data.results[0]
          this.getSong(songLink)
        })
        .catch(error => {
          console.log(error)
        })

        // https://soundcloud.com/tiwasavageofficial/koroba"



     // this.$refs.name.validate()
     // this.$refs.age.validate()

/*      if (this.$refs.name.hasError || this.$refs.age.hasError) {
        this.formHasError = true
      }
      else if (this.accept !== true) {
        this.$q.notify({
          color: 'negative',
          message: 'You need to accept the license and terms first'
        })
      }
      else {

        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted'
        })
      }*/
    },
    alternative(songLink){
      this.getSong(songLink)

      this.foundSongs = []
      this.modalTitle = 'SOUNDCLOUD SONGS'
    //  this.showSearch = false

    },

    onReset () {
      this.name = null
      this.age = null

      this.$refs.name.resetValidation()
      this.$refs.title.resetValidation()
    },
    getSong(songLink = this.staticLink){

      //name = 'mahaliamusic', title = 'sober'
      const url = 'https://soundcloud.com/djatmblack/punjabi-vibes-atm-rmxmp3'
      const snake = 'https://soundcloud.com/jsnakemusic/stormzy-feat-burna-boy-ed-sheeran-own-it-jsnake-switch'
      const joro = 'https://soundcloud.com/wizkid-official/joro'
      const fullCrate = 'https://soundcloud.com/fullcrate/full-crate-falling-off'
      const soulection = 'https://soundcloud.com/soulection/jarreau-vandal-dont-think'
      const full2 = 'https://soundcloud.com/fullcrate/magnetic-ft-susan-carol-sergiio'
      const noah = 'https://soundcloud.com/goodboynoah/dont-start-now-dua-lipa-cover'
      const eli = 'https://soundcloud.com/elijahboothe/eyes-on-me-feat-jordan-james-prod-sum-comfort'
      const matt = 'https://soundcloud.com/matt-mcghee/dj-kno1-esfn-release-party-mix'
      const test = 'https://soundcloud.com/julsofficialmusic/skintight'
      const search = 'https://soundcloud.com/burnaboy/on-the-low'
      const juls = 'https://soundcloud.com/julsofficialmusic/sweetie-odo-feat-sway-clarke'
      const mahalia = 'https://soundcloud.com/mahaliamusic/sober-acoustic'


    //  const songLink = "https://soundcloud.com/"+name+"/"+title

      console.log(songLink)


      const SoundCloud = require("soundcloud-scraper");
      const client = new SoundCloud.Client();
      const fs = require("fs");

      client.getSongInfo(songLink)
        .then(song => {
          this.song = song
          this.showSearch = false
          console.log(this.song)

        })
        .catch(console.error);

     //this.playSoundcloud(songLink)
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


   async fetchSoundCloudKey(){
      const sckey = require('soundcloud-key-fetch');

      sckey.fetchKey().then(key => {
        console.log(key)
      });

// the function initially returns a promise, so you can either use the example above *or*
// you can call "await" like the example below.
     const key =  await sckey.fetchKey();

     sckey.testKey(key).then(result => {
       // returns a boolean; true/false
       if(result) {
         console.log(result)
         console.log('The key works!')
       } else {
         console.log('The key didn\'t work.')
       }
     });

// the function initially returns a promise, so you can either use the example above *or* you can call "await" like the example below.

     //const test = await sckey.testKey('SC-KEY');

    },

    async playSoundcloud(songLink){
      const SoundCloudAudio = require('soundcloud-audio');

// create new instance of audio
// clientId is optional but without it you cannot play tracks directly from SoundCloud API
      const scPlayer = new SoundCloudAudio();

// if you have a SoundCloud api stream url you can just play it like that
/*      scPlayer.play({
        streamUrl: 'https://api.soundcloud.com/tracks/185533328/stream'
      });*/

// OR if you want to play a NON-SoundCloud audio
   //  scPlayer.play({ streamUrl: 'https://example.com/plain/audio/file' });

// OR if you need to load a SoundCloud track and resolve it's data

      await scPlayer.resolve(songLink,
        function(track) {
        // do smth with track object
        // e.g. display data in a view etc.
        console.log(track);

        // once track is loaded it can be played
        scPlayer.play();

        // stop playing track and keep silence
        //scPlayer.pause();
      });
    }




  },
  created() {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
    this.fasFont = fasFont
    this.ionPulse = ionPulseSharp
    this.getSong()
    //this.playSoundcloud()
  // this.fetchSoundCloudKey()
  }
}
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
