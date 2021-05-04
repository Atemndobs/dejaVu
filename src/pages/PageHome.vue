<template>
  <div>
    <q-page class="constrain q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-8">

          <template v-if="!loadingPosts && posts.length">
            <div v-for="(post, index) in posts" :key="post.id">
              <q-card
                bordered
                class="card-post q-mb-md"
                flat
              >
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="post.user.photo_url">

                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                      class="text-bold">

                    </q-item-label>
                    <q-item-label caption>
                      {{post.user.name}}
                    </q-item-label>
                    <q-item-label caption>
                      {{post.location}}
                    </q-item-label>
                  </q-item-section>
                  <!-------------- Follow _--------------->
                  <q-item-section
                    @click="follow(post, post.user.id)"
                  >
                    <q-item dense clickable v-ripple active="active" active-class="text-blue">
                      <q-icon
                        v-show="$auth.check() && $auth.user().id !== post.user.id"
                        :name="post.is_user_following?'eva-person-add':'eva-person-add-outline'"
                        color="blue"
                        size="18px"
                        rounded
                        dense
                        padding="xs"
                        flat
                      />
                      <div v-show="$auth.check() && $auth.user().id !== post.user.id">
                        {{post.is_user_following === true? 'following':'follow'}}
                      </div>
                      <q-space/>
                      <q-icon
                        :name="post.user.follower_count === 0?'eva-people-outline':'eva-people'"
                        color="blue"
                        size="18px"
                        rounded
                        dense
                        padding="xs"
                        flat
                      />
                      {{post.user.follower_count === 0?'':post.user.follower_count}}

                    </q-item>
                  </q-item-section>
                  <!-------------- Follow Ends _--------------->

                </q-item>

                <q-separator />
                <template>
                  <v-lazy-image
                    :src="post.imageUrl"
                    src-placeholder="https://cdn-images-1.medium.com/max/80/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
                  />
                </template>
                <q-card-section>
                  <!---------Post Section Start ------------->
                  <q-item-section>
                    <q-item-label caption>
                      <q-item>
                        <q-item-section >
                          <div class="text-black " >{{post.caption}}
                          <span class="text-caption text-grey " ref="postTimer" >
                            {{post.created_dates.created_at_human}}
                          </span>
                          </div>
                        </q-item-section>

                        <q-space/>

                        <!---------Like Section Start     post.loveReactant.icon_class ------------->
                        <q-icon
                          :name="post.is_liked ? 'eva-heart':'eva-heart-outline'"
                          :color="post.like_color"
                          size="20px"
                          @click="submitLike(post)"
                          rounded
                          dense
                          padding="xs"
                          flat
                        />
                        {{post.likes_count === 0 ? '': post.likes_count}}
                        <!---------Like Section End ------------->

                      </q-item>



                    </q-item-label>
                  </q-item-section>
                  <!---------Post Section End ------------->

                  <!---------Comment Display Section Start ------------->
                   <AllPostComments :post="post"/>

                  <!---------Comment Display Section End ------------->
                </q-card-section>
              </q-card>
            </div>
          </template>

          <template v-else-if="!loadingPosts && !posts.length">
            <h5 class="text-center text-grey">
              No POSTS HERE
            </h5>
          </template>
          <template v-else>
            <div class="q-pa-md">
              <q-card >
                <q-item>
                  <q-item-section avatar>
                    <q-skeleton type="QAvatar" animation="fade" size="40"/>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type="text" />
                    </q-item-label>
                    <q-item-label caption>
                      <q-skeleton type="text" />
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-skeleton height="200px" square />

                <q-card-actions align="right" class="q-gutter-md">
                  <q-skeleton type="QBtn" />
                  <q-skeleton type="QBtn" />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </div>
        <div class="col-4 large-screen-only">
          <q-item-section class="fixed">
            <q-item >
              <q-btn rounded flat to="/account/home">
                <q-avatar size="48px" >
                  <img :src="this.$auth.user()?this.$auth.user().photo_url:'favicon.ico'"  alt="profile image">
                </q-avatar>
              </q-btn>
              <q-item-section
                class="text-bold">{{this.$auth.user()?this.$auth.user().name:'Please Login'}}
              </q-item-section>
            </q-item>

            <q-item v-if="this.$auth.check()">
              <q-item-section  >
                <q-item-label caption class="text-overline text-gray q-pa-xs">
                  {{this.$auth.user()?this.$auth.user().formatted_address:'Please Login'}}
                </q-item-label>
                <q-item-label caption class="text-overline text-orange-9 q-pa-xs">
                  About me
                </q-item-label>
                <q-item-label caption class="q-pa-xs">
                  {{this.$auth.user()?this.$auth.user().about:''}}
                </q-item-label>
                <q-item-label caption class="text-teal-9 q-pa-xs">
                  {{this.$auth.user()?this.$auth.user().tagline:''}}
                </q-item-label>
                <q-item-label caption class="text-blue-9 q-pa-xs">
                  Followers : {{this.$auth.user()?this.$auth.user().follower_count:''}}
                </q-item-label>

                <q-item-label caption class="text-blue-9 q-pa-xs">
                  Following : {{this.$auth.user()?this.$auth.user().following_count:''}}
                </q-item-label>
                <q-item-label caption class="text-blue-9 q-pa-xs">
                   {{this.$auth.user().available_to_hire?'Available to hire':'Not Looking'}}
                </q-item-label>

                <q-item-label caption class="text-blue-9 q-pa-xs">
                  Posts : {{this.$auth.user()?this.$auth.user().post_count:''}}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-item-section>
        </div>
      </div>
    </q-page>

    <infinite-loading @infinite="infiniteHandler" spinner="bubbles" >

      <div slot="no-more">
        <h5 class="text-center text-grey">
          You are all caught up !
          {{ tada }}
        </h5>

      </div>
      <div slot="no-results">No POSTS HERE : Create your First Post! </div>
    </infinite-loading>

  </div>
