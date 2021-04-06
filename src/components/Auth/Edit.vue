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

          <div class="text-caption text-grey"  @click="addName">
            <q-item-label class="text-overline text-orange-9"> Name : </q-item-label>
            <q-input
              v-model="user.name" dense
            >
              <q-popup-edit v-model="editUser.name">
                <q-input v-model="editUser.name" dense autofocus counter
                         @input="updateInput('Name')"
                         ref="Name"
                />
              </q-popup-edit>

              <template v-slot:before>
                <q-icon name="eva-person"/>
              </template>
            </q-input>



<!--            <div @click="showEditor">

              <template>
                <div class="q-pa-md q-gutter-sm" v-show="editor">
                  <q-editor :value="user.about"  />
                </div>
              </template>

            </div>-->
            <q-item-label class="text-overline text-orange-9"> About:</q-item-label>
            <div @click="aboutMe">
              <div v-html="user.about"></div>
              <q-popup-edit
                buttons
                v-model="user.about"
              >
                <q-editor
                  v-model="editUser.about"
                  min-height="5rem"
                  autofocus
                  counter
                  ref="About"
                  @input="updateInput('About')"
                  @set="updateInput('About')"
                />
              </q-popup-edit>
            </div>



            <q-item-label class="text-overline text-orange-9"> User name : </q-item-label>
            <q-input v-model="user.username" dense />

            <q-item-label class="text-overline text-orange-9"> Tagline : </q-item-label>
            <q-input v-model="user.tagline" dense/>

            <q-item-label class="text-overline text-orange-9"> Email : </q-item-label>
            <q-input v-model="user.email" dense disable/>

            <q-item-label class="text-overline text-orange-9"> Formatted Address: </q-item-label>
            <q-input v-model="user.formatted_address" dense />

            <q-item-label class="text-overline text-orange-9"> Available to hire?</q-item-label>
            <q-input v-model="user.available_to_hire" dense />

            <q-item-label class="text-overline text-orange-9"> Location Coordinates </q-item-label>

<!--            Longitude : <q-input v-model="user.location.longitude" dense />
            Latitude :<q-input  v-model="user.location.latitude" dense />-->
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
<!--                  <MapView/>-->

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
      submitting: false,
      editUser:{
        about:'',
        name:'',
        tagline:'',
        username:'',
        formatted_address:'',
        available_to_hire: false
      },
    }
  },

  methods:{

    simulateSubmit () {
      this.submitting = true

      let apiUrl =  process.env.API+'/settings/profile'

      axios.put(apiUrl, this.user)
        .then(response => {
          console.log(' AVATAR ::')
          console.log(response.data)
          this.$store.commit('auth/setUser', response.data)
          this.about = this.$auth.user().about
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

    aboutMe(){
      this.editUser.about = this.$auth.user().about
    },
    addName(){
      this.editUser.name = this.$auth.user().name
    },

    updateInput(input){
      this.$store.commit('auth/setUser'+input, this.$refs[input].value)
    },


  },


  mounted() {
    setTimeout(() => {
      // nothing here
    }, 3000)
  }
}
</script>

<style scoped>

</style>
