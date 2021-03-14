<template>
  <form @submit.prevent="simulateSubmit" class="q-pa-md">
    <div class="q-pa-md">

      <div class="q-gutter-y-md column" style="max-width: 300px">

        <q-card-section>
          <AvatarUpload :avatar="user.photo_url"/>
          <q-item-label caption >
            Followers: {{user.follower_count}} |
            Following: {{user.following_count}} |
            Posts: {{user.post_count}}
          </q-item-label>

        </q-card-section>

        <q-card-section>

          <div class="text-caption text-grey">
            <q-item-label class="text-overline text-orange-9"> Name : </q-item-label>
            <q-input v-model="user.name" dense >
              <template v-slot:before>
                <q-icon name="eva-person"/>
              </template>

            </q-input>
            {{user.about}}

            <q-item-label class="text-overline text-orange-9"> User name : </q-item-label>
            <q-input v-model="user.username" dense />

            <q-item-label class="text-overline text-orange-9"> Tagline : </q-item-label>
            <q-input v-model="user.tagline" dense/>

            <q-item-label class="text-overline text-orange-9"> Email : </q-item-label>
            <q-input v-model="user.email" dense disable/>


            <q-item-label class="text-overline text-orange-9"> About: </q-item-label>
            <q-input v-model="user.about" dense @click="showEditor" >
            </q-input>

            <template >
              <div class="q-pa-md q-gutter-sm" v-show="editor">
                <q-editor v-model="user.about" min-height="5rem" />
              </div>
            </template>

            <q-item-label class="text-overline text-orange-9"> Formatted Address: </q-item-label>
            <q-input v-model="user.formatted_address" dense />

            <q-item-label class="text-overline text-orange-9"> Available to hire?</q-item-label>
            <q-input v-model="user.available_to_hire" dense />

            <q-item-label class="text-overline text-orange-9"> Location Coordinates </q-item-label>

            Longitude : <q-input v-model="user.location.longitude" dense />
            Latitude :<q-input  v-model="user.location.latitude" dense />
            {{user.location}}



            <div class="row justify-end">
              <q-btn
                type="submit"
                :loading="submitting"
                label="Save"
                class="q-mt-md"
                color="teal"
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>
          </div>
          <!--        <MapView/>-->

        </q-card-section>
      </div>

    </div>
  </form>
</template>

<MapView/>
<script>

import MapView from "../Location/MapView";
import AvatarUpload from "./AvatarUpload";
import axios from "axios";
export default {
  name: "Edit",
  components: {AvatarUpload, MapView},
  props:['user'],
  data () {
    return {
      text: '',
      newAvatar : false,
      oldAvatar : true,
      ph: '',
      editor:false,
      dense: false,
      test: '',
      submitting: false
    }
  },

  methods:{

    simulateSubmit () {
      this.submitting = true

      let apiUrl =  process.env.API+'/settings/profile'


      axios.put(apiUrl, this.user)
        .then(response => {
          console.log(' SONGS ::')
          console.log(response.data)

          this.user = response.data
          this.avatar = response.data.avatar
          this.showUpload = false
          this.label = 'Saved new avatar'
          this.showLabel = false
          this.showSave = true
        })
        .catch(error => {
          console.log(error)
        })

      // Simulating a delay here.
      // When we are done, we reset "submitting"
      // Boolean to false to restore the
      // initial state.


      this.submitting = false
    },
    showEditor(){
      return this.editor = !this.editor
    },
    changeAvatar(){

    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.user)
    }, 3000)
  }
}
</script>

<style scoped>

</style>
