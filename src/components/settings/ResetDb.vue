<template>
  <div class="q-pa-md">
    <q-btn color="black" class="full-width" :label="danger" />

    <q-btn
      :color="color"
      :label="label"
      class="q-mt-md"
      @click="resetDB"
    >
      <q-tooltip content-class="bg-accent">This Is going to Clear all tables in the Database And Seed new data</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResetDb",

  data () {
    return {
      model: null,
      color:'red',
      options: [],
      loading1: false,
      percentage1: 0,
      danger:'DANGER ZONE',
      label:'RESET DATABASE',
      loading2: false,
      percentage2: 0,

      loading3: false,
      percentage3: 0
    }
  },

  methods:{
    async resetDB() {
      const apiUrl = process.env.API+"/settings/reset/db"

      axios.post(apiUrl)
        .then(response => {
          console.log(' RESPONSE ::')
          console.log(response.data)
          this.danger = response.data.message.reset
          this.label = response.data.message.reset
          this.color = 'teal'

        })
        .catch(error => {
          console.log(error.message)

        })
    },
  },
}
</script>

<style scoped>

</style>
