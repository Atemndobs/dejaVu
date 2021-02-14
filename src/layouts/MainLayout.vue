<template>
  <q-layout view="lHh Lpr lFf">

    <q-header
      bordered
      class="bg-white text-grey-10">
      <q-toolbar class="constrain">

        <q-btn
          class="large-screen-only q-mr-sm"
          to="/camera"
          icon="eva-camera-outline"
          round
          text-color="black"
          size="18px"
          dense
        />
       <q-separator
          class="large-screen-only"
          vertical
          spaced
        />
        <q-toolbar-title
          class="text-grand-hotel text-capitalise text-bold"
        >
          DejaVu
        </q-toolbar-title>
        <q-fab
          icon="menu"
          direction="left"
          text-color="black"
          padding="xs"
          flat
        >
          <q-fab-action external-label label-position="left"
                        to="/audio"
                        icon="eva-headphones-outline"
                        text-color="black"
                        size="18px"
                        rounded
                        dense
                        label=""
                        padding="xs"
                        flat
          />
          <q-fab-action external-label label-position="left"
                        to="/battery"
                        icon="eva-battery"
                        text-color="black"
                        size="18px"
                        rounded
                        dense
                        label=""
                        padding="xs"
                        flat
          />
          <q-fab-action external-label label-position="left"
                        to="/photo"
                        icon="eva-camera"
                        text-color="black"
                        size="18px"
                        rounded
                        dense
                        label=""
                        padding="xs"
                        flat
          />
          <q-fab-action external-label label-position="left"
                        to="/location"
                        icon="eva-navigation"
                        round
                        text-color="black"
                        size="18px"
                        dense
                        label=""
                        padding="xs"
                        flat
          />
          <q-fab-action external-label label-position="left"
                        to="/pay"
                        icon="eva-shopping-bag-outline"
                        round
                        text-color="black"
                        size="18px"
                        dense
                        label=""
                        padding="xs"
                        flat
          />
          <q-fab-action external-label label-position="left"
                        to="/paypalclient"
                        icon="eva-shopping-bag"
                        round
                        text-color="black"
                        size="18px"
                        dense
                        label=""
                        padding="xs"
                        flat
          />
        </q-fab>
        <q-btn
          class="q-mr-sm"
          to="/pay"
          icon="eva-shopping-bag-outline"
          round
          text-color="black"
          size="18px"
          dense
        />
        <q-btn
          class="q-mr-sm"
          to="/express"
          icon="eva-unlock-outline"
          round
          text-color="black"
          size="18px"
          dense
        />
        <q-separator
          class="large-screen-only"
          vertical
          spaced
        />
<!--        <q-page-sticky position="top-right" :offset="fabPos">
          <q-fab
            icon="mdi-account-key"
            direction="left"
            padding="xs"

            :disable="draggingFab"
            v-touch-pan.prevent.mouse="moveFab"
          >
            <q-fab-action  icon="eva-heart" :disable="draggingFab" padding="xs" />
            <q-fab-action  icon="thumb_up" :disable="draggingFab" padding="xs" />
          </q-fab>
        </q-page-sticky>-->
        <q-btn
          class="large-screen-only"
          to="/"
          icon="eva-home-outline"
          round
          text-color="black"
          size="18px"
          dense
        />
        <q-separator
          class="large-screen-only"
          vertical
          spaced
        />
        <q-item
          v-if="!this.$auth.check()"
          class="large-screen-only"
        >
          <q-item-section >
            <q-btn
              class="q-mr-sm"
              to="/login"
              icon="login"
              round
              text-color="black"
              size="18px"
              dense
            />
          </q-item-section>

        </q-item >

        <q-item
          v-else
        >
          <q-item-section  >
            <q-btn
              class="large-screen-only"
              to="/account/home"
              icon="person"
              text-color="black"
              size="18px"
              rounded
              dense
            />
          </q-item-section>
          <q-item-section >
            <q-btn
              class="large-screen-only q-mr-sm"
              to="/logout"
              icon="power_settings_new"
              round
              text-color="black"
              size="18px"
              dense
            />
          </q-item-section>
        </q-item>
        <q-item>
          <!-------- Dark mode activations------------->
          <!--------    :icon="$q.dark.isActive ? 'eva-settings' : 'eva-settings-outline'"  ------------>
          <q-item-section>
            <q-btn

              color="grey"
              flat
              dense
              round
              @click="$q.dark.isActive ? $q.dark.set(false) : $q.dark.set(true)"
              no-caps
            >
              <q-badge color="grey" transparent>{{$q.dark.isActive ?'Light' :'Dark'}}</q-badge>
            </q-btn>
            <q-separator
              vertical
              spaced
            />
          </q-item-section>