</template>

<script>
import {date} from 'quasar'
import axios from "axios";
import Echo from 'laravel-echo'
import {emojiIndex, Picker} from 'emoji-mart-vue'
import InfiniteLoading from 'vue-infinite-loading';
import {VLazyImagePlugin} from "v-lazy-image";

import {mapState} from "vuex";
import Vue from "vue";
 import AllPostComments from "../components/Home/Comment/AllPostComments";

Vue.use(VLazyImagePlugin);

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
  name: 'Page',
  props:[],
  components: {
    AllPostComments,
    Picker,
    VLazyImagePlugin,
    InfiniteLoading,
  },

  data() {
    return{
      imageSrc: this.$auth.user()?this.$auth.user().photo_url:'favicon.ico',
      posts: [],
      commentBox:[],
      replyBox:[],
      loadingPosts: false,
      loadingComments: false,
      totalLikes: '',
      isLiked: false,
      reactionType:'eva-heart-outline',
      activeInput:null,
      activateAddComment:false,
      page: 1,
      tada:'',
      postReacting:{},
      showBubble:null,
      sendButton:null,

    }
  },

  filters: {
    niceDate(value) {
      return  date.formatDate(value, 'MMMM D h:mmA')
    },

    reverse(items) {
      return items.slice().reverse()
    }
  },

  methods: {

    infiniteHandler($state) {

      this.loadingPosts = true;
      let limit = 10;
      let url = `${process.env.API}/posts?&page=${this.page}&perPage=${limit}`

      axios.get(url)
        .then(({ data }) => {
        if (data.data.length) {
          this.loadingPosts = false;
          this.page += 1;
          this.posts.push(...data.data);
          $state.loaded();
        } else {
          $state.complete();
          this.loadingPosts = false;

          const Emoji = require('emoji-store');
          this.tada = Emoji.get('tada')
        }
      })
        .catch(error => {
          console.log(error)
          if (process.env.API){
            this.$q.dialog({
              title: 'Error',
              message: 'Oops something went wrong, pls contact the Admin'
            })
          }else {
            this.$q.dialog({
              title: 'Error',
              message: error.message
            })
          }
          this.loadingPosts = false;
        })
    },
// ------------------------ Comments  STRART------------------------//////////



    showTypingBubble(index){
      this.showBubble = index
      this.sendButton = index
    },

    hideTypingBubble(index){
      this.showBubble = index
      // this.sendButton = false
    },

    showSend(){
      this.sendButton = true
    },

    switchInput(){
      return this.activeInput = !this.activeInput
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


// ------------------------ Comments  END------------------------//////////



    // ----------------------  Like  start----------------------//
    submitLike(post){
      this.reactedPost(post)
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
      }
      const userId = this.$auth.user().id
      const apiUrl = process.env.API+"/posts/like/"+post.id

      let data = {
        user_id:userId,
        type:'Like',
        position :this.posts.indexOf(post)
      }

      axios.post(apiUrl, data)
        .then(response => {
          const position = this.posts.indexOf(post)
          const reaction_type = response.data.data.reaction_type

          if (reaction_type === data.type) {
            this.posts[position].is_liked = true
            this.posts[position].like_color = 'red'
            this.posts[position].likes_count = response.data.data.likes_count
          }else {
            this.posts[position].is_liked = false
            this.posts[position].like_color = 'black'
            this.posts[position].likes_count = response.data.data.likes_count
          }
          this.posts[position].loveReactant.likes_count = response.data.likes_count

      }).catch(error => {
        console.log(error)
      })
    },

    // ----------------------  Like  enbd----------------------//

//------------------- FOLLOW  start------------------------//
    follow(post, authorId){
      let christmas = emojiIndex.search('smile').map((o) => o.native)

      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Follow" })
        this.$router.push('/login')
        return
      }
      const userId = this.$auth.user().id
      if (userId === authorId){
       this.$q.dialog({ 'message' : "Hmmm! Trying to follow the man in the mirror ? " +
           "We admire the Self Love, but its recommended to follow someone else" + christmas })
        return
      }

      const apiUrl = process.env.API+"/user/follow/"+authorId
      let data = {
        author_id: authorId,
        position :this.posts.indexOf(post)
      }
      axios.post(apiUrl, data)
        .then(response => {
           post.is_user_following = response.data.is_user_following
           post.user.follower_count = response.data.follower_count
          this.$store.commit('auth/setUserFollowingCount', response.data.user_following_count)

        }).catch(error => {
        console.log(error)
      })
    },
