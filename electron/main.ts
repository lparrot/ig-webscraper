import path from "path";
import {app, BrowserWindow, session} from "electron";

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow

const preload = path.join(process.env.DIST, 'preload.js')

async function bootstrap() {
    win = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL != null) {
        await session.defaultSession.loadExtension(path.join(process.env.ROOT!!!, 'extensions', 'allow_cors'))
        await win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.toggleDevTools()
    } else {
        await win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
    }
}

app.whenReady().then(bootstrap)