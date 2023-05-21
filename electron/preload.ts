import {contextBridge, shell} from 'electron'

console.log('---- electron/preload.ts ----')

contextBridge.exposeInMainWorld('app', {
  openLink: async (url: string) => {
    await shell.openExternal(url)
  }
})

declare global {
  interface Window {
    app: {
      openLink: (url: string) => Promise<void>
    }
  }
}
