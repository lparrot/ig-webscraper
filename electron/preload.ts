import {contextBridge, ipcRenderer, shell} from 'electron'

console.log('---- electron/preload.ts ----')

contextBridge.exposeInMainWorld('app', {
    openLink: async (url: string) => {
        await shell.openExternal(url)
    },
    onMessage: async (callback: (payload: { type: string, data: any }) => void) => {
        ipcRenderer.on('message', async (event, {type, data}) => {
            await callback({type, data})
        })
    }
})

declare global {
    interface Window {
        app: {
            openLink: (url: string) => Promise<void>;
            onMessage: (callback: (payload: { type: string; data: any }) => void) => Promise<void>;
        }
    }
}
