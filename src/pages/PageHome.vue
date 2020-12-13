<template>
  <q-page class="constrain q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-8">
          <template
          v-if="!loadingPosts && posts.length">
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
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                    class="text-bold"></q-item-label>
                    <q-item-label caption>
                      {{post.location}}
                    </q-item-label>

                  </q-item-section>

                </q-item>

                <q-separator />


                <q-img :src="post.imageUrl"/>

                <q-card-section>



                  <q-item-section>
                    <q-item-label
                      class="text-bold">
                    </q-item-label>
                    <q-item-label caption>



                      <q-item>
                        <q-item-section >
                          <div >{{post.caption}}</div>
                          <div class="text-caption text-grey">{{post.created_at | niceDate}}</div>
                        </q-item-section>
                        <q-item-section >
                          <div >{{post.new_comment.comment}}</div>
                          <div class="text-caption text-grey">{{post.created_at | niceDate}}</div>
                        </q-item-section>


                        <q-btn
                          @click="submitLike(post)"
                          rounded
                          dense
                          :label="post.likes.likes_count"
                        >
                          <q-icon
                            :name="reactionType"
                            :color="isLiked? 'red' : ''"
                            size="25px"
                            rounded
                          />

                        </q-btn>
                      </q-item>


                      <div class="row justify-center q-ma-md">
                        <q-input
                          label="Comment*"
                          v-model="post.comment"
                          class="col col-sm-6"
                          dense
                          @keydown.enter.prevent="addComment(post.comment, post)"
                        />
                      </div>


                    </q-item-label>


                  </q-item-section>


                  <q-list bordered class="rounded-borders">
                    <q-expansion-item
                      expand-separator
                      icon="eva-message-circle-outline"
                      label="View Comments"
                      :caption="post.comments_count + ' comments'"
                      default-closed
                    >
                      <q-chat-message
                        v-for="(comment, index) in post.comments"
                        :key="comment.id"
                        :name="comment.commenter.name"
                        :avatar="comment.commenter.photo_url"
                        :text="[comment.comment]"
                        size="6"
                        :stamp="comment.created_at | niceDate"
                        text-color="white"
                        bg-color="primary"
                      />
                    </q-expansion-item>
                  </q-list>





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

<script >
import { date } from 'quasar'
import axios from "axios";
export default {
  name: 'Page',
  data() {
    return{
      posts: [],
      comments: {},
      commentBox:'',
      loadingPosts: false,
      totalLikes: '',
      isLiked: false,
      reactionType:'eva-heart-outline'

    }
  },
  filters: {
    niceDate(value) {
      return  date.formatDate(value, 'MMMM D h:mmA')
    }
  },
  methods: {
    getPosts() {

    //  console.log(`${process.env.API}/posts`);

      this.loadingPosts = true;
      this.$axios.get(`${process.env.API}/posts`).then(response => {
       // console.log(response.data.data.likes)
            this.posts= response.data.data.reverse()
            this.loadingPosts = false;

      })
      .catch(error => {
        console.log(error)
        this.$q.dialog({
          title: 'Error',
          message: 'Oops something went wrong, pls contact Atem'
        })
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

      axios.post(apiUrl, data)
        .then(response => {
          const reaction_type = response.data.data.likes.reaction_type
          if (reaction_type === 'Like') {
            this.reactionType = 'eva-heart'
            this.isLiked = true
          }else {
            this.reactionType = 'eva-heart-outline'
            this.isLiked = false
          }

          console.log(response.data.data.likes.likes_count)
      }).catch(error => {
        console.log(error)
      })
    },

    addComment(comment, post){
      console.log('Post Comment')
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

      console.log('COMMENTATBL:=>    ' + post.id)
      console.log('POST DATA:=>    ' + comment)

      axios.post(apiUrl, data)
        .then(response => {
          const new_comment = response.data.data.new_comment

          //this.comments.unshift(response.data);


          this.comment = "";

          console.log(this.comment)

          console.log(response.data.data)
        }).catch(error => {
        console.log(error)
      })
    },

  },

  created() {
    this.getPosts();
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
