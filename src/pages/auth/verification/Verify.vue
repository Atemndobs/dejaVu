<template>

  <q-page class="flex flex-center">
    <section >
      <div >
        <q-toolbar-title class="text-uppercase" fixed-center>
          Email Verification
        </q-toolbar-title>
        <form class="auth-form">
         <div class="form-group"  v-if="success">
            <div class="alert alert-success" absolute-center>
              {{this.$store.state.items.items.message}}
            </div>
            <q-btn
              to="/login"
              class="text-grey-6"
            >
              Preceed to login
            </q-btn>
          </div>
          <div class="form-group" v-else>
            <div class="alert alert-danger">
              Not Verified Pleas check your email again
            </div>
            <q-btn
              to="/verification/resend"
              class="text-grey-6"
            >
              Resend Verification Email
            </q-btn>
          </div>
        </form>
      </div>
    </section>
  </q-page>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "verify",
  data() {
    return {
      success:false
    }
  },

/*  preFetch({params, query, app }){
    const q = Object.keys(query)
      .map(k => `${k}=${query[k]}`)
      .join('&')
    console.log(q)

    const url = `/verification/verify/${params.id}?${q}`
    try {
    //  const {data} = app.$axios.post(url)
     // return { success: true, status: data.message}
    }catch (e) {
    //  return {success: false, status: e.response.data.errors.message}
      //return {status: url}
    }
  },*/
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    // urlPath and publicPath requires @quasar/app v2+

    // fetch data, validate route and optionally redirect to some other route...

    // ssrContext is available only server-side in SSR mode

    // No access to "this" here as preFetch() is called before
    // the component gets instantiated.

    // Return a Promise if you are running an async job
    // Example:



    try {
      //  const {data} = app.$axios.post(url)
      // return { success: true, status: data.message}
    }catch (e) {
      //  return {success: false, status: e.response.data.errors.message}
      //return {status: url}
    }

    return store.dispatch('items/fetchItem', currentRoute.fullPath)
  },

  computed: {
    // display the item from store state.
    item () {
      return this.$store.state.items[this.$route.params.id]
    },
  },
  methods: {
    verifyMessage(){
      if (this.$store.state.items && this.$store.state.items.items.message) {
        this.success = true;
      }
    },
  },
  mounted() {
    console.log(this.success)
    if (this.success !== true){
      this.verifyMessage();
    }
  }

}
</script>

<style scoped>

</style>
