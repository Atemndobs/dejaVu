<template>

  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <q-form
      class="q-gutter-md"
      @submit="onSubmit"
    >
      <div class="column q-pa-lg">
        <div class="row">
          <q-card square class="shadow-24" style="width:450px">
            <q-card-section class="bg-deep-purple-7">
              <h4 class="text-h5 text-white q-my-md text-center">Sign in</h4>
              <div class="absolute-bottom-right q-pr-md" >
                <q-btn fab icon="close" color="purple-4" to="/" />
              </div>
            </q-card-section>
            <q-card-section>

              <q-input
                square clearable
                :loading="loading"
                v-model.trim="data.body.email"
                type="email"
                label="Email"
                autofocus
                :rules="[val => !!val || 'Email is missing', isValidEmail]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                square clearable
                :loading="loading"
                v-model.trim="data.body.password"
                type="password"
                label="Password"
                :rules="[ val => !! val || 'Please type in your password']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-card-section>
            <br>
            <q-checkbox
              fixed-center
              id="rememberMe"
              v-model="data.rememberMe"
              :label="lang.auth.login.rememberMe"
            />
            <q-card-actions class="q-px-lg">
              <q-btn
                :label="lang.auth.login.login"
                :loading="loading"
                type="submit"
                unelevated
                size="lg"
                color="purple-4"
                class="full-width text-white"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-sm">
              <q-btn
                to="/login"
                class="text-grey-6"
              >
                Forgot your password?
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-form>


  </q-page>
</template>

<script>
export default {
  name: "login",
  data(){
    return {
      loading: false,
      rememberMe: false,
      lang: {
        auth: {}
      },
      data: {
        body: {
          email: 'johnny@email.co',
          password: 'pass1234'
        }
      }
    }
  },
  watch: {
    '$q.lang.isoName' (val) {
      this.__setupLang()
    }
  },
  beforeMount () {
    this.__setupLang()
  },
  methods: {
    __setupLang () {
      const isoName = this.$q.lang.isoName || 'en-us'
      let lang
      try {
        lang = require(`http-authentication/lang/${isoName}`)
      } catch (e) { }

      if (lang !== void 0) {
        this.lang.auth = { ...lang.default.auth }
      }
    },
    submit() {


      //   this.$axios.post(`${process.env.API}/login`, data).then(response =>
      this.$auth.login(this.data).then(response =>
      {
        console.log(response);
        //  this.$router.push('/login')

        this.$q.notify({
          message: 'LoggedIn',
          color: 'positive',
          // avatar: '../statics/avat_atem.png',
          avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
          actions: [
            { label: 'Dismis', color: 'white' }
          ]
        })
        //   this.$q.loading.hide();
      }).catch(error => {
        if (!navigator.onLine && this.backgroundSyncSupported){
          // redirrect to home page
          this.$q.notify('Could not login: '+error.message)
          this.$router.push('/');
        }
        else {
          this.$q.dialog({
            title: 'Error',
            message: 'Sorry could not Log in: '+error.message
          })
        }
        // this.$q.loading.hide()
      })
    },
    onSubmit () {
      this.loading = true
      this.$auth
        .login(this.data)
        .then(response => {
          this.$router.replace('/')
          this.$store.dispatch('auth/loginCallback')

        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              this.$q.dialog({
                message: this.lang.auth.login.verificationRequired
              })
            } else if (error.response.status === 403) {
              this.$q.dialog({
                message: this.lang.auth.login.invalidCredentials
              })
            } else if (error.response.status === 422){
              this.$q.dialog({
                message: error.response.data.message
              })
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    }

  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
