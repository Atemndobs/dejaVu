<template>
  <q-page class="flex flex-center">
    <p>
      Welcome {{ this.$auth.user().name }}
    </p>
  </q-page>
</template>

<script>
export default {
  name: 'AccountHome'
}
</script>
