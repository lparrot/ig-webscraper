<script lang="ts" setup>
const props = withDefaults(defineProps<{ game?: GameInfo }>(), {})

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">Historique des prix</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-for="price in game?.prices">
          {{ price.toFixed(2) }} €
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup color="primary" flat label="OK"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
