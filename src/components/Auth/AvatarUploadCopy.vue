<template>
  <div class="q-pa-md">
    <q-uploader


      url="http://localhost:8090/api/avatar"
      style="max-width: 300px"
      v-show="showUpload"
      :factory="factoryFn"
      multiple
      @click.prevent="upload"
    />

  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "AvatarUpload",
  components: {
  },
  data: function () {
    return {
      myFiles: ["cat.jpeg"] ,
    };
  },
  methods: {
    factoryFn (files) {

      let apiUrl =  process.env.API+'/avatar'

      let image = files[0]

      const form = new FormData()
      form.append('image', image, image.name)

      console.log(' UPLOAD FILES ::')
      console.log(image)
      axios.post(apiUrl, form)
        .then(response => {
           console.log(' SONGS ::')
           console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })


      // returning a Promise
      return new Promise((resolve) => {
        // simulating a delay of 2 seconds
/*        setTimeout(() => {
          resolve({
            url: process.env.API+'/avatar'
          })
        }, 2000)*/
      })
    }
  }
};
</script>

