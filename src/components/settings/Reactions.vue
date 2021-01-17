<template>
  <div class="q-pa-md" >
    <q-badge outline color="teal">
      Existing Reactions: {{reactions}}
    </q-badge>
<!--    <q-item-section   v-for="(reaction, index) in reactions">
    </q-item-section>-->
    <q-select
      label="Add Reaction Type"
      filled
      v-model="modelAddUnique"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      style="width: 400px"
    />
    <div class="q-gutter-sm">
      Reset?
      <q-checkbox v-model="reset" />
    </div>
    <div class="q-gutter-sm">
      Default?
      <q-checkbox v-model="defaultTypes" />
    </div>
    <q-btn
      color="secondary"
      @click="createTypes(modelAddUnique, reset, defaultTypes)">
      Create
    </q-btn>



  </div>

</template>

<script>
import axios from "axios";
import {startComputing} from "../../utils/Loader";

export default {
  name: "Reactions",
  data () {
    return {
      modelAdd: null,
      modelAddUnique: null,
      modelToggle: null,
      defaultTypes: false,
      color:'secondary',
      reactions:[],
      reset:false,
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
    getTypes(){
      let id = 3;
      const apiUrl = process.env.API+"/settings/types"

      axios.get(apiUrl)
        .then(response => {
       //   console.log(' GET REACTIONS  :: ==>')

          // Handle Code here
          this.reactions = response.data.message.types

       //   console.log(this.reactions)

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
    createTypes(types, reset, defaultTypes){
      console.log(types)

      console.log(this.default)



      let id = 3;

      const apiUrl = process.env.API+"/settings/types"
      let data = {
        reset: reset,
        types: types
      }

      if (defaultTypes === true) {
        data.types = ["Like", "Laugh", "Happy", "Surprise", "Smile"]
        data.reset = true
      }

      axios.post(apiUrl, data)
        .then(response => {
          console.log(' POST REACTIONS______')
          console.log(response.data)
          this.reactions = response.data.message.types
          this.modelAddUnique = null
          this.reset = false
          this.defaultTypes = false

          // Handle Code here



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
    this.getTypes()
  }
}
</script>

<style scoped>

</style>
