<template>
  <div>
    <Software/>
    <Iphone/>
  </div>
</template>

<script>
import Software from "../components/Tracker/Software";
import Iphone from "../components/Tracker/Iphone";

export default {
  name: "PageTracker",
  components: {Iphone, Software},
  data () {
    return {
      apiUrl : process.env.API
    }
  },

  methods:{
  }
}
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 250px
</style>
