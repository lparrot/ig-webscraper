import path from "path";
import {app, BrowserWindow, ipcMain, Menu, nativeImage, Tray} from "electron";
import {Server, Socket} from 'socket.io'
import {useAutoUpdater} from "./services/auto-updater.service";
import {autoUpdater} from "electron-updater";

const isDevelopment = process.env.NODE_ENV === 'development'

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = path.join(process.env.ROOT, process.env.VITE_DEV_SERVER_URL ? 'public' : '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow
let tray: Tray
export const SOCKET_IO_PORT = 8000
export let io: Server | null = null
export let socket: Socket | null = null

const preload = path.join(process.env.DIST, 'preload.js')
const iconPath = isDevelopment ? path.join('electron-extras', 'icon.png') : path.join(process.resourcesPath, 'electron-extras', 'icon.png')

async function bootstrap() {
    io = new Server(SOCKET_IO_PORT, {})

    io.on('connection', (socket_io) => {
        socket = socket_io
    })

    win = new BrowserWindow({
        webPreferences: {
            devTools: isDevelopment,
            preload,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false,
        },
    })

    win.setIcon(nativeImage.createFromPath(iconPath))

    if (process.env.VITE_DEV_SERVER_URL != null) {
        await win.loadURL(process.env.VITE_DEV_SERVER_URL)
        await win.webContents.toggleDevTools()
    } else {
        await win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
    }

    win.removeMenu()
    win.maximize()

    createTray()
}

app.whenReady().then(bootstrap)

process.on('uncaughtException', (error) => {
    console.error(error)
})

ipcMain.on('front:ready', async (event) => {
    await useAutoUpdater()
})

const createTray = () => {
    tray = new Tray(nativeImage.createFromPath(iconPath))

    const contextMenu = Menu.buildFromTemplate([
        {label: 'Vérifier les mises à jour', type: 'normal', click: async () => await autoUpdater.checkForUpdates()},
        {label: `Quitter l'application`, type: 'normal', click: () => app.quit()}
    ])

    tray.setContextMenu(contextMenu)
    tray.setToolTip('Instant-Gaming Webscraper')
}
