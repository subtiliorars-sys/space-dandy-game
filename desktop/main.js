/**
 * Space Dandy: Groove Patrol — Electron main process
 * Same Steam-ready pattern as PixelSports (steamworks.js optional).
 */

const fs = require("fs");
const path = require("path");
const { app, BrowserWindow } = require("electron");

function readSteamAppId() {
  if (process.env.STEAM_APPID) {
    const fromEnv = parseInt(process.env.STEAM_APPID, 10);
    if (!Number.isNaN(fromEnv)) return fromEnv;
  }
  for (const candidate of [
    path.join(path.dirname(process.execPath), "steam_appid.txt"),
    path.join(__dirname, "steam_appid.txt"),
  ]) {
    try {
      const id = parseInt(fs.readFileSync(candidate, "utf8").trim(), 10);
      if (!Number.isNaN(id)) return id;
    } catch (_) {}
  }
  return 480;
}

let steamClient = null;

function tryInitSteam() {
  try {
    const steamworks = require("steamworks.js");
    steamClient = steamworks.init(readSteamAppId());
    console.log(`[Steam] OK — ${steamClient.localplayer.getName()}`);
  } catch (err) {
    console.warn(`[Steam] Offline mode (${err.message})`);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Space Dandy: Groove Patrol",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
    },
  });
  win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  tryInitSteam();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  if (steamClient) {
    try { steamClient.shutdown(); } catch (_) {}
  }
});
