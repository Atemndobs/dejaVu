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
                          <div >{{post.caption}}</div>
                          <div class="text-caption text-grey" ref="postTimer" >
                            {{post.created_dates.created_at_human}}
                          </div>
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

                        <q-space/>

                        <!---------Like Section Start     post.loveReactant.icon_class ------------->
                        <q-icon
                          :name="post.is_liked ? 'eva-heart':'eva-heart-outline'"
                          :color="post.is_liked ? 'red' : 'black'"
                          size="20px"
                          @click="submitLike(post)"
                          rounded
                          dense
                          padding="xs"
                          flat
                        />
                        {{post.likes_count === 0?'':post.likes_count}}
                        <!---------Like Section End ------------->

                      </q-item>


                      <!---------Comment Input Section ------------->
                      <q-input
                        label="Add comment"
                        v-model="commentBox[index]"
                        class="col col-sm-6"
                        dense
                        @keydown.enter.prevent="addComment(commentBox[index], post)"
                        icon="eva-message-circle-outline"
                        options-dens
                        @keyup.esc="commentBox[index]=''"
                      >
                        <template v-slot:before>
                          <q-avatar >
                            <img :src="$auth.user()?$auth.user().photo_url:'favicon.ico'">
                          </q-avatar>
                        </template>
                        <template v-slot:after>
                          <q-btn
                            round dense flat icon="send"
                            @click.prevent="addComment(commentBox[index], post)"
                          />
                        </template>
                      </q-input>
                      <!---------Comment Input Section ------------->

                    </q-item-label>
                  </q-item-section>
                  <!---------Post Section End ------------->

                  <!---------Comment Display Section Start ------------->

                  <q-list bordered class="rounded-borders">

                    <q-expansion-item
                      v-show="post.comments_count > 0"
                      expand-separator
                      icon="eva-message-circle-outline"
                      :caption="'latest : ' + post.new_comment"
                      :label="post.comments_count + ' comments'"
                      default-closed
                    >

                      <!---------Comment Start ------------->
                      <q-card >
                        <q-card-section v-for="(comment, index) in post.comments"  :key="comment.id" @click="emoShow = false">
                          <!---------Edit Comment Start ------------->
                          <template >
                            <div class="q-pa-md" v-show="activeInput">
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
                          </template>
                          <!---------Edit Comment End ------------->
                          <!---------Comment Reactions Start ------------->
                          <q-item >
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

                          </q-item>
                          <!---------Comment Reactions  End------------->
                          <q-chat-message
                            @click="switchInput"
                            :name="comment.commenter.name"
                            :avatar="comment.commenter.photo_url"
                            position="up"
                            :text="[comment.comment]"
                            size=""
                            :stamp="comment.created_dates.created_at_human"
                            text-color="black"
                            bg-color="blue-grey-1"
                            dense
                          >
                          </q-chat-message>
                          <!---------Comment Reply Input Start  ------------->
                          <q-input
                            v-show="activeInput"
                            switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
                            label="...whats your opinion"
                            v-model="replyBox[index]"
                            class="col col-sm-6"
                            dense
                            @keydown.enter.prevent="replyComment(replyBox[index], comment,post)"
                            icon="eva-message-circle-outline"
                            options-dens
                            @keyup.esc="replyBox[index]=''"
                          >
                            <template v-slot:before>
                              <q-avatar>
                                <img :src="$auth.user()?$auth.user().photo_url:'https://cdn.quasar.dev/img/avatar5.jpg'">
                              </q-avatar>
                            </template>
                            <template v-slot:after>
                              <q-btn
                                round dense flat icon="send"
                                @click.prevent="replyComment(replyBox[index], comment, post)"
                              />
                            </template>
                          </q-input>
                          <div class="row justify-center q-ma-md">
                          </div>
                          <!---------Comment Reply Input End ------------->

                          <!---------Comment  ------------->

                          <!---------Replies  ------------->
                          <q-expansion-item
                            v-show="comment.childComments.length > 0"
                            switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
                            expand-separator
                            icon="eva-message-circle"
                            label="All reactions"
                            :caption="comment.childComments.length + ' reactions'"
                            default-closed
                            bg-color="blue-grey-12"
                          >
                            <q-chat-message
                              v-if="comment.childComments.length > 0"
                              v-for="(childComment, index) in comment.childComments"
                              :key="childComment.id"
                              :name="childComment.commenter.name"
                              :avatar="childComment.commenter.photo_url"
                              position="up"
                              :text="[childComment.comment]"
                              :stamp="childComment.created_at | niceDate"
                              text-color="dark-blue"
                              bg-color="amber-1"
                              dense
                              label=""
                              sent
                            />

                          </q-expansion-item>
                          <!---------Replies  ------------->

                        </q-card-section>
                      </q-card>
                      <!---------Comment End ------------->

                    </q-expansion-item>
                  </q-list>
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
import { emojiIndex } from 'emoji-mart-vue'
import InfiniteLoading from 'vue-infinite-loading';
import { VLazyImagePlugin } from "v-lazy-image";
import { Picker } from 'emoji-mart-vue'

