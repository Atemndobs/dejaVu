<template>
  <q-page class="constrain q-pa-md">
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-sm-8">
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

          <!--   <q-img src="../statics/pixels/pexels-dazzle-jam-1064840.jpg" />     -->

          <q-card-section>
            <div >{{post.caption}}</div>
            <div class="text-caption text-grey">{{post.date | niceDate}}</div>
          </q-card-section>
      </q-card>
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
      posts: [
                {
          id: 1,
          caption: 'Marche Nkouloulou',
          date: 1597579910750,
          location:'Mokolo, Cameroon',
          imageUrl:'http://localhost:1337/uploads/pexels_yogendra_singh_3367460_35ac2105b8.jpeg'
         // imageUrl:'https://cdn.quasar.dev/img/parallax2.jpg'
        },
        {
          id: 2,
          caption: 'The Jam maker',
          date: 1597579910550,
          location:'Vienna, Austria',
          imageUrl: 'http://localhost:1337/uploads/pexels_omotayo_tajudeen_3213283_6b53fda5ca.jpeg'
        },
        {
          id: 3,
          caption: 'The Mean Stack',
          date: 1597579910650,
          location:'Malaga, Spain',
          imageUrl: 'http://localhost:1337/uploads/pexels_th_fingerstudio_3951481_c334659391.jpeg'
        },
        {
          id: 4,
          caption: 'Yoga Daily',
          date: 1595579910750,
          location:'Sicily, Italy',
          imageUrl: 'http://localhost:1337/uploads/pexels_rajesh_tp_1624487_c80e4673dc.jpeg'
        },
      ]
    }
  },
  filters: {
    niceDate(value) {
      return  date.formatDate(value, 'MMMM D h:mmA')
    }
  }
};
</script>

<style lang="sass" scoped>
.card-post
  .q-im
    min-height: 200px
</style>
