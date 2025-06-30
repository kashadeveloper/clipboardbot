import { is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, ipcRenderer, shell, Tray } from 'electron'
import path, { join } from 'path'
import { fileURLToPath } from 'url'
import icon from '../../resources/icon.png?asset'
import store from './store/store'
import * as botModule from '../bot/index'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const indexHtml = path.join(__dirname, '../renderer/index.html')

const trayIconPath = path.join(__dirname, '../../resources/icon.png')
const productionIconPath = path.join(app.getAppPath(), 'resources/icon.png')

const iconPath = app.isPackaged ? productionIconPath : trayIconPath

let tray: Tray | null = null
let botState = {
  started: false
}
let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  tray = new Tray(iconPath)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('minimize', () => {
    if (mainWindow.isDestroyed() || is.dev) return

    mainWindow.hide()
  })

  tray.on('click', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile(indexHtml)
  }
}

ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
  store.set(key, value)
  if (is.dev) store.openInEditor()
})

ipcMain.handle('tray:set', (_event, menu: Electron.Menu) => {
  if (!tray) tray = new Tray(iconPath)
  tray.setContextMenu(menu)
})

ipcMain.handle('store:get', (_event, key: string) => {
  return store.get(key)
})

ipcMain.handle('bot:start', () => {
  if (botState.started) return
  const token = store.get('token')
  const userId = store.get('userId')

  botModule.main(token, userId)
  botState.started = true
  mainWindow.webContents.send('bot:state', botState)
})

ipcMain.handle('bot:stop', () => {
  if (!botState.started) return
  botModule.stop()
  botState.started = false

  mainWindow.webContents.send('bot:state', botState)
})

botModule.logger.on('log', handleBotLogs)

function handleBotLogs(msg: string): void {
  mainWindow.webContents.send('bot:log', msg)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
