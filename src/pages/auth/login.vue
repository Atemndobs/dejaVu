<template>
  <q-page class="flex flex-center">
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ lang.auth.login.login }}
        </div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            v-if="identifierField === 'email'"
            id="email"
            v-model.trim="data.body.email"
            type="email"
            :label="lang.auth.fields.email"
            :rules="validations['email']"
            lazy-rules
            autofocus
          />
          <q-input
            v-if="identifierField === 'username'"
            v-model.trim="data.body.username"
            type="text"
            :label="lang.auth.fields.username"
            :rules="validations['username']"
            lazy-rules
          />
          <q-input
            id="password"
            v-model="data.body.password"
            :type="showPassword ? 'text' : 'password'"
            :label="lang.auth.fields.password"
            :rules="validations['password']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <br>
          <q-checkbox
            id="rememberMe"
            v-model="data.rememberMe"
            :label="lang.auth.login.rememberMe"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="lang.auth.login.login"
            color="primary"
            :loading="loading"
            type="submit"
          />
        </q-card-actions>
      </q-form>
      <router-link to="/password/forgot">
        <a>{{ lang.auth.login.passwordForgot }}</a>
      </router-link>


      <q-card-section>
        <router-link to="/verification/resend">
          <a>resend Verification</a>
        </router-link>
      </q-card-section>
      <q-card-section>
        <a>{{ lang.auth.login.registerMessage }} </a>

          <q-card-section class="text-center q-pa-sm">
            <q-btn
              to="/register"
              class="text-grey-6"
            >
              {{ lang.auth.login.register }}
            </q-btn>
          </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import prompts from 'app/quasar.extensions.json'

import isEmail from 'validator/es/lib/isEmail'

export default {
  name: 'Login',
  data () {
    return {
      page: 'login',
      lang: {
        auth: {}
      },
      data: {
        body: {
          email: 'bamarktfact@gmail.com',
          password: 'pass1234'
        },
        rememberMe: false
      },
      loading: false,
      validations: {
        email: [
          val => !!val || this.lang.auth.validations.required,
          val => isEmail(val) || this.lang.auth.validations.email
        ],
        username: [
          val => !!val || this.lang.auth.validations.required
        ],
        password: [val => !!val || this.lang.auth.validations.required]
      },
      identifierField: prompts['http-authentication'].identifierField,
      showPassword: false
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

    onSubmit () {
      this.loading = true
      this.$auth
        .login(this.data)
        .then(response => {
          this.$auth.fetch()
          this.$router.replace('/')
          this.$store.dispatch('auth/loginCallback')
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              console.log(error.response.data.errors)
              this.$q.dialog({

                message: error.response.data.errors.message
              })
            } else if (error.response.status === 422) {

              if (error.response.data.errors.password &&
                error.response.data.errors.password.length !== 0) {
                this.$q.dialog({
                  // message: this.lang.auth.register.invalidData
                  message: error.response.data.errors.password[0]
                })
              }
              if (error.response.data.errors.email &&
                error.response.data.errors.email.length !== 0) {
                this.$q.dialog({
                  // message: this.lang.auth.register.invalidData
                  message: error.response.data.errors.email[0]
                })
              }
              if (error.response.data.errors.username &&
                error.response.data.errors.username.length !== 0){
                this.$q.dialog({
                  // message: this.lang.auth.register.invalidData
                  message: error.response.data.errors.username[0]
                })
              }
              else {
                this.$q.dialog({

                  message: error.response.data.errors.message
                })
              }
            }
            else {
              console.error(error.response)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
