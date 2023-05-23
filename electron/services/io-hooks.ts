import {socket} from "../main";
import {dialog} from "electron";
import fs from 'fs'

export const useIoActions = async () => {
    socket?.on('action:export_file', games => {
        const filename = dialog.showSaveDialogSync({
            title: 'Enregistrer le fichier sous ...',
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
}