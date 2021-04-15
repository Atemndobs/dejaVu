<template>
  <div>
    <!-- omited -->
    <button @click="toggleTheme">Change to dark mode</button>
    <!-- omited -->
    <div class="comments">
      <Disqus
        ref="disqus"
        @new-comment="newComment"
      />
    </div>
  </div>
</template>


<script>

import Vue from 'vue'
import VueDisqus from 'vue-disqus'
import { Disqus } from 'vue-disqus'

Vue.use(VueDisqus, {
  shortname: 'your-shortname-disqus'
})



export default {
  name: "UserEdit",
  components: {
    Disqus
  },
  methods: {
    toggleTheme () {
      // Update theme here

      this.$disqus.reset() // Use this if VueDisqus was installed with Vue.use

      // Note: Use "this.$refs.disqus.reset()" if Disqus component was registered locally
    },
    newComment (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>
