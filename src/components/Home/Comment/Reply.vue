<template>
<div>

  <!---------Comment Reply Input Start  ------------->
  <q-banner dense size="1px"  @click="switchInput" label="reply" class="q-field--auto-height"></q-banner>
  <q-input
    v-if="activeInput"
    switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
    label="reply this comment..."
    v-model="replyBox[comment.id]"
    class="col col-sm-6"
    dense
    @keydown.enter.prevent="replyComment(replyBox[comment.id], comment, post)"
    icon="eva-message-circle-outline"
    options-dens
    @keyup.esc="replyBox[comment.id]=''"
  >
    <template v-slot:before>
      <q-avatar>
        <img :src="$auth.user()?$auth.user().photo_url:'https://cdn.quasar.dev/img/avatar5.jpg'">
      </q-avatar>
    </template>
    <template v-slot:after>
      <q-btn
        round dense flat icon="send"
        @click.prevent="replyComment(replyBox[comment.id], comment, post)"
      />
    </template>
  </q-input>
  <!--              <div class="row justify-center q-ma-md"></div>-->
  <!---------Comment Reply Input End ------------->
  <q-expansion-item
    v-show="comment.latest_child"
    switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
    expand-separator
    icon="eva-message-circle"
    :label="comment.latest_child ? '' + comment.latest_child_date + ', ' + comment.latest_child : ''"
    :caption="'See all ' + ' ' + comment.children_count  + ' replies'"
    default-closed
    bg-color="blue-grey-12"
    dense
    flat
    class="text-teal text-right "
    @click="getChildren(comment)"
  >
    <!--
    comment.childComments.length > 0
        label="comment.childComments[0] ? 'latest : ' + comment.childComments[0].comment + ' ' + comment.childComments[0].created_at : ''"
    caption="'See all ' + ' ' + comment.childComments.length + ' replies'"
    -->

<!--    {{this.$store.state.posts.posts[this.post.id].comments[comment.id].children}}-->
    <q-chat-message
      v-if="!loadingComments"
      v-for="(childComment, index) in children"
      :key="childComment.id"
      :name="childComment.commenter.name"
      :avatar="childComment.commenter.photo_url"
      position="up"
      :text="[childComment.comment]"
      :stamp="childComment.created_dates.created_at_human "
      text-color="dark-blue"
      bg-color="amber-1"
      dense
      label=""
      sent
      size="60px"
    />
  </q-expansion-item>
</div>
</template>

<script>

import axios from "axios";
import {mapActions, mapGetters} from "vuex";

function notification(postData) {
  if ( postData.author === postData.userId) {
    postData.self.$q.notify({
      message: postData.message,
      color: 'positive',
      progress: true,
      count: 1,
      avatar: postData.avatar,
      //avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
      actions: [
        {
          label: 'Dismis',
          color: 'white',
          handler: () => { /* ... */
          }
        }
      ]
    })
  }
}
export default {
  name: "Reply",
  props:['comment','post'],
  components :{

  },
  data() {
    return{
      id:'',
      loadingComments:false,
      children: [],
      postComment:this.$store.state.posts.posts[this.post.id].comments[this.comment.id],
      replyIndex : null,
      replyBox:[],
      activeInput:false,

    }
  },

  computed: {
    ...mapGetters({
      posts : 'posts/getPosts'
    }),

    ...mapActions(['posts/addPost']),
  },

  methods : {
    getChildren(comment) {
      this.id = comment.id
      this.loadingComments = true;
      let limit = 4;
      let  user_id = this.$auth.check()? this.$auth.user().id : 1
      let url = `${process.env.API}/comments/${comment.id}?user_id=${user_id}&page=${this.page}&perPage=${limit}`

      axios.get(url).then( response => {
        let fetchedComments = response.data.data.reverse()

        let replies = []
        fetchedComments.forEach((reply) =>  {
          replies[reply.id] = reply
        })

        let updatedPost = {
          post_id: this.post.id,
          comment_id : comment.id,
          children : replies.reverse()
        }

        this.$store.commit('posts/addChildren', updatedPost)
        this.children = fetchedComments

      })
        .catch(error => {
          console.log(error)
          if (process.env.API){

            /*            this.$q.dialog({
                          title: 'Error',
                          message: 'Oops something went wrong, pls contact the Admin'
                        })*/
          }else {
            this.$q.dialog({
              title: 'Error',
              message: error.message
            })
          }

        })
      this.loadingComments = false;

      this.mano = true
    },

    //-----------reply Comments start--------------------//
    replyComment(reply,comment, post){
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
      }

      if (reply === '' || reply === undefined){
        return;
      }

      const apiUrl = process.env.API+"/comments/comment/"+comment.id
      let data = {
        comment: reply,
      }
      axios.post(apiUrl, data)
        .then(response => {
          let newReply = {
            comment:response.data.data.comment,
            commenter: {
              name:response.data.data.commenter['name'],
              photo_url:this.$auth.user().photo_url
            },
            childComments:{},
            parent:response.data.data.parent,
            reaction_count: response.data.data.reaction_count,
            reactions: response.data.data.reactions,
            updated_dates:response.data.data.updated_dates,
            created_dates:response.data.data.created_dates,
          }

          /*          let newComment = {
                      id : response.data.data.comment['id'],
                      comment:response.data.data.comment['comment'],
                      commenter: {
                        id:response.data.data.comment.commenter['id'],
                        name:response.data.data.comment.commenter['name'],
                        username:response.data.data.comment.commenter['username'],
                        photo_url:response.data.data.comment.commenter['photo_url'],
                      },
                      updated_dates:{
                        updated_at: response.data.data.updated_dates['updated_at'],
                        updated_at_human: response.data.data.updated_dates['updated_at_human']
                      },
                      created_dates:response.data.data.created_dates,
                      childComments:{
                     },
                      //   parent:{},
                      //   reaction_count: '',
                      //   reactions: '',

                    }*/

          let updatedPost = {
            post_id: post.id,
            comment_id : comment.id,
            reply : newReply
          }

          this.children.unshift(newReply)
          this.comment.latest_child = newReply.comment
          this.comment.latest_child_date = newReply.created_dates.created_at_human
          this.comment.children_count += 1

       //   this.$store.commit('posts/addReply', updatedPost)

        }).catch(error => {
        console.log(error)
      })
      this.replyBox = []
    },
    //-----------reply Comments end--------------------//

    showSend(){
      this.sendButton = true
    },

    switchInput(){
      console.log('CLICKED')
      return this.activeInput = !this.activeInput
    },

    activateParentComment(){
      return this.activateAddComment = !this.activateAddComment
    },
  },

  mounted() {

  },

}
</script>

<style scoped>

</style>
