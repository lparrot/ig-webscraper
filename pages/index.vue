<template>
  <div class="flex justify-between q-mb-md">
    <div class="flex q-gutter-xs">
      <q-btn color="blue" icon="refresh" size="sm" unelevated @click="fetchGames">Rafraichir</q-btn>
      <q-btn color="orange" icon="add" size="sm" unelevated @click="promptAddGame">Ajouter jeu</q-btn>
    </div>
    <div class="flex q-gutter-xs">
      <q-btn color="red" icon="file_upload" size="sm" unelevated @click="handleImport">Importer la liste</q-btn>
      <q-btn color="green" icon="file_download" size="sm" unelevated @click="handleExport">Exporter la liste
      </q-btn>
    </div>
  </div>

  <q-table :columns="columns" :pagination="{rowsPerPage: 0, sortBy: 'prices'}" :rows="game_infos" binary-state-sort
           bordered dense flat
           row-key="id">
    <template #body="props">
      <q-tr :props="props" class="cursor-pointer" @click="onGameRowClick(props.row)">
        <q-td key="actions" :props="props" style="width: 1px">
          <q-btn color="red" dense icon="delete" size="sm" @click.stop="handleDelete(props.row)"></q-btn>
        </q-td>
        <q-td key="img" :props="props" style="width: 96px">
          <q-img :src="props.row.img" alt="image" class="rounded-borders" loading="lazy" @click.stop="openLink(props.row)"/>
        </q-td>
        <q-td key="name" :props="props">
          <div class="flex items-center no-wrap q-gutter-xs">
            <q-badge v-if="props.row.nostock" color="red" rounded/>
            <q-badge v-else color="green" rounded/>
            <span>{{ props.row.name }}</span>
          </div>
        </q-td>
        <q-td key="prices" :props="props">
          <div class="flex justify-end items-center q-gutter-xs">
            <div v-if="props.row.prices.length > 1">
              <QIcon
                v-if="props.row.prices[props.row.prices.length - 1] > props.row.prices[props.row.prices.length - 2]"
                color="red" name="north_east"></QIcon>
              <QIcon v-else color="green" name="south_east"></QIcon>
            </div>
            <div class="cursor-pointer">
              <span>{{ props.row.price?.toFixed(2) }} €</span>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { load } from 'cheerio'
import { useIntervalFn } from '@vueuse/core'
import DialogInfoGame from '~/components/DialogInfoGame.vue'

const { $db } = useNuxtApp()
const $q = useQuasar()

const game_infos = ref<GameInfo[]>([])

const columns = ref([
  { name: 'actions', field: 'actions', label: '' },
  { name: 'img', field: 'img', label: '' },
  { name: 'name', field: 'name', label: 'Nom du jeu', sortable: true, align: 'left' },
  {
    name: 'prices',
    field: 'prices',
    label: 'Prix',
    sortable: true,
    sort: (a: number[], b: number[]) => (a[ a.length - 1 ]) - (b[ b.length - 1 ])
  },
])

const search = async (query: string) => {
  let search_page = await fetch(`https://www.instant-gaming.com/en/search/?all_types=1&all_cats=1&min_price=0&max_price=100&noprice=1&min_discount=0&max_discount=100&min_reviewsavg=10&max_reviewsavg=100&noreviews=1&available_in=ES&gametype=all&sort_by=&query=${query}&page=1`)
  const content = await search_page.text()
  load(content)
}

const onGameRowClick = (game: GameInfo) => {
  const dialog = $q.dialog({
    component: DialogInfoGame,
    componentProps: {
      game,
      handleClearHistory: async (game: GameInfo) => {
        await clearPriceHistory(game)
        dialog.hide()
      }
    },
  })
}

const handleDelete = async (game: GameInfo) => {
  await $q.dialog({
    title: 'Confirmation',
    message: 'Voulez vous supprimer ce jeu de la liste ?',
    cancel: true,
    persistent: true
  })
    .onOk(async () => {
      await $db.gameInfos.delete(game.id)
      game_infos.value = game_infos.value.filter(it => it.id !== game.id)
    })
}

const handleImport = async () => {
  socket.emit('action:import_file', async (response: any) => {
    if (response == null) {
      return
    }

    try {
      $q.loading.show()
      const gameUrls = JSON.parse(response)

      if (Array.isArray(gameUrls)) {
        await $db.gameInfos.clear()
        for await (let url of gameUrls) {
          await addGame(url)
        }
      }
    } finally {
      $q.loading.hide()
      await fetchGames()
      socket.emit('action:message', {
        title: 'Import terminé',
        message: 'Import terminé avec succès'
      })
    }
  })
}

