<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div class="text-h3">Instant-Gaming Webscraper - lauparr</div>

        <nuxt-page/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
const $q = useQuasar()

io.on('message', ({type, data}) => {
  switch (type) {
    case 'update:checking-for-update':
      $q.notify({message: 'Vérification des mises à jour.', color: 'blue', position: 'bottom-right'})
      break
    case 'update:update-not-available':
      $q.notify({message: 'Aucune mise à jour disponible.', color: 'blue', position: 'bottom-right'})
      break
    case 'update:update-available':
      $q.notify({
        message: 'Une mise à jour est disponible. Téléchargement en cours ...',
        color: 'blue',
        position: 'bottom-right'
      })
      break
    default:
      break
  }
})

window.app.frontReady()
</script>

<style scoped>

</style>
