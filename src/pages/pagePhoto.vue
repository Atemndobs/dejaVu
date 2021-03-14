
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <q-btn
          color="primary"
          label="Get Picture"
          @click="captureImage"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Plugins, CameraResultType } from '@capacitor/core'

const { Camera } = Plugins

export default {
  data () {
    return {
      imageSrc: ''
    }
  },
  methods: {
    async captureImage () {
      const image = await Camera.getPhoto({
        quality: 100,
        width:400,
        allowEditing: true,
        resultType: CameraResultType.Uri,
       // resultType: CameraResultType.Base64
      })
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

      console.log(image)

       this.imageSrc = image.webPath
    }
  }
}
</script>
