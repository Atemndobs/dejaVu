<template>
 <q-page class="constrain-more q-pa-md">
   <div class="camera-frame q-pa-md">
     <video
     v-show="!imageCaptured"
     class="full-width"
     autoplay
     ref="video"
     />
     <canvas
     v-show="imageCaptured"
     ref="canvas"
     class="full-width"
     height="240"
     />

   </div>
   <div class="text-center q-pa-md">
     <q-btn
        @click="captureImage"
        color="grey-10"
        icon="eva-camera"
        round
        size="lg"
        v-if="hasCameraSupport"
      />

    <q-file
      v-else
      outlined
      v-model="imageUpload"
      label="Chose an image"
      accept="image/*"
      @input="captureImageFallback"
    >
      <template v-slot:prepend>
        <q-icon name="eva-attach-outline" />
      </template>
    </q-file>

   </div>

   <div class="row justify-center q-ma-md">
     <q-input
       label="Caption"
       v-model="post.caption"
       class="col col-sm-6"
       dense
     />

   </div>

    <div class="row justify-center q-ma-md">
     <q-input
       label="Location"
       v-model="post.location"
       :loading="locationLoading"
       class="col col-sm-6"
       dense
     >
      <template v-slot:append>
        <q-btn
          v-if="!locationLoading && locationSupported"
          @click="getLocation"
          dense
          flat
          icon="eva-navigation-2-outline"
          round
        />
      </template>
     </q-input>
   </div>

    <div class="row justify-center q-mt-lg">
      <q-btn
        color="primary"
        label="Post Image"
        rounded
        unelevated
      />
    </div>

  </q-page>
</template>

<script >
import { uid } from 'quasar'
import { error } from 'util';
require('md-gum-polyfill');

export default {
  name: 'Page',
    data() {
      return {
        post: {
          id:uid(),
          caption: '',
          location: '',
          photo: null,
          date: 1597600158851
        },
        imageCaptured : false,
        imageUpload: [],
        hasCameraSupport: true,
        locationLoading: false

      }
    },

    computed: {
      locationSupported() {
        if ('geolocation' in navigator) return true
        return false
      }
    },
    methods: {
      initCamera() {
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then(stream => {
          this.$refs.video.srcObject = stream;
        }).catch(error => {
          this.hasCameraSupport = false;
        })
        },
      captureImage() {
        let video = this.$refs.video;
        let canvas = this.$refs.canvas;
        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        this.imageCaptured = true
        this.post.photo = this.dataURItoBlob(canvas.toDataURL())
        this.disableCamera()
      },

      captureImageFallback(file) {
        this.post.photo = file;

        let canvas = this.$refs.canvas;
        let context = canvas.getContext('2d');

        var reader = new FileReader();
        reader.onload = event =>{
          var img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
          }
          img.src = event.target.result;
        }
        reader.readAsDataURL(file);
        this.imageCaptured = true;
      },

      disableCamera() {
        this.$refs.video.srcObject.getVideoTracks().forEach(track => {
          track.stop()
        });
      },

      dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;

      },

      getLocation() {
        this.locationLoading = true;
        navigator.geolocation.getCurrentPosition(position => {
          this.getCityAndCountry(position)
        }, error => {
           this.locationError();
        }, {timeout: 7000})
      },

      getCityAndCountry(position) {
        let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;

        this.$axios.get(apiUrl).then(result => {
          this.locationSuccesss(result)
        }).catch(error => {
          this.locationError();
        })
      },

      locationSuccesss(result) {

        this.post.location = result.data.city;
                if (result.data.country) {
          this.post.location += `, ${result.data.country}`;
        }
        this.locationLoading = false
      },

      locationError() {
        this.$q.dialog({
          title: 'Error',
          message: 'Could not find your Location'
        })
        this.locationLoading = false
      }

    },
    mounted() {
      this.initCamera();
    },
    beforeDestroy() {
      if (this.hasCameraSupport) {
        this.disableCamera();
      }
    }
};
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>