//------------------- FOLLOW  end------------------------//



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


    // ############### WEB SOCKETS #####################//

    pusherData() {
      const pusher = new Pusher(process.env.PUSHER.KEY, {
        cluster: 'eu'
      });
      let self = this



      const likeChannel = pusher.subscribe('like-channel-post');
      likeChannel.bind('App\\Events\\LikeCreatedEvent',
        function (data) {
          console.log(data)
          self.liveLike(data)
        }
      );

      const followChannel = pusher.subscribe('follow-channel');
      followChannel.bind('App\\Events\\FollowCreatedEvent',
        function (data){
          self.liveFollow(data)
        }
      )

      const postChannel = pusher.subscribe('post-channel');
      postChannel.bind('App\\Events\\PostCreatedEvent',
        function (data){
          self.livePost(data)
        }
      )



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

      const likeChannel = window.Echo.channel(`like-channel-post`);
      likeChannel.listen('.App\\Events\\LikeCreatedEvent',
        function (data) {
        self.liveLike(data)
          }
        );

      const followChannel = window.Echo.channel('follow-channel');
      followChannel.listen('.App\\Events\\FollowCreatedEvent',
        function (data){
        self.liveFollow(data)
        }
        );

      const postChannel = window.Echo.channel(`post-channel`);
      postChannel.listen('.App\\Events\\PostCreatedEvent',
        function (data) {
        self.livePost(data)
        }
      );

      /*
      const replyChannel = window.Echo.channel('reply-channel');
      replyChannel.listen('.App\\Events\\ChildCommentCreatedEvent',
        function (data) {
          JSON.stringify(data)
          let user = parseInt(self.$auth.user().id)
          let sender =  parseInt(data.commenter_id)
          if (user !== sender) {
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

      */
/*
      const reactChannel = window.Echo.channel('react-channel');
      reactChannel.listen('.App\\Events\\CommentReactionEvent',
        function (data) {
          JSON.stringify(data)
        //  console.log('====== FROM THE SOCKET ======')
        //  console.log(data)
            let sender = parseInt(data.reacter_id)
            let user = parseInt(self.$auth.user().id)

            if (user !== sender) {
              Object.entries(self.posts).forEach(([key, post]) => {

                if (post.id === data.post_id){
                //  console.log('====== THE POST STOP======')
                 // console.log(data)

                  for (var j = 0; j < post.comments.length ; j++) {

                   // console.log(post.comments[j])
                    if (post.comments[j].id === data.comment_id) {

                      // console.log('====== IN THE LOOP ======')
                      // console.log(post.comments[j].reaction_count )
                      // console.log( data.reaction_count)

                      post.comments[j].reaction_count = data.reaction_count
                    }
                  }
                }
              });
            }
          });
      */

    },

    // ############## END WEB SOCKETS END #####################//
  },

  computed: {
    ...mapState('auth', [])
  },

  mounted() {
     this.pushEcho()
    if (process.env.PROD){
    //  this.pusherData()
    }

  },

};
</script>

<style lang="sass" scoped>
.heart
  .liked
    color: red
  .unliked
    color: black
.card-post
  .q-im
    min-height: 200px
.v-lazy-image
  filter: blur(10px)
  transition: filter 0.7s
.v-lazy-image-loaded
  filter: blur(0)

</style>