const handleExport = async () => {
  const games = await $db.gameInfos.toArray()
  socket.emit('action:export_file', games.map(it => it.url))
}

const openLink = async (game: GameInfo) => {
  await window.app.openLink(game.url)
}

const promptAddGame = async () => {
  await $q.dialog({
    title: 'Ajouter un jeu',
    message: `Donnez l'url de la page du jeu sur le site Instant-Gaming`,
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true,
    persistent: true
  })
    .onOk(async (payload: string) => {
      if (payload == null || payload.trim() === '') {
        return
      }
      const game_info = await addGame(payload)

      if (game_info != null) {
        game_infos.value.push(game_info)
      }
    })

}

const clearPriceHistory = async (game: GameInfo) => {
  await $db.gameInfos.delete(game.id)
  await addGame(game.url)
  await fetchGames()
}

const getGameInfo = async (url: string): Promise<GameInfo> => {
  const page = await $fetch<string>(url, { responseType: 'text' })
  const $ = await load(page)

  return {
    id: Number($(`meta[itemprop="sku"]`).attr('content')),
    url,
    name: $('.name .game-title').text(),
    img: $(`meta[itemprop="image"]`).attr('content')!!!,
    nostock: $('.subinfos .nostock').length > 0,
    price: Number($(`meta[itemprop="price"]`).attr('content')),
    prices: []
  }
}

const addGame = async (url: string) => {
  const page = await $fetch<string>(url, { responseType: 'text' })
  const $ = await load(page)

  const info = await getGameInfo(url)

  if (await $db.gameInfos.get(info.id) != null) {
    return
  }

  await $db.gameInfos.add({
    id: Number($(`meta[itemprop="sku"]`).attr('content')),
    url,
    name: $('.name .game-title').text(),
    img: $(`meta[itemprop="image"]`).attr('content')!!!,
    prices: [info.price!!!],
  })

  return info
}

if (await $db.gameInfos.count() === 0) {
  const games = [
    'https://www.instant-gaming.com/en/11030-buy-v-rising-pc-game-steam/',
    'https://www.instant-gaming.com/en/8256-buy-smalland-survive-the-wilds-pc-game-steam/',
    'https://www.instant-gaming.com/en/13246-buy-zero-sievert-pc-game-steam/',
    'https://www.instant-gaming.com/en/7591-buy-medieval-dynasty-digital-supporter-edition-digital-supporter-edition-pc-game-steam/',
    'https://www.instant-gaming.com/en/12710-buy-stranded-alien-dawn-pc-game-steam/',
    'https://www.instant-gaming.com/en/13689-buy-age-of-wonders-4-pc-game-steam-europe/',
    'https://www.instant-gaming.com/en/9082-buy-icarus-pc-game-steam/',
    'https://www.instant-gaming.com/en/10006-buy-the-last-stand-aftermath-pc-game-steam/',
    'https://www.instant-gaming.com/en/5692-buy-crusader-kings-iii-pc-mac-game-steam/',
    'https://www.instant-gaming.com/en/9254-buy-wartales-pc-game-steam/'
  ]

  for await (const game of games) {
    await addGame(game)
  }
}

const fetchGames = async () => {
  game_infos.value = []
  const games = await $db.gameInfos.toArray()

  for await (const game of games) {
    const game_info = await fetchGame(game.id)

    if (game_info != null) {
      game_infos.value.push(game_info)
    }
  }
}

const fetchGame = async (id: number): Promise<GameInfo | null> => {
  const game = await $db.gameInfos.get(id)

  if (game == null) {
    return null
  }

  const info = await getGameInfo(game.url)

  if (game.prices[ game.prices.length - 1 ] !== info.price) {
    game.prices.push(info.price!!!)
    $db.gameInfos.update(game.id, { prices: game.prices })
  }

  return {
    ...game,
    nostock: info.nostock,
    price: game.prices[ game.prices.length - 1 ]
  }
}

const { pause } = useIntervalFn(async () => {
  await fetchGames()
}, 5 * 60 * 1000, { immediateCallback: true })

onBeforeUnmount(() => {
  pause()
})
</script>

<style scoped>

</style>
