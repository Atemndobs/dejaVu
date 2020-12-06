<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ lang.auth.register.register }}
        </div>
      </q-card-section>
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            v-model.trim="data.name"
            type="text"
            label="name"
          />
          <q-input
            v-model.trim="data.username"
            type="text"
            :label="lang.auth.fields.username"
            :rules="validations['username']"
            lazy-rules
          />
          <q-input
            v-if="identifierField === 'email'"
            id="email"
            v-model.trim="data.email"
            type="email"
            :label="lang.auth.fields.email"
            bottom-slots
            autofocus
            :rules="validations['email']"
            lazy-rules
          />
          <slot
            name="extraFields"
            :data="data"
          />
          <q-input
            id="password"
            v-model="data.password"
            :type="showPassword.password ? 'text' : 'password'"
            :label="lang.auth.fields.password"
            bottom-slots
            :rules="validations['password']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword.password ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword.password = !showPassword.password"
              />
            </template>
          </q-input>
          <q-input
            id="repeatPassword"
            v-model.trim="data.password_confirmation"
            :type="showPassword.repeatPassword ? 'text' : 'password'"
            :label="lang.auth.fields.repeatPassword"
            bottom-slots
            required
            :rules="validations['repeatPassword']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword.repeatPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword.repeatPassword = !showPassword.repeatPassword"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="lang.auth.register.register"
            :loading="loading"
            color="primary"
            type="submit"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-sm">
          <q-btn
            to="/login"
            class="text-grey-6"
          >
            Return to login
          </q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import prompts from 'app/quasar.extensions.json'

import isEmail from 'validator/es/lib/isEmail'
import equals from 'validator/es/lib/equals'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric'

export default {
  name: 'Register',
  props: {
    extraFields: {
      type: Object,
      default: () => ({})
    },
    minPasswordLength: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      page: 'register',
      lang: {
        auth: {}
      },
      data: {
        name: 'Atem Ndobs',
        username: 'atem',
        email: 'bamarktfact@gmail.com',
        password: 'pass1234',
        password_confirmation: 'pass1234',
        ...this.extraFields
      },
      loading: false,
      validations: {
        email: [
          val => !!val || this.lang.auth.validations.required,
          val => isEmail(val) || this.lang.auth.validations.email
        ],
        username: [
          val => !!val || this.lang.auth.validations.required,
          val => isAlphanumeric(val) || this.lang.auth.validations.username
        ],
        password: [
          val => !!val || this.lang.auth.validations.required,
          val =>
            val.length >= this.minPasswordLength ||
            this.lang.auth.validations.passwordLength(this.minPasswordLength)
        ],
        repeatPassword: [
          val => !!val || this.lang.auth.validations.required,
          val =>
            equals(val, this.data.password) ||
            this.lang.auth.validations.passwordMatch
        ]
      },
      identifierField: prompts['http-authentication'].identifierField,
      showPassword: {
        password: false,
        repeatPassword: false
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
    register () {
      this.loading = true
      this.$auth
        .register(this.data)
        .then(() => {
          console.log('this.lang.auth.register')
          this.$q
            .dialog({
              message: this.lang.auth.register.accountCreated
            })
            .onOk(data => {
              this.$router.push('/login')
            })
        })
        .catch(error => {
          if (error.response) {

            if (error.response.status === 422) {

              if (error.response.data.errors.password &&
                error.response.data.errors.password.length !== 0) {
                this.$q.dialog({
                  // message: this.lang.auth.register.invalidData
                  message: error.response.data.errors.password[0]
                })
              }
                else if (error.response.data.errors.email &&
                  error.response.data.errors.email.length !== 0 &&
                  error.response.data.errors.username &&
                  error.response.data.errors.username.length !== 0
              ) {
                  this.$q.dialog({
                    // message: this.lang.auth.register.invalidData
                    message: [
                      error.response.data.errors.username[0],
                      error.response.data.errors.email[0]
                    ]
                  })
                }
                else if (error.response.data.errors.email &&
                  error.response.data.errors.email.length !== 0) {
                  this.$q.dialog({
                    // message: this.lang.auth.register.invalidData
                    message: error.response.data.errors.email[0]
                  })
                }
                else if (error.response.data.errors.username &&
                  error.response.data.errors.username.length !== 0){
                  this.$q.dialog({
                    // message: this.lang.auth.register.invalidData
                    message: error.response.data.errors.username[0]
                  })

              }
                else {
                this.$q.dialog({
                  // message: this.lang.auth.register.invalidData
                  message: error.response.errors.message
                })
              }
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
      if (this.identifierField === 'email') {
        this.$q.dialog({
          message: this.lang.auth.register.checkEmail(this.data.email),
          cancel: true
        })
          .onOk(() => {
            this.register()
          })
      } else {
        this.register()
      }
    }
  },
}
</script>
