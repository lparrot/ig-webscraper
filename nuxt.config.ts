import {NuxtConfig} from "nuxt/config"

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig(<NuxtConfig>{
    app: {
        head: {
            title: 'IG Webscraper'
        },
    },
    css: [
        '@/assets/app.scss'
    ],
    modules: [
        'nuxt-electron',
        'nuxt-quasar-ui',
    ],
    quasar: {
        lang: 'fr',
        extras: {
            fontIcons: ['material-icons']
        },
        plugins: ['Dialog', 'Notify', 'Loading']
    },
    experimental: {
        typedPages: true
    },
})
