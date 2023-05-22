import {autoUpdater} from "electron-updater";
import log from "electron-log";
import {dialog} from "electron";
import {socket} from "../main";

export const useAutoUpdater = async () => {
    autoUpdater.logger = log

    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('update:checking-for-update');
    })

    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('update:update-available', info);
    })

    autoUpdater.on('update-not-available', (info) => {
        sendStatusToWindow('update:update-not-available', info);
    })

    autoUpdater.on('error', (err) => {
        dialog.showErrorBox('Erreur: ', err == null ? 'unknown' : (err.stack || err).toString())
        sendStatusToWindow('update:error', err);
    })

    autoUpdater.on('download-progress', (progressObj) => {
        sendStatusToWindow('update:download-progress', progressObj);
    })

    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('update:update-downloaded', info);
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

    function sendStatusToWindow(type: string, data?: any) {
        socket?.emit('message', {type, data});
    }

    await autoUpdater.checkForUpdates()
}
