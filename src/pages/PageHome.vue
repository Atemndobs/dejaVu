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
                    class="text-bold">atem__ndobs</q-item-label>
                    <q-item-label caption>
                      {{post.location}}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-img :src="post.imageUrl"/>
      <!--        <img src="http://localhost:8000/storage/JPRFgcCF31wg8tii8Q45JpQ4lnanOENpfM2t73Oc.png" />-->
                <q-card-section>
                  <div >{{post.caption}}</div>
                  <div class="text-caption text-grey">{{post.created_at | niceDate}}</div>
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
                  Atemkeng
                </q-item-label>
              </q-item-section>
            </q-item>

        </div>
      </div>
  </q-page>
</template>

<script >
import { date } from 'quasar'
export default {
  name: 'Page',
  data() {
    return{
      posts: [],
      loadingPosts: false,

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
        console.log(response.data.data)
            this.posts= response.data.data.reverse()
            this.loadingPosts = false;
      })
      .catch(error => {
        this.$q.dialog({
          title: 'Error',
          message: 'Oops something went wrong, pls contact Atem'
        })
        this.loadingPosts = false;
      })
    }
  },

  created() {
    this.getPosts();
  },
};
</script>

<style lang="sass" scoped>
.card-post
  .q-im
    min-height: 200px
</style>
