<template>
  <q-layout>
    <div class="text-h3">Instant-Gaming Webscraper</div>
    <q-page-container>
      <q-page padding>
        <nuxt-page/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
window.app.onMessage(({type, data}) => {
  console.log({type, data})
})
</script>

<style scoped>

</style>