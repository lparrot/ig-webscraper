import {socket} from "../main";
import {dialog} from "electron";
import fs from 'fs'

export const useIoActions = async () => {
    socket?.on('action:message', message => {
        dialog.showMessageBox({
            ...message
        })
    })

    socket?.on('action:export_file', games => {
        const filename = dialog.showSaveDialogSync({
            title: 'Exporter les données',
            defaultPath: 'export_ig_webscraper_games.json',
            buttonLabel: 'Enregistrer',
            filters: [
                {name: 'JSON', extensions: ['json']}
            ]
        })

        if (filename != null) {
            fs.writeFileSync(filename, JSON.stringify(games), {encoding: 'utf-8'})
            dialog.showMessageBox({
                title: 'Export terminé',
                message: 'Export terminé avec succès'
            })
        }
    })

    socket?.on('action:import_file', async (callback) => {
        callback = typeof callback == "function" ? callback : () => {
        }

        const filename = dialog.showOpenDialogSync({
            title: 'Importer le fichier',
            buttonLabel: 'Ouvrir',
            filters: [
                {name: 'JSON', extensions: ['json']}
            ]
        })

        if (filename != null && filename.length) {
            const content = fs.readFileSync(filename[0], {encoding: 'utf-8'})
            await callback(content)
        }
    })
}