<!--          <q-toggle :value="$q.dark.isActive" @click="$q.dark.toggle()" />-->
          <!-------- Dark mode activations------------->
        </q-item>
      </q-toolbar>
    </q-header>


    <q-footer
      class="bg-white "
      bordered
      >

      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="constrain">
            <q-banner
              class="bg-primary text-white"
              inline-actions
              dense
            >

              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  icon="eva-camera-outline"
                  text-color="grey-10"
                  font-size="22ps"
                />


              </template>

              <b> Install DejaVu? </b>


              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  class="q-px-sm"
                  dense
                  flat
                  label="YES"
                />
                <q-btn
                  @click="showAppInstallBanner = false"
                  class="q-px-sm"
                  dense
                  flat
                  label="LATER"
                />
                <q-btn
                  @click="neverShowAppInstall"
                  class="q-px-sm"
                  dense
                  flat
                  label="NEVER"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
        <q-tabs
          class="text-grey-10 small-screen-only"
          active-color="primary"
          indicator-color="transparent"
          >
          <q-route-tab
            to="/"
            icon="eva-home-outline"
          />

          <q-route-tab
            to="/camera"
            icon="eva-camera-outline"
          />
        </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
    <q-page-sticky
      :offset="fabPos"
      :disable="draggingFab"
      v-touch-pan.prevent.mouse="moveFab"
      position="top-right"
    >
      <q-item
        v-if="!this.$auth.check()"
      >
        <q-item-section >
          <q-btn
            to="/login"
            icon="login"
            round
            text-color="black"
            size="18px"
            dense
          />
        </q-item-section>

      </q-item >
      <q-item v-else>
        <q-fab
          icon="menu"
          direction="left"
          text-color="black"
          glossy
          padding="xs"
        >
          <q-fab-action external-label label-position="left"
              to="/account/home"
              icon="person"
              text-color="black"
              size="18px"
              rounded
              dense
              color="amber-1"
              label=""
              padding="xs"
            />
          <q-fab-action external-label label-position="left"
              to="/logout"
              icon="power_settings_new"
              round
              text-color="black"
              size="18px"
              dense
              color="amber-1"
              label=""
              padding="xs"
            />
          <q-fab-action external-label label-position="left"
                        to="/settings"
                        icon="settings"
                        round
                        text-color="black"
                        size="18px"
                        dense
                        color="amber-1"
                        label=""
                        padding="xs"
          />
        </q-fab>
      </q-item>
    </q-page-sticky>
  </q-layout>

</template>

<script >
let deferredPrompt;

window.Pusher = require('pusher-js');

export default {
  name: 'MainLayout',
  data() {
    return {
      loggedInUser:'atem',
      showAppInstallBanner: false,
      fabPos: [ 18, 18 ],
      draggingFab: false
    }
  },
  mounted() {
    let neverShowAppInstall = this.$q.localStorage.getItem('neverShowAppInstall')

    if (!neverShowAppInstall) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {

        }, 3000)
        this.showAppInstallBanner = true
      });
    }


  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.neverShowAppInstall()
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    },
    neverShowAppInstall(){
      this.showAppInstallBanner = false

      this.$q.localStorage.set('neverShowAppInstall', true)
    },
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    }
  },
  computed: {
    toggleDark: {
      get() {
        return this.$q.dark.isActive
      },
      set(val) {
        this.$q.dark.set(val)
      }
    }
  }
};
</script>

<style lang="sass">
  .q-toolbar
    @media (min-width: $breakpoint-sm-min)
      height: 77px
  .q-toolbar__title
    font-size: 30px
    @media (max-width: $breakpoint-xs-max)
      text-align: center

  .q-footer
    .q-tab__icon
      font-size: 30px
</style>
