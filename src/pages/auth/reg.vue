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
          <q-card square class="shadow-24" style="width:500px">
            <q-card-section class="bg-deep-purple-7">
              <h4 class="text-h5 text-white q-my-md text-center">Registration</h4>
              <div class="absolute-bottom-right q-pr-md" >
                <q-btn fab icon="close" color="purple-4" to="/" />
              </div>
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-xl q-pb-lg">
                <q-input
                  square clearable
                  v-model.trim="data.name"
                  type="email"
                  label="Full Names"
                  autofocus
                  :rules="[ val => !! val || 'Please type in your names']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <q-input
                  square clearable
                  v-model.trim="data.username"
                  type="username"
                  label="Username"
                  :rules="[ val => !! val || 'Please type in a Username']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <q-input
                  square clearable
                  v-model.trim="data.email"
                  type="email"
                  label="Email"
                  :rules="[val => !!val || 'Email is missing', isValidEmail]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <q-input
                  square clearable
                  v-model.trim="data.password"
                  type="password"
                  hint="Enter your password"
                  :rules="[
                $rules.required('Password is required'),
                $rules.minLength(6, 'Password have at least 6 letters'),
              ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <q-input
                  square clearable
                  v-model.trim="data.password_confirmation"
                  type="password"
                  hint="Confirm your password"
                  :rules="[
                $rules.required('Please confirm your password'),
                $rules.sameAs(data.password, 'Must be same as Password')
              ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-lg">
              <q-btn
                type="submit"
                unelevated
                size="lg"
                color="purple-4"
                class="full-width text-white"
                label="Get Started" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-sm">
              <q-btn
                to="/login"
                class="text-grey-6"
              >
                Return to login
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-form>

  </q-page>


</template>

<script>
import {} from 'quasar-app-extension-vuelidate-rules'

export default {

  name: "register",

  data(){
    return {
      regEmail: "",
      lang: {
        auth: {}
      },
      data: {
        name: "Obama Don" ,
        username: 'obama',
        email: 'obama@email.com',
        password: 'pass1234',
        password_confirmation: 'pass1234',
      },
      showPassword: {
        password: false,
        repeatPassword: false
      }
    }
  },
  methods: {
    /*  submit() {

        let data = {
          'name':this.form.name,
          'username':this.form.username,
          'email' : this.form.email,
          'password': this.form.password,
          'password_confirmation': this.form.password_confirmation
        }
        console.log(data)

        this.$axios.post(`${process.env.API}/register`, data).then(response => {
          console.log(response);
          this.$router.push('/')

          this.$q.notify({
            message: 'Successfully registered. Please check your email',
            color: 'positive',
            // avatar: '../statics/avat_atem.png',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/deja-vue-e67a1.appspot.com/o/avat_atem.png?alt=media&token=5827b153-5462-4301-81be-ade0777202d4',
            actions: [
              { label: 'Dismis', color: 'white' }
            ]
          })
          //   this.$q.loading.hide();
        }).catch(error => {
          console.log(error);
          //  console.log(navigator.onLine, this.backgroundSyncSupported)
          if (!navigator.onLine && this.backgroundSyncSupported){
            // redirrect to home page
            this.$q.notify('Could not Register: '+error.message)
            this.form = {}
            //  this.$router.push('/');
          }
          else {
            this.$q.dialog({
              title: 'Error',
              message: 'Sorry Registration failed: '+error.message
            })
            this.form = {}
          }
          // this.$q.loading.hide()
        })
      },*/

    register () {
      this.loading = true
      this.$auth
        .register(this.data)
        .then(() => {
          this.$router.push('/')
          this.$q
            .dialog({
              message: this.lang.auth.register.accountCreated
            })
            .onOk(data => {
              this.$router.push('/')
            })

        })
        .catch(error => {
          console.log(error)
          if (error.response) {
            if (error.response.status === 422) {
              this.$q.dialog({
                message: this.lang.auth.register.invalidData
              })
            } else if (error.response.status === 409) {
              this.$q.dialog({
                message: this.lang.auth.register.alreadyRegistered
              })
            } else {
              this.$q.dialog({
                message: this.lang.auth.register.error
              })
              console.error(error)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSubmit () {
      this.register()
      /*      if (this.isValidEmail(this.data.email) ) {
              this.$q.dialog({
                message: this.lang.auth.register.checkEmail(this.data.email),
                cancel: true
              })
                .onOk(() => {
                  this.register()
                })
            } else {
              this.register()
            }*/
    },

    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    },

    atem() {
      console.log('PAGE IS WORKING :::')
    },
  },
  mounted() {
    this.atem();
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 300%
  max-width: 500px
</style>
