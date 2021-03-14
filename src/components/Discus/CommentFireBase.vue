<template>

  <comment-grid
    baseURL="https://your-app.firebaseio.com"
    apiKey="AIzaSyAMmXVxuzlGe0c0g7HsX24kLAORxwbF88A"
    nodeName="nodeNameThatYouCreated">
  </comment-grid>

</template>

<script>
import Vue from 'vue'
import CommentGrid from 'vue-comment-grid'

Vue.use(CommentGrid)


export default {
name: "CommentFireBase"
}
</script>

<style scoped>

</style>
