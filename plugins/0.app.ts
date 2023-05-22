export default defineNuxtPlugin(async nuxt => {
    const io = useSocketIo()
    await io.connect({port: 8000})
})
