<script lang="ts" setup>
const props = withDefaults(defineProps<{
  game?: GameInfo,
  handleClearHistory?: (game: GameInfo) => void
}>(), {})


const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card :style="$q.screen.gt.xs ? 'min-width: 480px': 'min-width: 100%'" class="column">
      <q-card-section class="row q-pb-none">
        <div class="col row q-gutter-sm">
          <div>
            <q-img :src="game?.img" alt="image" class="rounded-borders" width="96px"/>
          </div>
          <div class="col text-h5">{{ game.name }}</div>
        </div>
        <q-space/>
        <div>
          <q-btn v-close-popup dense flat icon="close" round/>
        </div>
      </q-card-section>

      <q-card-section class="col">
        <div class="flex items-center q-gutter-sm text-h6">
          <div>
            <span>Historique des prix</span>
          </div>
          <div v-if="game?.prices.length > 1">
            <q-btn color="red" icon="delete" size="xs" @click="props.handleClearHistory(game!)">Vider</q-btn>
          </div>
        </div>

        <q-list class="rounded-borders" dense padding separator>
          <q-item v-for="price in game?.prices">
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
