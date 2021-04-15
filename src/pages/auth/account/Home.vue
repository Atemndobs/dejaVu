<template>
  <q-page  class="">
    <Edit :user="user"/>
  </q-page>
</template>

<script>
import axios from "axios";
import Edit from "../../../components/Auth/Edit";

export default {
  name: 'AccountHome',
  components: {Edit},
  data () {
    return {
      user:{
        name: '',
        tagline: '',
        about: '',
        available: '',
        activeInput:false,
      },
      submitResult: []
    }
  },

  methods: {
    onSubmit (evt) {
      const formData = new FormData(evt.target)
      const submitResult = []

      //  const apiUrl = process.env.API+"/users/"+this.$auth.user().id
        const apiUrl = process.env.API+"/settings/profile/"

      axios.post(apiUrl, formData)
        .then(response => {
          console.log(' RESPONSE ::')
          console.log(response.data.data)


        }).catch(error => {
        console.log(error)
      })


      for (const [name, value] of formData.entries()) {

        submitResult.push({
          name,
          value
        })
      }

      this.submitResult = submitResult
    },
    activeInput(){

    },
    activateEdit(){

    },
    editUser(user){

    }
    },


  mounted() {
    setTimeout(()=>{
      this.user = this.$auth.user()
    }, 1000)
  }
}
</script>
