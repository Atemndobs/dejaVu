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

  </div>

</template>

<script>

import axios from "axios";

export default {
  name: "AvatarUpload",

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

      axios.post(apiUrl, form)
        .then(response => {
          console.log(' UPLOADED AVATAR ::')
          this.$store.commit('auth/setUserAvatar', response.data.avatar)
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

  }
};
</script>
