<template>
  <div class="q-gutter-md">
    <q-badge :color="color">
      Model to Populate: "{{ model }}"

    </q-badge>
    <q-select filled v-model="model" :options="options" label="Standard" />
    <q-btn
      :loading="loading3"
      :percentage="percentage3"
      dark-percentage
      unelevated
      color="orange"
      text-color="grey-9"
      @click.prevent="populateData(model)"
      icon="my_location"
      style="width: 100px"
    />
  </div>
</template>

<script>
import axios from "axios";
import {startComputing} from "../../utils/Loader";

export default {
  name: "Populate",
  data () {
    return {
      model: 'posts',
      color:'blue',
      options: [],
      loading1: false,
      percentage1: 0,

      loading2: false,
      percentage2: 0,

      loading3: false,
      percentage3: 0
    }
  },
  methods:{
    startComputing (id) {
      startComputing(id)
    },
    getOptions(){
      let id = 3;
      const apiUrl = process.env.API+"/settings/models"


      axios.get(apiUrl)
        .then(response => {
          this.options = response.data.message
          // Handle Code here

          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
        .catch(error => {
          console.log(error)
          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
      //this.options = ['posts', 'designs', 'Twitter', 'Apple', 'Oracle']
    },
    populateData(model){
     // console.log(model)

      let id = 3;

      const apiUrl = process.env.API+"/settings/model/populate/"+model

      axios.post(apiUrl)
        .then(response => {
          this.model = response.data.message
          this.color = 'teal'

          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
        .catch(error => {
          console.log(error.message)


          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
    }
  },
  mounted() {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
