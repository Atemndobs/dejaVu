<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Current Price : {{price}}</div>
        <div class="text-subtitle2">article: {{ article }}</div>
        <div class="text-subtitle2" >model: {{ model }}</div>
        <div class="text-subtitle2">color: {{ color }}</div>
        <div class="text-subtitle2" >condition: {{ condition }}</div>
      </q-card-section>
      <q-separator />

      <q-card-actions align="right">
        <q-btn flat @click="trackPhone(text)">
          {{check}}
        </q-btn>
        <q-input label="spec" v-model="text" @keyup.enter="trackPhone(text)" v-show="input"/>
        <q-select outlined v-model="text" :options="options" @keyup.enter="trackPhone(text)">

        </q-select>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Iphone",
  data () {
    return {
      price:'Nothing',
      article:'Article',
      search:'Search',
      check:'check',
      model: null,
      condition : '',
      color : '',
      apiUrl : process.env.API,
      spec : 256,
      show : false,
      text:'',
      input:true,
      options: [64,256],
    }
  },

  methods:{

    async trackPhone(spec){
      let size = spec ? spec : 256

      await axios.get(`${this.apiUrl}/tracker/check/iphone?spec=${size}`)
        .then(response => {
          console.log(' RESPONSE ::')
        //  console.log(response.data.data)
          const {article, details} ={...response.data.data}

          this.article = article
          this.price = details.price

          this.model = details.spec
          this.color = details.color
          this.condition = details.condition

          this.show = true
          this.input = false
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
