<template>
 <q-page class="constrain-more q-pa-md">
   <div class="camera-frame q-pa-md">
      <img
      class="full-width"
      src="http://localhost:1337/uploads/on_wall_a9f9ade171.jpeg">
   </div>
   <div class="text-center q-pa-md">
     <q-btn
        color="grey-10"
        icon="eva-camera"
        round
        size="lg"
      />
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
       class="col col-sm-6"
       dense
     >
      <template v-slot:append>
        <q-btn
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

<script lang="ts">
import { uid } from 'quasar'

export default {
  name: 'Page',
    data() {
      return {
        post: {
          id:uid(),
          caption: 'ATEMKENG',
          location: '',
          photo: null,
          date: 1597600158851
        }
      }
    }
};
</script>

<style lang="sass">
  .camera-frame
    border: 2px solid $grey-10
    border-radius: 10px
</style>
