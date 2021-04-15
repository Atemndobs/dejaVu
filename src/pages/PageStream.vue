<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <template>
        <div class="q-pa-md">
          <q-video
            :ratio="16/9"
            title="Video Streaming Box"
            src=""
          />
        </div>
      </template>

    </div>
    <q-btn label="Stream" @click="startStream"/>


  </q-page>
</template>

<script>
import axios from "axios";
import Echo from "laravel-echo";

export default {
  name: "PageStream",

  methods: {

    startStream(){
     let  videoUrl = process.env.VIDEO

      let data = {
        'signal_data' : 'signal from the vue application'
      }

      axios.post(videoUrl+'video/call', data)
        .then(response => {

          console.log(' RESPONSE FROM VIDEO API ::')
         // console.log(response)
          console.log('VIDEO API :: END')

        }).catch(error => {
        console.log(error)
      })
    },

    pushEcho() {
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


      const videoChannel = window.Echo.channel('video-channel');
      videoChannel.listen('.App\\Events\\StartVideoChat',
        function (data) {
          console.log(' WEBSOCKET  ::')
          console.log(data)
          JSON.stringify(data)
          console.log(data)

        }
      );
    }



  },

  mounted() {
    this.pushEcho()
  }
}
</script>

<style scoped>

</style>
