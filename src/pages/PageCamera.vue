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
        v-if="hasCameraSupport && showCamera"
        :disable="imageCaptured"
      />

      <q-btn
        color="grey-10"
        icon="cancel"
        round
        size="lg"
        v-else-if="!showCamera"
        @click="cancelPhoto"
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
       label="Caption*"
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
        @click="sendPost()"
        :disable="!post.caption || !post.photo"
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
          caption: 'Around the world',
          location: 'Somewhere on Earth',
          photo: null,
          date: Date.now(),
          imageId:'',
          imageUrl: '',
          userId:''
        },
        imageCaptured : false,
        imageUpload: [],
        hasCameraSupport: true,
        locationLoading: false,
        showCamera: true

      }
    },

    computed: {
      locationSupported() {
        if ('geolocation' in navigator) return true
        return false
      },
      backgroundSyncSupported(){
        // check if browser supports service worker
        if ('serviceWorker' in navigator && 'SyncManager' in window) return true
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

      captureImage(){
        let video = this.$refs.video;
        let canvas = this.$refs.canvas;
        canvas.width = video.getBoundingClientRect().width;
        canvas.height = video.getBoundingClientRect().height;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        this.imageCaptured = true
        this.showCamera = false
        this.post.photo = this.dataURItoBlob(canvas.toDataURL())
        this.disableCamera()
      },

      cancelPhoto() {
        location.reload();
        this.showCamera = true
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
      },
      addPost() {
      this.$q.loading.show();
       let formData = new FormData();
       formData.append('id', this.post.id)
       formData.append('caption', this.post.caption)
       formData.append('location', this.post.location)
       formData.append('file', this.post.photo, this.post.id + '.png')

       this.$axios.post(`${process.env.API}/createPost`, formData).then(response => {
         //console.log(response);
         this.$router.push('/')

        this.$q.notify({
          message: 'Post Created',
          color: 'positive',
         // avatar: '../statics/avat_atem.png',
          avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
          actions: [
            { label: 'Dismis', color: 'white' }
          ]
        })
        this.$q.loading.hide();
       }).catch(error => {
        // console.log(error);
       //  console.log(navigator.onLine, this.backgroundSyncSupported)
         if (!navigator.onLine && this.backgroundSyncSupported){
           // redirrect to home page
           this.$q.notify('Post Created offline')
           this.$router.push('/');
         }
         else {
           this.$q.dialog({
             title: 'Error',
             message: 'Sorry Could not create post'
           })
         }

        this.$q.loading.hide()
       })
      },
      sendPost(){
      this.$q.loading.show();
        let formData = new FormData();
        formData.append('image', this.post.photo, this.post.id + '.png')
        formData.append('caption', this.post.caption)
        formData.append('location', this.post.location)
        this.submitPost(formData)
      },
      createImage(){

        let formData = new FormData();
        formData.append('image', this.post.photo, this.post.id + '.png')
        formData.append('caption', this.post.caption)
        formData.append('location', this.post.location)


        this.$axios.post(`${process.env.API}/designs`, formData)
          .then(response => {
         // console.log(response.data)
          this.user_id = response.data.user_id
          this.imageId = response.data.id;


        }).catch(error => {
          // console.log(error);
          //  console.log(navigator.onLine, this.backgroundSyncSupported)
          if (!navigator.onLine && this.backgroundSyncSupported){
            // redirrect to home page
            this.$q.loading.hide();
            this.$q.notify('Post Created offline')
            this.$router.push('/');
          }
          else {
            this.$q.loading.hide();
            this.$q.dialog({
              title: 'Error',
              message: 'Sorry Could not create post'
            })
          }
        })
      },
      getImage(id){
        this.$axios.get(`${process.env.API}/image/${id}`).then(response => {
        //  console.log('POST TO IMAGE END POINT :: '+ response.data)
          const url  = response.data.image
          let data = {
            'caption': this.post.caption,
            'location': this.post.location,
            'imageUrl': url
          }

        //  this.submitPost(data)

        }).catch(error => {
          if (!navigator.onLine && this.backgroundSyncSupported){
            // redirrect to home page
            this.$q.loading.hide();
            this.$q.notify('Post Created offline')
            this.$router.push('/');
          }
          else {
            this.$q.loading.hide();
            this.$q.dialog({
              title: 'Error',
              message: 'Sorry Could not create post'
            })
          }
        })
      },
      submitPost(data){
        if (!this.$auth.check()){
          this.$q.loading.hide()
          this.$q.dialog({ 'message' : "You need to Login Before you can create post" })
          this.$router.push('/login')
          console.log({
            'Error' : 'You need to log in to react to a post'
          })
          return
        }

        let userId = this.$auth.user().id
        // for submitting post as design Use snippet below
       // this.$axios.post(`${process.env.API}/posts/${this.user_id}`, data)
                this.$axios.post(`${process.env.API}/posts/${userId}`, data)
                  .then(response => {

                  console.log('SUBMITTED POST :: => ')
                 // console.log(response)
                  this.$router.push('/')

                  this.$q.notify({
                    message: 'Post Created',
                    color: 'positive',
                    // avatar: '../statics/avat_atem.png',
                    avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
                    actions: [
                      { label: 'Dismis', color: 'white' }
                    ]
                  })
                  this.$q.loading.hide();
                }).catch(error => {
                  // console.log(error);
                  //  console.log(navigator.onLine, this.backgroundSyncSupported)
                  if (!navigator.onLine && this.backgroundSyncSupported){
                    // redirrect to home page
                    this.$q.notify('Post Created offline')
                    this.$router.push('/');
                  }
                  else {
                    this.$q.dialog({
                      title: 'Error',
                      message: 'Sorry Could not create post'
                    })
                  }
                  this.$q.loading.hide()
                })

      },

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
