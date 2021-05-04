<template >

  <div>
    <!---------Comment Input Section ------------->

    <q-input
      v-show="$auth.check()"
      label="Add comment"
      v-model="commentBox[post.id]"
      class="col col-sm-6"
      dense
      @focusin="showTypingBubble(post.id)"
      @focusout="hideTypingBubble(post.id)"
      @keydown.enter.prevent="addComment(commentBox[post.id], post)"
      icon="eva-message-circle-outline"
      options-dens
      @keyup.esc="commentBox[post.id]=''"
    >
      <q-spinner-comment v-show="showBubble === post.id"/>
      <template v-slot:before>
        <q-avatar >
          <img :src="$auth.user()?$auth.user().photo_url:'favicon.ico'">
        </q-avatar>
      </template>
      <template v-slot:after>
        <q-btn
          v-show="sendButton === post.id"
          round dense flat icon="send"
          @click.prevent="addComment(commentBox[post.id], post)"
        />
      </template>
    </q-input>
    <!---------Comment Input Section ------------->

    <q-list bordered class="rounded-borders">
      <q-item-label class="q-px-sm">
        <q-avatar size="xs"> <img :src="post.new_comment['avatar']"> </q-avatar>
        <q-badge :label="post.new_comment ? post.new_comment['commenter'] : 0 " color="white" text-color="black"></q-badge>
        <q-badge :label="post.new_comment ? post.new_comment['comment'] : 0 " color="white" text-color="grey-6" ></q-badge>
        <q-badge :label="post.new_comment['created_at']" color="white" text-color="grey"></q-badge>
        <q-badge  :label="post.comments_count + ' '+ post.comments_label " color="white" text-color="grey"></q-badge>
      </q-item-label>
      <q-expansion-item
        v-show="post.comments_count > 0"
        expand-separator
        :caption="'See all ' + post.comments_count + ' ' + post.comments_label"
        default-closed
        flat
        dense
        @click="getComments(post)"
      >
        <!--      <q-expansion-item
                v-show="post.comments_count > 0"
                expand-separator
                icon="eva-person-outline"
                :caption="'latest : ' + post.new_comment ? post.new_comment['comment'] : 0 "
                :label="post.comments_count + ' '+ post.comments_label "
                default-closed
                flat
                style="height: fit-content"
                @click="getComments(post)"
              >
                &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment Start -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
        <div>


          <!---------Comment Start ------------->
          <q-card v-if="!loadingComments ">

            <q-card-section v-for="(comment, index) in comments"  :key="comment.id" >

              <!---------Edit Comment Start   v-show="activeInput"  ------------->
              <!--              <template >
                              <div class="q-pa-md" >
                                <div class="cursor-pointer">
                                  <q-icon name="edit" right v-show="activateEditComment(comment)"></q-icon>
                                  <q-popup-edit v-model="comment.comment" :validate="val => val.length > 5">
                                    <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                      <q-input
                                        autofocus
                                        dense
                                        :value="comment.comment"
                                        hint="Edit this Comment"
                                        :rules="[val => validate(value) || 'More than '+ val.length +' chars required']"
                                        @input="emitValue"
                                        @keydown.enter.prevent="editComment(comment.comment)"
                                      >

                                        <template v-slot:after>
                                          <q-btn
                                            dense flat icon="send"
                                            @click="editComment(comment.comment)"
                                            @click.stop="set"
                                          />
                                          <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                          <q-btn flat dense color="positive" icon="check_circle" @click.stop="set"
                                                 @click="editComment(comment.comment)"
                                                 :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                      </q-input>
                                    </template>
                                  </q-popup-edit>
                                </div>
                              </div>
                            </template>-->
              <!---------Edit Comment End ------------->
              <!---------Comment Reactions Start ------------->
              <!--              <q-item >
                              <q-fab
                                label=""
                                label-position="top"
                                external-label
                                color="transparent"
                                icon="keyboard_arrow_right"
                                direction="right"
                                text-color="black"
                                padding="xs"
                                dense
                                flat
                              >
                                <q-fab-action
                                  @click="reactComment('Like',comment, post)"
                                  :icon="reactionEmoji('thumbsup')"
                                  external-label
                                  label-position="top"
                                  text-color="red"
                                  :label="comment.reaction_count[1] > 0 ? comment.reaction_count[1]  :'' "
                                  padding="xs"
                                  dense
                                  flat
                                />
                                <q-fab-action
                                  @click="reactComment('DisLike',comment, post)"
                                  :icon="reactionEmoji('thumbsdown')"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[2]  > 0 ? comment.reaction_count[2]  :''"
                                  padding="xs"
                                  dense
                                  flat
                                />
                                <q-fab-action
                                  @click="reactComment('Happy',comment, post)"
                                  :icon="reactionEmoji('smiley_cat')"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[5]  > 0 ? comment.reaction_count[5]  :''"
                                  padding="xs"
                                  dense
                                  flat
                                />
                                <q-fab-action
                                  @click="reactComment('DisHappy',comment, post)"
                                  :icon="reactionEmoji('rage')"
                                  external-label
                                  label-position="top"
                                  text-color="amber"
                                  :label="comment.reaction_count[6]  > 0 ? comment.reaction_count[6]  :''"
                                  padding="xs"
                                  dense
                                  flat
                                />
                                <q-fab-action
                                  @click="reactComment('Surprise',comment, post)"
                                  :icon="reactionEmoji('shrug')"
                                  external-label
                                  label-position="top"
                                  text-color="blue"
                                  :label="comment.reaction_count[7]  > 0 ? comment.reaction_count[7]  :''"
                                  padding="xs"
                                  dense
                                  flat
                                />
                                <q-fab-action
                                  @click="reactComment('Smile',comment, post)"
                                  :icon="reactionEmoji('shocked_face_with_exploding_head')"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[9] > 0 ? comment.reaction_count[9]  :''"
                                  padding="xs"
                                  dense
                                  flat
                                />
                              </q-fab>
                            </q-item>-->
              <!---------Comment Reactions  End------------->


              <!---------Comment Display START------------->

              <q-chat-message
                @click="switchReplyInput(index)"
                :name="comment.commenter.name"
                :avatar="comment.commenter.photo_url"
                position="up"
                :text="[comment.comment]"
                :stamp="comment.created_dates.created_at_human"
                text-color="black"
                bg-color="blue-grey-1"
              >
              </q-chat-message>

              <!---------Comment Display END------------->





              <!---------Comment  ------------->

              <!---------Replies  ------------->
              <!--                                  "-->

              <Reply :comment="comment" :post="post" :switchReplyInput="switchReplyInput" />

              <!---------Replies  ------------->

            </q-card-section>
            <div class="q-pa-lg flex flex-center">
              <q-pagination
                v-model="page"
                :max="comments.length"
                input
              />
            </div>

          </q-card>
          <!---------Comment End ------------->

          <!---------Infinite Scrolling Start ------------->
          <!--    <infinite-loading @infinite="getComments" spinner="bubbles" >

                <div slot="no-more">
                  <h5 class="text-center text-grey">
                    You are all caught up !

                  </h5>

                </div>
                <div slot="no-results">No POSTS HERE : Create your First Post! </div>
              </infinite-loading>-->
          <!---------Infinite Scrolling End ------------->
        </div>

        <!---------Comment End ------------->

      </q-expansion-item>

    </q-list>
  </div>

