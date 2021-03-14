<template>
  <chat-window :current-user-id="currentUserId" :rooms="rooms" :messages="messages" />
</template>


<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

export default {
  name: "Chat",
  components: {
    ChatWindow
  },
  data() {
    return {
      rooms: [{name:'Finance'},{name:'Music'}],
      messages: [{sender:{name:'ATEM'}, message:'HERE IT IS'}],
      currentUserId: 1234
    }
  }
}
</script>

<style scoped>

</style>