import {mapState} from "vuex";
import Vue from "vue";
Vue.use(VLazyImagePlugin);

window.Pusher = require('pusher-js');

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
  components: {
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
      totalLikes: '',
      isLiked: false,
      reactionType:'eva-heart-outline',
      cars:[],
      activeInput:false,
      activateAddComment:false,
      page: 1,
      tada:'',
      postReacting:{},
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
      let  user_id = this.$auth.check()? this.$auth.user().id : 1
      let url = `${process.env.API}/posts?user_id=${user_id}&page=${this.page}&perPage=${limit}`

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

    reactionEmoji(type){
      const Emoji = require('emoji-store');
      return Emoji.get(type)
    },

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
            this.posts[position].likes_count = response.data.data.likes_count
          }else {
            this.posts[position].is_liked = false
            this.posts[position].likes_count = response.data.data.likes_count
          }
          this.posts[position].loveReactant.likes_count = response.data.likes_count

      }).catch(error => {
        console.log(error)
      })
    },

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

    addComment(comment, post){
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
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
          const position = data.position
          const currentPost = this.posts[position]
          currentPost.comments_count = response.data.data['comment_count']
          currentPost.new_comment = response.data.data.comment['comment']

          let newComment = {
            id:'',
            comment:response.data.data.comment['comment'],
            commenter: {
              name:response.data.data.comment.commenter['name'],
              photo_url:this.$auth.user().photo_url
            },
            childComments:{},
            parent:{},
            reaction_count: '',
            reactions: '',
            updated_dates:response.data.data.updated_dates,
            created_dates:response.data.data.created_dates,

          }
          currentPost.comments.unshift(newComment)
          this.commentBox = [];
        }).catch(error => {
        console.log(error)
      })
      this.commentBox = [];
    },

    replyComment(reply,comment, post){
      if (!this.$auth.check()){
        this.$q.dialog({ 'message' : "You need to Login Before you can Like" })
        this.$router.push('/login')
        console.log({
          'Error' : 'You need to log in to react to a post'
        })
        return
      }

      const apiUrl = process.env.API+"/comments/comment/"+comment.id
      let data = {
        comment: reply,
      }
      axios.post(apiUrl, data)
        .then(response => {
          const position = this.posts.indexOf(post)
          const currentPost = this.posts[position]
          const commentPosition = this.posts[position].comments.indexOf(comment)

          let newComment = {
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

          currentPost.comments[commentPosition].childComments.unshift(newComment)
        }).catch(error => {
        console.log(error)
      })
      this.replyBox = []
    },

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

    // ############### WEB SOCKETS #####################//

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
    this.pusherData()
    if (process.env.API.PROD){
      this.pusherData()
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

