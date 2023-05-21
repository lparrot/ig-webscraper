import path from "path";
import {app, BrowserWindow} from "electron";
import {autoUpdater} from 'electron-updater'

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow

const preload = path.join(process.env.DIST, 'preload.js')

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('update', 'Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('update', 'Update available.');
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('update', 'Update not available.');
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow('update', 'Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow('update', log_message);
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('update', 'Update downloaded');
});

function sendStatusToWindow(type: string, data: any) {
    win?.webContents?.send('message', {type, data});
}

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
        // await session.defaultSession.loadExtension(path.join(process.env.ROOT!!!, 'extensions', 'allow_cors'))
        await win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.toggleDevTools()
    } else {
        await win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
    }

    await autoUpdater.checkForUpdatesAndNotify({
        title: 'Instant-Gaming Webscraper',
        body: 'Une nouvelle version est disponible pour téléchargement.'
    })
}

app.whenReady().then(bootstrap)