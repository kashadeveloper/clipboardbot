const { app, BrowserWindow, Tray, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const botModule = require("./bot/index.js");

let win;
let botProcess = false;
let tray;
let contextMenu = Menu.buildFromTemplate([
  {
    label: "Остановить бота",
    visible: false,
    id: "stop",
    click: () => {
      stopBot();
    },
  },
  {
    label: "Запустить бота",
    id: "start",
    click: () => {
      startBot();
    },
  },
  {
    label: "Выход",
    click: () => {
      tray.destroy();
      app.quit();
    },
  },
]);

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 600,
    show: true,
    fullscreenable: false,
    resizable: false,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
    },
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  win.loadFile("index.html");
  win.once("ready-to-show", () => {});
  win.setMenuBarVisibility(false);

  win.on("minimize", (e) => {
    e.preventDefault();
    win.hide();
  });
}

function logBot(msg) {
  if (win && !win.isDestroyed()) {
    win.webContents.send("bot-log", msg);
  }
}

ipcMain.on("start-bot", startBot);
ipcMain.on("stop-bot", stopBot);

function stopBot() {
  if (!botProcess) return;

  botModule.stop();
  botProcess = false;

  let stopBtn = contextMenu.getMenuItemById("stop");
  let startBtn = contextMenu.getMenuItemById("start");

  stopBtn.visible = false;
  startBtn.visible = true;

  botModule.logger.removeListener("log", logBot);
}

function startBot() {
  if (botProcess) return;
  botModule
    .main("...", "...")
    .then(() => {
      botModule.logger.on("log", logBot);
      win.webContents.send("bot-log", "Bot started...");
    });

  botProcess = true;

  let stopBtn = contextMenu.getMenuItemById("stop");
  let startBtn = contextMenu.getMenuItemById("start");

  stopBtn.visible = true;
  startBtn.visible = false;
}

function makeTray() {
  tray = new Tray(path.join(__dirname, "icon.png"));
  tray.setTitle("ClipboardBot");
  tray.setToolTip("ClipboardBot");
  tray.on("click", () => {
    win.show();
  });

  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  makeTray();
  startBot();
});
