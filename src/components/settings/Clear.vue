<template>
  <div class="q-gutter-md">
    <q-badge :color="color" multi-line>
      Model to Clear: "{{ model }}"

    </q-badge>
    <q-select filled v-model="model" :options="options" label="Standard" />
    <q-btn
      :loading="loading3"
      :percentage="percentage3"
      dark-percentage
      unelevated
      color="orange"
      text-color="grey-9"
      @click="startComputing(3)"
      @click.prevent="clearData(model)"
      icon="cloud_upload"
      style="width: 100px"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Clear",
  data () {
    return {
      model: null,
      color:'secondary',
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
      this[`loading${id}`] = true
      this[`percentage${id}`] = 0
      this[`interval${id}`] = setInterval(() => {
        this[`percentage${id}`] += Math.floor(Math.random() * 8 + 10)
        if (this[`percentage${id}`] >= 100) {
          clearInterval(this[`interval${id}`])
          this[`loading${id}`] = false
        }
      }, 700)
    },
    getOptions(){
      let id = 3;
      const apiUrl = process.env.API+"/admin/settings/models"

      axios.get(apiUrl)
        .then(response => {
          // console.log(' OPTIONS ::')
          // console.log(response.data)
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
    async clearData (model) {
      console.log(model)
      let id = 3;

      const apiUrl = process.env.API+"/admin/settings/clear/"+model

      axios.post(apiUrl)
        .then(response => {
          console.log(' RESPONSE ::')
          console.log(response.data)
          // Handle Code here
          this.model = response.data.message
          this.color = 'red'

          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
        .catch(error => {
          console.log(error.message)


          this[`percentage${id}`] = 100
          this[`loading${id}`] = false
        })
    },
  },
  mounted() {
     this.getOptions()
  }
}
</script>

<style scoped>

</style>
