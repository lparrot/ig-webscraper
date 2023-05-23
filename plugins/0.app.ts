import {socket} from "~/composables/useSocketIo";

export default defineNuxtPlugin(async nuxt => {
    const $q = useQuasar()
    const {connect} = useSocketIo()

    await connect({port: 8000})


    socket.on('message', ({type, data}) => {
        switch (type) {
            case 'update:update-available':
                $q.notify({
                    message: 'Une mise à jour est disponible. Téléchargement en cours ...',
                    color: 'blue',
                    position: 'bottom-right',
                    group: false
                })
                break
            case 'update:update-not-available':
                $q.notify({
                    message: 'Aucune mise à jour disponible.',
                    color: 'blue',
                    position: 'bottom-right',
                    group: false
                })
                break
            default:
                break
        }
    })
})
