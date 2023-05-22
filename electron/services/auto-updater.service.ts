import {autoUpdater} from "electron-updater";
import log from "electron-log";
import {dialog} from "electron";
import {socket} from "../main";

export const useAutoUpdater = async () => {
    autoUpdater.logger = log

    autoUpdater.on('checking-for-update', () => {
        sendIOMessage('update:checking-for-update');
    })

    autoUpdater.on('update-available', (info) => {
        sendIOMessage('update:update-available', info);
    })

    autoUpdater.on('update-not-available', (info) => {
        sendIOMessage('update:update-not-available', info);
    })

    autoUpdater.on('error', (err) => {
        dialog.showErrorBox('Erreur: ', err == null ? 'unknown' : (err.stack || err).toString())
        sendIOMessage('update:error', err);
    })

    autoUpdater.on('download-progress', (progressObj) => {
        sendIOMessage('update:download-progress', progressObj);
    })

    autoUpdater.on('update-downloaded', (info) => {
        sendIOMessage('update:update-downloaded', info);
        const dialogOpts = {
            type: 'info',
            buttons: ['Redémarrer maintenant', 'Installer plus tard...'],
            title: 'Mise à jour applicative',
            message: 'Nouvelle version disponible',
            detail: `Une nouvelle version a été téléchargée. Redémarrez l'application pour finaliser l'opération.`,
        }

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    });

    function sendIOMessage(type: string, data?: any) {
        socket?.emit('message', {type, data});
    }

    await autoUpdater.checkForUpdates()
}
