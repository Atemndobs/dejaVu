// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <q-icon name="eva-battery-outline" size="50px"/>
      </q-card-section>
      <q-card-section>
        <div>
          Battery status is: <strong>{{ batteryStatus }}</strong>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      batteryStatus: 'determining...'
    }
  },
  methods: {
    updateBatteryStatus (status) {
      this.batteryStatus = `Level: ${status.level}, plugged: ${status.isPlugged}`
    }
  },
  created () {
    // we register the event like on plugin's doc page
    window.addEventListener('batterystatus', this.updateBatteryStatus, false)
  },
  beforeDestroy () {
    // we do some cleanup;
    // we need to remove the event listener
    window.removeEventListener('batterystatus', this.updateBatteryStatus, false)
  }
}
</script>
