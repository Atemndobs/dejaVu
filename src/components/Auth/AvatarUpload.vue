<template>

  <div class="q-pa-md">
    <q-avatar @click="activateUpload">
      <img :src="avatar">
    </q-avatar>
    {{label}}
    <q-icon name="eva-edit-2-outline" @click="activateUpload" v-show="showNotif"/>

    <q-uploader
      :factory="factoryFn"
      v-show="showUpload"
      multiple
      style="max-width: 300px"
      auto-upload
      label="Upload Avatar"
    />

<!--    <template>
      <div id="app">
        <file-pond
          name="image"
          ref="pond"
          label-idle="Drop files here..."
          v-bind:allow-multiple="true"
          accepted-file-types="image/jpeg, image/png"
          server="http://localhost:8090/api/avatar"
          v-on:init="handleFilePondInit"
          @click="upload(file)"
        />
      </div>
    </template>-->

  </div>

</template>

<script>

//           v-on:init="handleFilePondInit"

import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import axios from "axios";
const FilePond = vueFilePond(
);
//

export default {
  name: "AvatarUpload",
  components: {
    FilePond
  },
  props:['avatar'],
  data: function () {
    return {
      myFiles: [""] ,
      showUpload:false,
      label:'Change avatar',
      showLabel : true,
      showSave : false
    };
  },
  methods: {
    activateUpload(){
      return this.showUpload = !this.showUpload
    },

    factoryFn (files) {

      let apiUrl =  process.env.API+'/avatar'
      let image = files[0]

      const form = new FormData()
      form.append('image', image, image.name)


     // console.log(' UPLOAD FILES ::')
      // console.log(image)
      axios.post(apiUrl, form)
        .then(response => {
          console.log(' AVATAR ::')
          console.log(response.data)

          this.$auth.user().photo_url = response.data.avatar
          this.showUpload = false
          this.label = 'Saved new avatar'
          this.showLabel = false
          this.showSave = true
        })
        .catch(error => {
          console.log(error)
        })

    },

    upload(){
      console.log(file)
      let apiUrl =  process.env.API+'/avatar'

      axios.post(apiUrl)
        .then(response => {
          console.log(' FILE ::')
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    showNotif () {
      const notif = this.$q.notify({
        group: false, // required to be updatable
        timeout: 0, // we want to be in control when it gets dismissed
        spinner: true,
        message: 'Uploading file...',
        caption: '0%'
      })

      // we simulate some progress here...
      let percentage = 0
      const interval = setInterval(() => {
        percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

        // we update the dialog
        notif({
          caption: `${percentage}%`
        })

        // if we are done...
        if (percentage === 100) {
          notif({
            icon: 'done', // we add an icon
            spinner: false, // we reset the spinner setting so the icon can be displayed
            message: 'Uploading done!',
            timeout: 2500 // we will timeout it in 2.5s
          })
          clearInterval(interval)
        }
      }, 500)
    },

    handleFilePondInit: function () {
      let file = this.$refs.pond.getFiles();

    },
  }
};
</script>
