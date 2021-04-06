<template>
  <div >
    <q-item-section class="q-pa-md" style="max-width: 500px">
      <Clear/>
    </q-item-section>

    <q-space/>
    <!--- Create Dummy data --->
    <q-item-section class="q-pa-md" style="max-width: 500px">
     <Populate/>
    </q-item-section>

    <!--- Create Reaction Types --->
    <q-item-section >
      <Reactions/>
    </q-item-section>


    <!--- Reset Database--->
    <q-item-section >
      <ResetDb/>
    </q-item-section>



    <!--- Forecast --->
    <q-item-section >
      <Forecast/>
    </q-item-section>


  </div>

</template>

<script>
import axios from "axios";
import Populate from "../components/settings/Populate";
import Clear from "../components/settings/Clear";
import Reactions from "../components/settings/Reactions";
import ResetDb from "../components/settings/ResetDb";
import Forecast from "../components/settings/Forecast";

export default {
  name: "PageSettings",
  components: {Forecast, ResetDb, Reactions, Clear, Populate},
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
  methods: {
/*    startComputing (id) {
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
      const apiUrl = process.env.API+"/settings/models"

      axios.get(apiUrl)
        .then(response => {
          console.log(' OPTIONS ::')
          console.log(response.data)
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
    },*/
  },
  mounted() {
   // this.getOptions()
  }
}
</script>
