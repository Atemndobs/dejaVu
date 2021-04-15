<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{price}}</div>
        <div class="text-subtitle2">{{ article }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat @click="trackPrice">
          {{check}}
        </q-btn>
        <q-btn flat>{{ search }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Software",
  data () {
    return {
      price:'Nothing',
      article:'Article',
      search:'Search',
      check:'check',
      apiUrl : process.env.API
    }
  },

  methods:{

    async trackPrice(){
      let data = {
        name : 'Adobe 2020 Master mac'
      }
      await axios.post(`${this.apiUrl}/tracker`, data)
        .then(response => {
          console.log(' RESPONSE ::')
          console.log(response.data.data)

          const {article, price} ={...response.data.data}

          this.article = article
          this.price = price


        }).catch(error => {
          console.log(error)
        })
    },
  }
}
</script>

<style scoped>

</style>