</template>

<script>
import axios from "axios";
import Echo from "laravel-echo";
import { emojiIndex } from 'emoji-mart-vue'
import InfiniteLoading from 'vue-infinite-loading';
import {date} from "quasar";
import {mapActions, mapGetters} from "vuex";
import Reply from "./Reply";

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
  name: "AllPostComments",
  props:['post', 'show'],
  components :{
    Reply,
    InfiniteLoading,
  },
  data() {
    return{
      imageSrc: this.$auth.user()?this.$auth.user().photo_url:'favicon.ico',
      poster: [],
      comments:[],
      commentBox:[],
      loadingComments: false,
      totalLikes: '',
      isLiked: false,
      reactionType:'eva-heart-outline',
      activeInput:false,
      activateAddComment:false,
      page: 1,
      postReacting:{},
      showBubble:false,
      sendButton:false,
      caption:'',
      id:0,
      current: 3,
      replyIndex : null,
      replyBox:[],
      allComments: this.$store.state.posts.posts[this.post.id] && this.$store.state.posts.posts[this.post.id].comments !== null?
        this.$store.state.posts.posts[this.post.id].comments : []
    }
  },

  computed: {
    ...mapGetters({
      posts : 'posts/getPosts'
    }),

    ...mapActions(['posts/addPost']),
  },



  filters: {
    niceDate(value) {
      return  date.formatDate(value, 'MMMM D h:mmA')
    },

    reverse(items) {
      return items.slice().reverse()
    }
  },
  methods : {

    //-----------Get Comments start--------------------//
    getComments(post) {
      this.id = post.id
      this.loadingComments = true;
      let limit = 4;
      let  user_id = this.$auth.check()? this.$auth.user().id : 1
      let url = `${process.env.API}/posts/${post.id}/comments?user_id=${user_id}&page=${this.page}&perPage=${limit}`

      axios.get(url).then( response => {
        let fetchedPost = response.data.data
        fetchedPost.comments.forEach((comment) =>  {
          post.comments[comment.id] = comment
        })
        this.$store.commit('posts/addPost', post)
        this.comments = fetchedPost.comments



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
    },
    //-----------Get Comments end--------------------//


    //-----------------add comments start---------------------//
    addComment(comment, post){
      this.showBubble = null
      this.sendButton = null
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
      }

      if (comment === '' || comment === undefined){
        return;
      }

      const userId = this.$auth.user().id
      const apiUrl = process.env.API+"/posts/comment/"+post.id
      let data = {
        user_id:userId,
        comment: comment,
        post:post.id,
        position :this.posts.indexOf(post)
      }


      axios.post(apiUrl, data)
        .then(response => {
          const position = this.posts.indexOf(post)
          const currentPost = this.posts[position]


          currentPost.comments_count = response.data.data['comments_count']
          currentPost.comments_label = response.data.data['comments_label']
          currentPost.new_comment.comment = response.data.data.comment['comment']
          currentPost.new_comment.commenter = response.data.data.comment.commenter['name']
          currentPost.new_comment.avatar = response.data.data.comment['commenter']['photo_url']
          currentPost.new_comment.created_at = response.data.data.created_dates['created_at_human']


          let newComment = {
            id : response.data.data.comment['id'],
            comment:response.data.data.comment['comment'],
            commenter: {
              id:response.data.data.comment.commenter['id'],
              name:response.data.data.comment.commenter['name'],
              username:response.data.data.comment.commenter['username'],
              photo_url:response.data.data.comment.commenter['photo_url'],
              //   photo_url:this.$auth.user().photo_url
            },
            updated_dates:{
              updated_at: response.data.data.updated_dates['updated_at'],
              updated_at_human: response.data.data.updated_dates['updated_at_human']
            },
            created_dates:response.data.data.created_dates,
            //   childComments:{},
            //   parent:{},
            //   reaction_count: '',
            //   reactions: '',


          }

          let updatedPost = {
            id: post.id,
            comment : newComment
          }

          this.$store.commit('posts/addComment', updatedPost)

          this.getComments(post)

          this.commentBox = [];
        }).catch(error => {
        console.log(error)
      })
      this.commentBox = [];
    },
    //-----------------add comments end---------------------//


    //-----------react Comments start--------------------//
    reactComment(type,comment, post){
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
      }
      const userId = this.$auth.user().id
      const apiUrl = process.env.API+"/comments/comment/react/"+comment.id

      let data = {
        user_id:userId,
        type:type,
        post_id:post.id
      }
      axios.post(apiUrl, data)
        .then(response => {


          console.log(response)
          if (userId === response.data.user_id) {
            Object.entries(this.posts).forEach(([key, post]) => {
              if (post.id === response.data.post_id){
                for (var j = 0; j < post.comments.length ; j++) {
                  if (post.comments[j].id === response.data.comment_id) {
                    post.comments[j].reaction_count = response.data.reaction_count
                  }
                }
              }
            });
          }
        }).catch(error => {
        console.log(error)
      })
    },
    //-----------react Comments  end--------------------//


    showTypingBubble(){
      this.showBubble = true
      this.sendButton = true
    },

    hideTypingBubble(){
      this.showBubble = false
      // this.sendButton = false
    },

    showSend(){
      this.sendButton = true
    },

    switchInput(){
      return this.activeInput = !this.activeInput
    },

    switchReplyInput(index){
      return this.replyIndex = index
    },
    activateParentComment(){
      return this.activateAddComment = !this.activateAddComment
    },
    activateEditComment(comment){
      return true
    },
    editComment(comment){
      this.set = true
    },

    reactionEmoji(type){
      const Emoji = require('emoji-store');
      return Emoji.get(type)
    },



    // --------------- Live websocket methods start --------------//
    liveReply(data) {
      JSON.stringify(data)
      let sender = parseInt(data.comment.commenter.id)
      let userId = parseInt(this.$auth.user().id)
      let post = this.posts[data.position]

      let newComment = {
        id: data.comment.id,
        comment:data.comment.comment,
        commenter: {
          name:data.comment.commenter.name,
          photo_url:data.comment.commenter.avatar,
        },
        childComments:{},
        parent:{},
        reaction_count: '',
        reactions: '',
        updated_dates:data.updated_dates,
        created_dates:data.created_dates,

      }

      if (userId !== sender){
        post.comments.unshift(newComment)
        post.comments_count = data.comments_count
        this.posts[data.position].new_comment = data.comment.comment
      }

      let message = `${data.comment.commenter.name} says: ${data.comment.comment}`
      if (userId === sender) {
        message = `Your Comment has been added`
      }

      let postData = {
        message : message,
        avatar : data.comment.commenter.avatar,
        author : data.author,
        userId : userId,
        self: this
      }
      notification(postData)
    },
    liveReaction(data) {
      JSON.stringify(data)
      let post = this.posts[data.post.position]
      let userId = parseInt(this.$auth.user().id)

      if (data.post.reacter.id !== userId){
        post.likes_count = data.post.likes.likes_count
      }

      if (data.post.is_liked){
        let message = `${data.post.reacter.name} Likes Your Post`
        if (data.post.reacter.id === userId){
          message = `I like I like !!`
        }
        let postData = {
          message : message,
          avatar : data.post.reacter.avatar,
          author : data.post.author,
          userId : userId,
          self:this
        }
        notification(postData);
      }
    },
    reactedPost(post){
      this.postReacting = post
    },
    liveComment(data) {
      JSON.stringify(data)
      let sender = parseInt(data.comment.commenter.id)
      let userId = parseInt(this.$auth.user().id)
      let post = this.posts[data.position]

      let newComment = {
        id: data.comment.id,
        comment:data.comment.comment,
        commenter: data.comment.commenter.name,
        avatar : data.comment.commenter.avatar,
        childComments:{},
        parent:{},
        reaction_count: '',
        reactions: '',
        updated_dates:data.updated_dates,
        created_at:data.created_at,

      }

      if (userId !== sender){
        post.comments_count = data.comments_count
        post.comments_label = data.comments_label
        post.new_comment = data.comment
      }

      let message = `${data.comment.commenter.name} says: ${data.comment.comment}`
      if (userId === sender) {
        message = `Your Comment has been added`
      }

      let postData = {
        message : message,
        avatar : data.comment.commenter.avatar,
        author : data.author,
        userId : userId,
        self: this
      }
      notification(postData)
    },
    liveLike(data) {
      JSON.stringify(data)
      let post = this.posts[data.post.position]
      let userId = parseInt(this.$auth.user().id)

      if (data.post.reacter.id !== userId){
        post.likes_count = data.post.likes.likes_count
      }

      if (data.post.is_liked){
        let message = `${data.post.reacter.name} Likes Your Post`
        if (data.post.reacter.id === userId){
          message = `I like I like !!`
        }
        let postData = {
          message : message,
          avatar : data.post.reacter.avatar,
          author : data.post.author,
          userId : userId,
          self:this
        }
        notification(postData);
      }
    },
    liveFollow(data) {
      JSON.stringify(data)
      let userId = parseInt(this.$auth.user().id)
      let author = data.author.id
      let post = this.posts[data.position]
      post.user.follower_count = data.author.follower_count

      if (userId === author){
        this.$store.commit('auth/setUserFollowerCount', data.author.follower_count)
      }

      if (data.is_user_following){
        let postData = {
          message :`New Follower :  ${data.user.name} `,
          avatar : data.user.avatar,
          author : author,
          userId : userId,
          self: this
        }
        notification(postData);
      }
    },
    livePost(data) {
      JSON.stringify(data)
      let userId = this.$auth.user().id
      let author = data.post.user
      let authorId = data.post.user.id

      if (userId !== authorId) {
        this.posts.unshift(data.post)

        let postData = {
          message :`New Post from :  ${author.name} `,
          avatar : author.photo_url,
          author : authorId,
          userId : userId,
          self: this
        }

        this.$q.notify({
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

        notification(postData);
      }

    },
    // --------------- Live websocket methods start --------------//



    pusherData() {
      const pusher = new Pusher(process.env.PUSHER.KEY, {
        cluster: 'eu'
      });
      let self = this


      const commentChannel = pusher.subscribe('comment-channel');
      commentChannel.bind('App\\Events\\CommentCreatedEvent',
        function (data){
          console.log(data)
          self.liveComment(data)
        }
      )

      const replyChannel = pusher.subscribe('reply-channel');
      replyChannel.bind('App\\Events\\ChildCommentCreatedEvent',
        function (data){
          console.log(data)
          self.liveReply(data)
        }
      )

      const reactionChannel = pusher.subscribe('reaction-channel-comment');
      reactionChannel.bind('App\\Events\\CommentReactionEvent',
        function (data) {
          console.log(data)
          self.liveReaction(data)
        }
      );


      /*      const replyChannel = pusher.subscribe('reply-channel');
            replyChannel.bind('App\\Events\\ChildCommentCreatedEvent',
              function (data) {
                JSON.stringify(data)
                let user = parseInt(self.$auth.user().id)
                let sender =  parseInt(data.commenter_id)
                if (user !== sender ) {
                  Object.entries(self.posts).forEach(([key, post]) => {
                    for (var j = 0; j < post.comments.length ; j++) {
                      if (post.comments[j].id === data.comment.id) {
                        post.comments[j].childComments.length = data.comment.childComments.length
                        post.comments[j].childComments = data.comment.childComments.reverse()
                      }
                    }
                  });
                }
              }
            );


            const reactChannel = pusher.subscribe('react-channel');
            reactChannel.bind('App\\Events\\CommentReactionEvent',
              function (data) {
              self.liveLike(data)
              }
            );

            const postChannel = pusher.subscribe('post-channel');
            postChannel.bind('App\\Events\\PostCreatedEvent',
              function (data) {
                JSON.stringify(data)
                if (self.$auth.user().id !== data.post.id) {
                  self.posts.unshift(data.post)
                }
              }
            );*/
    },

    pushEcho(){
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'local',
        cluster: 'local',
        forceTLS: false,
        // wsHost:'127.0.0.1',
        wsHost:window.location.hostname,
        wsPort:6001,
        disableStats:true
      });
      let self = this


      const commentChannel = window.Echo.channel('comment-channel');
      commentChannel.listen('.App\\Events\\CommentCreatedEvent',
        function (data){
          self.liveComment(data)
        }
      );

      const replyChannel = window.Echo.channel('reply-channel');
      replyChannel.listen('.App\\Events\\ChildCommentCreatedEvent',
        function (data){
          self.liveReply(data)
        }
      );

      const reactionChannel = window.Echo.channel('reaction-channel-comment');
      reactionChannel.listen('.App\\Events\\CommentReactionEvent',
        function (data){
          self.liveReaction(data)
        }
      );

    },

  },

}
</script>

<style scoped>

</style>
