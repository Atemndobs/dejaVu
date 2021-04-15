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
      <PeakForecast/>
    </q-item-section>



  </div>

</template>

<script>
import Populate from "../components/settings/Populate";
import Clear from "../components/settings/Clear";
import Reactions from "../components/settings/Reactions";
import ResetDb from "../components/settings/ResetDb";
import Forecast from "../components/settings/Forecast";
import PeakForecast from "../components/settings/PeakForecast";

export default {
  name: "PageSettings",
  components: {Forecast, ResetDb, Reactions, Clear, Populate, PeakForecast},
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

}
</script>
