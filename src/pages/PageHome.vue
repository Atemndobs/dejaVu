<template>
  <q-page class="constrain q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-8">
          <template v-if="!loadingPosts && posts.length">
            <q-card
                v-for="(post, index) in posts"
                :key="post.id"
                bordered
                class="card-post q-mb-md"
                flat
                >
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="../statics/avat_atem.png">
<!--                      <img :src="post.author.photo_url">-->

                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                    class="text-bold">

                    </q-item-label>
                    <q-item-label caption>
                      {{post.author.name}}
                    </q-item-label>
                    <q-item-label caption>
                      {{post.location}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
<!--

              <emoji :emoji="{ id: 'monkey_face', skin: 3 }" :size="16" />
-->




                <q-separator />

                <q-img :src="post.imageUrl"/>

                <q-card-section>
                  <!---------Post Section Start ------------->
                  <q-item-section>
                    <q-item-label caption>
                      <q-item>
                        <q-item-section >
                          <div >{{post.caption}}</div>
                          <div class="text-caption text-grey" ref="postTimer" >{{post.created_dates.created_at_human}}</div>
                        </q-item-section>
                        <!-------------- Follow _--------------->
                        <q-item-section >
<!--                          {{post.author.follow}}-->

                          <q-item dense clickable v-ripple active="active" active-class="text-blue">
                            <q-btn
                              size="10px"
                              class="q-px-xs"
                              color="blue"
                              :label="post.author.follow.is_user_following?'FOLLOWING':'FOLLOW'"
                              icon="eva-person-add-outline"
                              dense
                              flat
                              padding="xs"
                              @click="follow(post, post.author.id)"
                            />
<!--                            <q-item-section avatar>
                              <q-icon name="eva-person-add-outline" />
                            </q-item-section>-->
                            <q-item-section>
                              <q-btn
                                size="10px"
                                class="q-px-xs"
                                color="blue"
                                :label="post.author.follow.follower_count === 0?'':post.author.follow.follower_count"
                                icon="eva-people"
                                dense
                                flat
                                padding="xs"
                              />
<!--                              {{post.author.follow.following_count ===0}}-->
                            </q-item-section>
                            <q-item-section>
                              <q-btn
                                size="10px"
                                class="q-px-xs"
                                color="blue"
                                :label="post.author.follow.following_count===0?'':post.author.follow.following_count"
                                icon="eva-people-outline"
                                dense
                                flat
                                padding="xs"
                              />
<!--                              {{post.author.follow.following_count}}-->
                            </q-item-section>
<!--                            <q-item-section side>{{post.author.follow.following_count}}</q-item-section>-->
                          </q-item>
                        </q-item-section>
                        <!-------------- Follow _--------------->

                        <!---------Like Section Start ------------->
                        <q-btn
                          @click="submitLike(post)"
                          rounded
                          dense
                          :label="post.likes.likes_count === 0?'':post.likes.likes_count"
                          padding="xs"
                        >
                          <q-icon
                            :name="post.likes.icon_class"
                            :color="post.likes.is_liked? 'red' : ''"
                            size="30px"
                            rounded
                          />
                        </q-btn>
                        <!---------Like Section End ------------->
                      </q-item>
                      <!---------Click to activate Input Start------------->
                      <q-btn
                        color="grey-1"
                        text-color="black"
                        size="10px"
                        label="Add comment"
                        icon="eva-plus-circle-outline"
                        dense
                        @click="activateParentComment"
                      />
                      <!---------Click to activate Input End------------->


                      <!---------Comment Input Section ------------->
                      <q-input
                        v-if="activateAddComment"
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
                          <q-avatar>
                            <img src="https://cdn.quasar.dev/img/avatar5.jpg">
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
                      v-show="post.comments_count >0"
                      expand-separator
                      icon="eva-message-circle-outline"
                      :caption="'latest : ' + post.new_comment.comment"
                      :label="post.comments_count + ' comments'"
                      default-closed
                    >

                      <!---------Comment Start ------------->
                        <q-card >
                          <q-card-section v-for="(comment, index) in post.comments"  :key="comment.id">

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
<!--
                            {{comment.reaction_count}}-->
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
                                >
                                <q-fab-action
                                  @click="reactComment('Like',comment, post)"
                                  icon="thumb_up"
                                  external-label
                                  label-position="top"
                                  text-color="red"
                                  :label="comment.reaction_count[1] > 0 ? comment.reaction_count[1]  :'' "
                                  padding="xs"
                                />
                                <q-fab-action
                                  @click="reactComment('DisLike',comment, post)"
                                  icon="thumb_down"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[2]  > 0 ? comment.reaction_count[2]  :''"
                                  padding="xs"
                                />
                                <q-fab-action
                                  @click="reactComment('Happy',comment, post)"
                                  icon="eva-smiling-face-outline"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[5]  > 0 ? comment.reaction_count[5]  :''"
                                  padding="xs"
                                />
                                  <q-fab-action
                                    @click="reactComment('DisHappy',comment, post)"
                                    icon="eva-person-done-outline"
                                    external-label
                                    label-position="top"
                                    text-color="amber"
                                    :label="comment.reaction_count[6]  > 0 ? comment.reaction_count[6]  :''"
                                    padding="xs"
                                  />
                                  <q-fab-action
                                  @click="reactComment('Surprise',comment, post)"
                                  icon="eva-twitter-outline"
                                  external-label
                                  label-position="top"
                                  text-color="blue"
                                  :label="comment.reaction_count[7]  > 0 ? comment.reaction_count[7]  :''"
                                  padding="xs"
                                />
                                  <q-fab-action
                                  @click="reactComment('Smile',comment, post)"
                                  icon="eva-eye-outline"
                                  external-label
                                  label-position="top"
                                  text-color="black"
                                  :label="comment.reaction_count[9] > 0 ? comment.reaction_count[9]  :''"
                                  padding="xs"
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
                              label=""
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
<!--                                  <img src="https://cdn.quasar.dev/img/avatar5.jpg">-->
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
            <q-item class="fixed">
              <q-item-section avatar>
                <q-avatar size="48px">
                  <img src="../statics/avat_atem.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label
                class="text-bold">atem__ndobs</q-item-label>
                <q-item-label caption>
                   {{this.$auth.user()?this.$auth.user().name:'Atemkeng'}}
                </q-item-label>
              </q-item-section>
            </q-item>

        </div>
      </div>
  </q-page>
</template>

<script>
import {date} from 'quasar'
import axios from "axios";
import Echo from 'laravel-echo'
import { Emoji } from 'emoji-mart-vue'
import { emojiIndex } from 'emoji-mart-vue'
import { emojis } from 'emoji-mart-vue'

export default {
  name: 'Page',
  components: {
    Emoji,
    emojiIndex,
    emojis
  },
  data() {
    return{
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

    getPosts() {
      this.loadingPosts = true;

       let  user_id = this.$auth.check()? this.$auth.user().id : null

      console.log(this.$auth.check())
      console.log(user_id)

      this.$axios.get(`${process.env.API}/posts?user_id=`+user_id ).then(response => {
            this.posts= response.data.data.reverse()

       // console.log(this.$auth.user().id)
        console.log(this.posts[0].author.id)
        console.log(this.posts[0].author.follow)
        console.log(this.posts[0])



        if (this.$auth.check()){
          for (let i = 0; i < this.posts.length; i++) {


            this.posts[i].author.follow = response.data.data[i].author.follow

            this.posts[i].comments = response.data.data[i].comments.reverse()
            for (var j = 0; j < this.posts[i].comments.length ; j++){
              this.posts[i].comments[j].childComments = response.data.data[i].comments[j].childComments.reverse()
            }


            const reactions = response.data.data[i].reactions

            const result = Object.keys(reactions).map(function(key) {
              return  reactions[key];
            });

            let existing_reaction = result.find(
              o => o.reacter_id === this.$auth.user().id
                && o.reactant_id === response.data.data[i].id
            );

            if (existing_reaction){
              this.posts[i].likes.icon_class = 'eva-heart'
              this.posts[i].likes.is_liked = true
            }

          }
        }

        this.loadingPosts = false;

      })
      .catch(error => {
        console.log(error)
        if (process.env.API === 'http://localhost:8000/api'){
          this.$q.dialog({
            title: 'Error',
            message: 'Oops something went wrong, pls contact Atem'
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

    submitLike(post){

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
        post:post
      }

     // console.log(data)
      axios.post(apiUrl, data)
        .then(response => {

          console.log(' RESPONSE ::')

          console.log(response.data.data)
          const position = this.posts.indexOf(post)
          const reaction_type = response.data.likes.reaction_type
          if (reaction_type === 'Like') {
            this.posts[position].likes.icon_class = 'eva-heart'
            this.posts[position].likes.is_liked = true
          }else {
            this.posts[position].likes.icon_class = 'eva-heart-outline'
            this.posts[position].likes.is_liked = false
            this.reactionType = 'eva-heart-outline'

          }

          this.posts[position].likes.likes_count = response.data.likes.likes_count


      }).catch(error => {
        console.log(error)
      })
    },

    reactComment(type,comment, post){
      // console.log('====== Add reaction to Comment ======')
     // console.log(type)

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

          console.log(' RESPONSE ::')
          console.log(response.data)

         // const position = this.posts.indexOf(post)
        //  const reaction_type = response.data.reaction_type
          if (userId === response.data.user_id) {
            Object.entries(this.posts).forEach(([key, post]) => {

              if (post.id === response.data.post_id){
                 // console.log('====== THE POST STOP======')
                for (var j = 0; j < post.comments.length ; j++) {
                  if (post.comments[j].id === response.data.comment_id) {
                    // console.log('====== IN THE LOOP ======')
                   // console.log(post.comments[j].reaction_count )
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
        post:post,
      }


      axios.post(apiUrl, data)
        .then(response => {

          const position = this.posts.indexOf(post)
          this.posts[position].new_comment = response.data.data.new_comment
          this.posts[position].comments_count = response.data.data.comments_count
          if (this.$auth.check()){
            this.posts[position].comments.unshift(response.data.data.new_comment)
          }

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
          const commentPosition = this.posts[position].comments.indexOf(comment)
          this.posts[position].comments[commentPosition].childComments.length = response.data.parent.childComments.length
          this.posts[position].comments[commentPosition].childComments = response.data.parent.childComments.reverse()

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
        console.log({
         // 'Error' : 'You need to log in to react to a post'
        })
        return
      }

      const userId = this.$auth.user().id

      if (userId === authorId){
       this.$q.dialog({ 'message' : "Hmmm! It looks like you are trying follow yourself" + christmas })
        //this.$q.dialog({ 'message' : '<emoji :emoji="{ id: \'santa\', skin: 3 }" :size="16" />' })

        console.log(emojiIndex.search('christmas'))
        return
      }

      const apiUrl = process.env.API+"/user/follow/"+authorId
      let data = {
        'author_id': authorId
      }
      axios.post(apiUrl, data)
        .then(response => {

          console.log(' RESPONSE ::')
          console.log(response.data)

          const position = this.posts.indexOf(post)
          console.log(this.posts[position].author.follow)

          this.posts[position].author.follow = response.data


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

    pusherData()
    {
      const pusher = new Pusher('8643c99a8b00ff38c513', {
        cluster: 'eu'
      });
      let self = this

      const commentChannel = pusher.subscribe('comment-channel');
      commentChannel.bind('App\\Events\\CommentCreatedEvent',
        function (data) {
          console.log('COMMING FROM PUSSHER ====================')
         JSON.stringify(data)
          Object.entries(self.posts).forEach(([key, post]) => {


            let sender = parseInt(data.new_comment.commenter_id)
            let user = parseInt(self.$auth.user().id)

            if (sender !== user || !this.$auth.check()) {
              if (post.id === data.post_id) {
                post.comments_count = data.comments_count
                post.new_comment = data.new_comment
                post.comments.unshift(data.new_comment)

                  // console.log(data)
              }
            }
          });
        }
      )

      const replyChannel = pusher.subscribe('reply-channel');
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

      const likeChannel = pusher.subscribe('like-channel');
      likeChannel.bind('App\\Events\\LikeCreatedEvent',
        function (data) {
          JSON.stringify(data)

          Object.entries(self.posts).forEach(([key, post]) => {

            let sender = parseInt(data.post.reacter_id)
            let user = parseInt(self.$auth.user().id)


            if (sender !== user ) {
              if (post.id === data.post.id){
                const position = self.posts.indexOf(post)
                self.posts[position].likes.likes_count = data.post.likes.likes_count
                // console.log('OLD LIKES :: ' +  self.posts[position].likes.likes_count)
                // console.log('NEW COUNT ' +  data.post.likes.likes_count)
              }

            }

          });
        }
      );

      const reactChannel = pusher.subscribe('react-channel');
      reactChannel.bind('App\\Events\\CommentReactionEvent',
        function (data) {
          JSON.stringify(data)
          //  console.log('====== FROM THE SOCKET ======')
          //  console.log(data)
          let sender = parseInt(data.reacter_id)
          let user = parseInt(self.$auth.user().id)

          if (sender !== user){
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

          // notification
          /*            if (data.post.likes.reaction_type === 'Like') {
                        self.$q.notify({
                          message: 'Someone Likes Your Post',
                          color: 'positive',
                          progress: true,
                          count:1,
                          // avatar: '../statics/avat_atem.png',
                          avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
                          actions: [
                            { label: 'Dismis',
                              color: 'white',
                              handler: () => { /!* ... *!/ }
                            }
                          ]
                        })
                      }*/

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
      );
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
        function (data) {
          JSON.stringify(data)
          let sender = parseInt(data.new_comment.commenter_id)
          let user = parseInt(self.$auth.user().id)
          console.log(user)
          console.log(sender)
          if (user !== sender){
            Object.entries(self.posts).forEach(([key, post]) => {
              if (post.id === data.post_id){
                post.comments_count = data.comments_count
                post.new_comment = data.new_comment
                post.comments.unshift(data.new_comment)
              }
            });
          }
        }
        );

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

      const likeChannel = window.Echo.channel('like-channel');
      likeChannel.listen('.App\\Events\\LikeCreatedEvent',
        function (data) {
          JSON.stringify(data)
        //  console.log('LIKE CHANNEL')

          Object.entries(self.posts).forEach(([key, post]) => {

            let sender = parseInt(data.post.reacter_id)
            let user = parseInt(self.$auth.user().id)

            if (post.id === data.post.id){
              const position = self.posts.indexOf(post)
              self.posts[position].likes.likes_count = data.post.likes.likes_count
              // console.log('OLD LIKES :: ' +  self.posts[position].likes.likes_count)
              // console.log('NEW COUNT ' +  data.post.likes.likes_count)
            }

            if (data.post.likes.reaction_type === 'Like') {
              self.$q.notify({
                message: 'Someone Likes Your Post',
                color: 'positive',
                progress: true,
                count:1,
                // avatar: '../statics/avat_atem.png',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
                actions: [
                  { label: 'Dismis',
                    color: 'white',
                    handler: () => { /* ... */ }
                  }
                ]
              })
            }

          });
        }
        );

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

              // notification
/*            if (data.post.likes.reaction_type === 'Like') {
              self.$q.notify({
                message: 'Someone Likes Your Post',
                color: 'positive',
                progress: true,
                count:1,
                // avatar: '../statics/avat_atem.png',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
                actions: [
                  { label: 'Dismis',
                    color: 'white',
                    handler: () => { /!* ... *!/ }
                  }
                ]
              })
            }*/

          });

      const postChannel = window.Echo.channel('post-channel');
      postChannel.listen('.App\\Events\\PostCreatedEvent',
        function (data) {
          JSON.stringify(data)

         // console.log(data.post)
          if (self.$auth.user().id !== data.post.id) {
            console.log('RECIEVING THE POST')
            self.posts.unshift(data.post)
          }
        }
      );
    },

    activateEditComment(comment){
      return true
    },

    editComment(comment){
      this.set = true
      console.log(comment)
    },

  },

  created() {
    setTimeout(()=>{
      this.getPosts()
    }, 100)

  },

  mounted() {

    if (!this.$auth.user()){
      if (process.env.API === 'http://localhost:8000/api'){
        this.pushEcho()
      }else {
        this.pusherData()
      }
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
</style>

