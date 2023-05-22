import {contextBridge, ipcRenderer, shell} from 'electron'

console.log('---- electron/preload.ts ----')

contextBridge.exposeInMainWorld('app', {
    frontReady: () => {
        ipcRenderer.send('front:ready', true)
    },
    openLink: async (url: string) => {
        await shell.openExternal(url)
    },
})

declare global {
    interface Window {
        app: {
            frontReady: () => void;
            openLink: (url: string) => Promise<void>;
        }
    }
}
