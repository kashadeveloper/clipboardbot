const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

function getScriptPath() {
  const embeddedPath = path.join(__dirname, 'scripts', 'clipboard-files.ps1');

  if (process.pkg) {
    const tempPath = path.join(os.tmpdir(), 'clipboard-files.ps1');
    const scriptData = fs.readFileSync(embeddedPath, 'utf8');
    fs.writeFileSync(tempPath, scriptData, 'utf8');
    return tempPath;
  }

  return embeddedPath;
}

async function getClipboardFiles() {
  const scriptPath = getScriptPath();

  try {
    const { stdout } = await execFileAsync('powershell', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-Command',
      `chcp 65001 >$null; & '${scriptPath}'`
    ]);

    return stdout
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  } catch (err) {
    console.error('Ошибка при запуске PowerShell:', err);
    return [];
  }
}

module.exports = getClipboardFiles;
