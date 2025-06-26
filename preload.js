const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  onLog: (callback) => ipcRenderer.on("bot-log", (_, msg) => callback(msg)),
  startBot: () => ipcRenderer.send("start-bot"),
  stopBot: () => ipcRenderer.send("stop-bot"),
});
