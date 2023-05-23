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
        <q-list class="rounded-borders" dense padding separator>
          <q-item v-for="price in game?.prices" class="text-center">
            <q-item-section>
              {{ price.toFixed(2) }} €
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup color="primary" flat label="OK"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
