<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="text-h4 q-mb-sm">Instant-Gaming Webscraper - v{{ info.version }}</div>

        <nuxt-page/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {Ref} from "vue";

const info: Ref<Partial<AppInfo>> = ref({})

window.app.frontReady()

socket.emit('action:info', (response: AppInfo) => {
  info.value = response
})
</script>

<style scoped>

</style>
